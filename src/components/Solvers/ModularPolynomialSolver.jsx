import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Layers, Table } from 'lucide-react';
import {
  isPrime,
  parseBigInt,
  solveModularPolynomial,
  solvePolynomialByPrimePowers,
} from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  ResidueChips,
  ScrollableTable,
  SolverHeader,
} from '../ui/SolverPrimitives';

/** Lifting steps shown per prime power before the list is cut off. */
const LIFT_STEP_LIMIT = 40;

/**
 * Hensel's lemma on each prime power of m, then the CRT (NTIC §7.2,
 * Algorithm 16.1.5). Shown for composite moduli, where it explains *why* the
 * scan found the roots it did — and for large prime powers, where the scan is
 * truncated but lifting still finds every root.
 */
function PrimePowerMethod({ result, scanTruncated }) {
  const { t } = useApp();
  if (!result) return null;
  if (!result.ok) {
    return <EngineMessage code={result.code} vars={result.vars} tone="info" title={t('solvers.hensel.heading')} />;
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4">
      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
        <Layers className="w-4 h-4" aria-hidden="true" />
        {t('solvers.hensel.heading')}
      </h4>
      <p className="text-xs text-slate-300 leading-relaxed">
        {t('solvers.hensel.explain', { m: result.modulus })}
      </p>
      <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
        <MathRender math={`${result.modulus} = ${result.factorString}`} block />
      </div>

      <ul className="space-y-3 list-none">
        {result.components.map((component) => (
          <li
            key={component.modulus.toString()}
            className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2"
          >
            <div className="text-xs font-semibold text-slate-200">
              {t('solvers.hensel.componentRoots', {
                count: component.roots.length,
                m: component.modulus,
              })}
            </div>
            {component.roots.length > 0 && <ResidueChips values={component.roots} tone="indigo" />}
            {component.power > 1n && (
              <details className="text-xs text-slate-300">
                <summary className="cursor-pointer text-indigo-300 hover:text-indigo-200">
                  {t('solvers.hensel.showLifting')}
                </summary>
                <ol className="mt-2 space-y-1.5 list-none">
                  {component.levels.map((level) => (
                    <li key={level.modulus.toString()} className="overflow-x-auto overflow-y-hidden py-0.5">
                      <MathRender
                        math={`\\pmod{${component.prime}^{${level.exponent}}}: \\; x \\in \\{${level.roots.join(', ') || '\\,'}\\}`}
                      />
                    </li>
                  ))}
                </ol>
                <ol className="mt-2 space-y-1.5 list-none border-t border-slate-800 pt-2">
                  {component.steps.slice(0, LIFT_STEP_LIMIT).map((step, index) => (
                    // Steps are positional; a root can be lifted at several levels.
                    <li key={index} className="overflow-x-auto overflow-y-hidden py-0.5">
                      <MathRender math={step.latex} />
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </li>
        ))}
      </ul>

      <div className="pt-2 border-t border-slate-800 space-y-2">
        <p className="text-xs font-semibold text-slate-200">
          {t('solvers.hensel.combined', {
            product: result.components.map((c) => c.roots.length).join(' · '),
            count: result.count,
            m: result.modulus,
          })}
        </p>
        {result.roots && result.roots.length > 0 && <ResidueChips values={result.roots} />}
        {result.truncated && (
          <p className="text-xs text-amber-400">{t('solvers.hensel.tooManyToCombine')}</p>
        )}
        {scanTruncated && result.roots && (
          <p className="text-xs text-emerald-300">{t('solvers.hensel.beatsScan')}</p>
        )}
      </div>
    </div>
  );
}

/** How many evaluation rows to render; the scan itself goes further. */
const TABLE_ROW_LIMIT = 200;

const COEFFICIENT_KEYS = ['a5', 'a4', 'a3', 'a2', 'a1', 'a0'];

/** `latex` goes into the rendered polynomial; `label` into the field caption. */
const TERMS = {
  a5: { latex: 'x^5', label: 'x⁵' },
  a4: { latex: 'x^4', label: 'x⁴' },
  a3: { latex: 'x^3', label: 'x³' },
  a2: { latex: 'x^2', label: 'x²' },
  a1: { latex: 'x', label: 'x' },
  a0: { latex: null, label: null },
};

/**
 * Build the LaTeX for the polynomial, skipping zero terms and folding signs so
 * a coefficient of -3 renders as "− 3x³" instead of "+ -3x³".
 */
function polynomialLatex(coefficients) {
  const terms = [];

  for (const key of COEFFICIENT_KEYS) {
    const value = parseBigInt(coefficients[key]);
    if (value === null) return null;
    if (value === 0n && key !== 'a0') continue;

    const magnitude = value < 0n ? -value : value;
    const power = TERMS[key].latex;

    let body;
    if (power === null) body = `${magnitude}`;
    else if (magnitude === 1n) body = power;
    else body = `${magnitude}${power}`;

    if (terms.length === 0) {
      terms.push(value < 0n ? `-${body}` : body);
    } else {
      terms.push(`${value < 0n ? '-' : '+'} ${body}`);
    }
  }

  return terms.length > 0 ? terms.join(' ') : '0';
}

export default function ModularPolynomialSolver() {
  const { engine, t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('modular_poly', {
    a5: '0',
    a4: '0',
    a3: '1',
    a2: '0',
    a1: '2',
    a0: '1',
    b: '0',
    mod: '7',
  });

  const polyLatex = useMemo(() => polynomialLatex(values), [values]);

  // The engine takes coefficients in ascending degree: index i holds x^i.
  const result = useMemo(
    () =>
      solveModularPolynomial(
        [values.a0, values.a1, values.a2, values.a3, values.a4, values.a5],
        values.b,
        values.mod,
        engine.polynomial
      ),
    [values, engine.polynomial]
  );

  // Only worth showing when m has more structure than a single prime.
  const primePowers = useMemo(() => {
    const m = parseBigInt(values.mod);
    if (m === null || m < 4n || isPrime(m)) return null;
    return solvePolynomialByPrimePowers(
      [values.a0, values.a1, values.a2, values.a3, values.a4, values.a5],
      values.b,
      m,
      { scanLimit: engine.polynomial.scanLimit, budget: engine.factorisation.budget }
    );
  }, [values, engine.polynomial, engine.factorisation]);

  const summary = useMemo(() => {
    if (!result.ok || !polyLatex) return null;
    const roots = result.roots.length > 0 ? result.roots.join(', ') : '\\varnothing';
    return `${polyLatex} \\equiv ${values.b} \\pmod{${values.mod}} \\implies x \\in \\{${roots}\\}`;
  }, [result, polyLatex, values.b, values.mod]);

  useAutoSaveHistory('modular_poly', values, summary);

  const visibleRows = result.ok ? result.evaluations.slice(0, TABLE_ROW_LIMIT) : [];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.modular_poly.title" badge="f(x) ≡ b (mod m)" />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {COEFFICIENT_KEYS.map((key) => (
            <IntegerField
              key={key}
              label={
                TERMS[key].label
                  ? t('fields.coefficientOf', { term: TERMS[key].label })
                  : t('fields.constantTerm')
              }
              value={values[key]}
              onChange={(next) => setValue(key, next)}
              invalid={parseBigInt(values[key]) === null}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <IntegerField
            label={t('fields.targetValueB')}
            value={values.b}
            onChange={(next) => setValue('b', next)}
            invalid={parseBigInt(values.b) === null}
          />
          <IntegerField
            label={t('fields.modulusM')}
            value={values.mod}
            onChange={(next) => setValue('mod', next)}
            invalid={!result.ok}
          />
        </div>

        {polyLatex && (
          <div className="text-center p-3 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
            <MathRender math={`${polyLatex} \\equiv ${values.b} \\pmod{${values.mod}}`} block />
          </div>
        )}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {!result.ok ? (
        <EngineMessage code={result.code} title={t('solvers.invalidInputTitle')} />
      ) : (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          {result.roots.length > 0 ? (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                {t('solvers.rootsFound', { count: result.roots.length, m: result.modulus })}
              </p>
              <ul className="flex flex-wrap gap-2 list-none">
                {result.roots.map((root) => (
                  <li
                    key={root.toString()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-mono font-bold"
                  >
                    <MathRender math={`x \\equiv ${root} \\pmod{${result.modulus}}`} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t('solvers.noRootsFound', { b: result.target, m: result.modulus })}
            </p>
          )}

          {result.truncated && (
            <p className="text-xs text-amber-400">
              {t('solvers.polynomialScanTruncated', { scanned: result.scanned })}
            </p>
          )}

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-400" aria-hidden="true" />
              {t('solvers.evaluationTable')}
            </h4>
            <ScrollableTable maxHeightClass="max-h-56 overflow-y-auto">
              <thead className="bg-slate-900 text-amber-400 sticky top-0">
                <tr>
                  <th scope="col" className="p-2">
                    x
                  </th>
                  <th scope="col" className="p-2">
                    f(x) mod {result.modulus.toString()}
                  </th>
                  <th scope="col" className="p-2">
                    {t('solvers.status')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visibleRows.map((evaluation) => (
                  <tr
                    key={evaluation.x.toString()}
                    className={evaluation.isRoot ? 'bg-emerald-500/15' : 'hover:bg-slate-800/40'}
                  >
                    <td className="p-2 text-slate-300">{evaluation.x.toString()}</td>
                    <td className="p-2 text-amber-300">{evaluation.val.toString()}</td>
                    <td className="p-2 font-sans font-semibold">
                      {evaluation.isRoot ? (
                        <span className="text-emerald-400">✓ {t('solvers.root')}</span>
                      ) : (
                        <span className="text-slate-500">≠ {result.target.toString()}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
          </div>
        </div>
      )}

      {result.ok && <PrimePowerMethod result={primePowers} scanTruncated={result.truncated} />}
    </div>
  );
}
