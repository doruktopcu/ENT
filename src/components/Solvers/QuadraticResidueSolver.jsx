import React, { useMemo } from 'react';
import { CheckCircle, Grid3x3, MinusCircle, Radical, XCircle } from 'lucide-react';
import {
  jacobiSymbol,
  legendreSymbol,
  parseBigInt,
  quadraticResidueList,
  solveQuadraticCongruence,
  squareRootsMod,
} from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  MathBox,
  ModeTabs,
  Panel,
  PanelHeading,
  ResidueChips,
  SaveToHistoryButton,
  SolverHeader,
  StepList,
} from '../ui/SolverPrimitives';

const STATUS_LABEL = {
  residue: 'solvers.quadraticResidue',
  nonResidue: 'solvers.quadraticNonResidue',
  divisible: 'solvers.divisibleByP',
};

const MODES = [
  { id: 'legendre', labelKey: 'solvers.quadratic.modeLegendre' },
  { id: 'sqrt', labelKey: 'solvers.quadratic.modeSqrt' },
  { id: 'quadratic', labelKey: 'solvers.quadratic.modeQuadratic' },
];

/** Quadratic residues are listed only for primes this small. */
const RESIDUE_LIST_LIMIT = 400n;

/** x² ≡ a (mod n) broken into prime powers, then recombined (NTIC §16.1). */
function SquareRootPanel({ result, a }) {
  const { t } = useApp();
  if (!result.ok) return <EngineMessage code={result.code} vars={result.vars} title={t('solvers.invalidInputTitle')} />;

  const found = result.count > 0n;

  return (
    <Panel tone={found ? 'emerald' : 'rose'}>
      <PanelHeading Icon={Radical} tone={found ? 'emerald' : 'rose'}>
        {found
          ? t('solvers.quadratic.sqrtCount', { count: result.count, a: result.a, n: result.n })
          : t('solvers.quadratic.sqrtNone', { a: result.a, n: result.n })}
      </PanelHeading>
      {result.roots && result.roots.length > 0 && <ResidueChips values={result.roots} />}
      {result.truncated && found && <p className="text-xs text-amber-400">{t('solvers.quadratic.tooManyRoots')}</p>}

      {result.components.length > 1 || result.components.some((c) => c.power > 1n) ? (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.quadratic.sqrtExplain')}</p>
          <ul className="space-y-1.5 list-none">
            {result.components.map((component) => (
              <li
                key={component.modulus.toString()}
                className="text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto"
              >
                <MathRender
                  math={`x^2 \\equiv ${a} \\pmod{${component.modulus}}: \\; ${
                    component.count === 0n
                      ? '\\varnothing'
                      : `\\{${component.roots.join(', ')}${component.complete ? '' : ', \\dots'}\\}`
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Panel>
  );
}

export default function QuadraticResidueSolver() {
  const { engine, t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('quadratic_residue', {
    mode: 'legendre',
    a: '10',
    p: '13',
    sqrtN: '125',
    sqrtA: '-1',
    qa: '1',
    qb: '-2',
    qc: '3',
    qn: '9',
  });
  const { mode, a, p } = values;
  const budget = engine.factorisation.budget;

  const legendre = useMemo(() => legendreSymbol(a, p), [a, p]);
  // Shown whenever the Legendre symbol is undefined but Jacobi still applies.
  const jacobi = useMemo(() => jacobiSymbol(a, p), [a, p]);
  const residueList = useMemo(() => {
    const prime = parseBigInt(p);
    return mode === 'legendre' && legendre.ok && prime !== null && prime <= RESIDUE_LIST_LIMIT
      ? quadraticResidueList(prime, { limit: RESIDUE_LIST_LIMIT })
      : null;
  }, [mode, legendre.ok, p]);
  const legendreRoots = useMemo(
    () => (mode === 'legendre' && legendre.ok && legendre.value === 1 ? squareRootsMod(a, p, { budget }) : null),
    [mode, legendre, a, p, budget]
  );

  const sqrt = useMemo(
    () => (mode === 'sqrt' ? squareRootsMod(values.sqrtA, values.sqrtN, { budget }) : null),
    [mode, values.sqrtA, values.sqrtN, budget]
  );
  const quadratic = useMemo(
    () =>
      mode === 'quadratic'
        ? solveQuadraticCongruence(values.qa, values.qb, values.qc, values.qn, {
            budget,
            scanLimit: engine.polynomial.scanLimit,
          })
        : null,
    [mode, values.qa, values.qb, values.qc, values.qn, budget, engine.polynomial.scanLimit]
  );

  const quadraticLatex = `${values.qa}x^2 + (${values.qb})x + (${values.qc}) \\equiv 0 \\pmod{${values.qn}}`;

  let summary = null;
  if (mode === 'legendre') {
    summary = legendre.ok
      ? legendre.symbol
      : jacobi.ok
        ? `\\left(\\frac{${a}}{${p}}\\right)_{\\text{Jacobi}} = ${jacobi.value}`
        : null;
  } else if (mode === 'sqrt' && sqrt?.ok) {
    summary = `x^2 \\equiv ${values.sqrtA} \\pmod{${values.sqrtN}}: \\; ${sqrt.count} \\text{ roots}`;
  } else if (mode === 'quadratic' && quadratic?.ok) {
    summary = `${quadraticLatex} \\implies x \\in \\{${quadratic.roots ? quadratic.roots.join(', ') : '\\dots'}\\}`;
  }
  useAutoSaveHistory('quadratic_residue', values, summary);

  const statusStyles =
    legendre.value === 1
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : legendre.value === -1
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        : 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.quadratic_residue.title" badge="(a/p) · √a mod n · ax²+bx+c" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />

        {mode === 'legendre' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IntegerField
              label={t('fields.integerA')}
              value={a}
              onChange={(next) => setValue('a', next)}
              invalid={parseBigInt(a) === null}
            />
            <IntegerField
              label={t('fields.oddPrimeP')}
              value={p}
              onChange={(next) => setValue('p', next)}
              invalid={!legendre.ok}
            />
          </div>
        )}

        {mode === 'sqrt' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IntegerField
              label={t('fields.integerA')}
              value={values.sqrtA}
              onChange={(next) => setValue('sqrtA', next)}
              invalid={parseBigInt(values.sqrtA) === null}
            />
            <IntegerField
              label={t('fields.modulusN')}
              value={values.sqrtN}
              onChange={(next) => setValue('sqrtN', next)}
              invalid={!sqrt?.ok}
            />
          </div>
        )}

        {mode === 'quadratic' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <IntegerField
                label={t('fields.coefficientA')}
                value={values.qa}
                onChange={(next) => setValue('qa', next)}
                invalid={parseBigInt(values.qa) === null}
              />
              <IntegerField
                label={t('fields.coefficientB')}
                value={values.qb}
                onChange={(next) => setValue('qb', next)}
                invalid={parseBigInt(values.qb) === null}
              />
              <IntegerField
                label={t('fields.constantC')}
                value={values.qc}
                onChange={(next) => setValue('qc', next)}
                invalid={parseBigInt(values.qc) === null}
              />
              <IntegerField
                label={t('fields.modulusN')}
                value={values.qn}
                onChange={(next) => setValue('qn', next)}
                invalid={!quadratic?.ok}
              />
            </div>
            <MathBox math={quadraticLatex} />
          </>
        )}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {mode === 'legendre' &&
        (legendre.ok ? (
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {t('solvers.legendreResult')}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-bold flex items-center gap-1 ${statusStyles}`}
              >
                {legendre.value === 1 ? (
                  <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                ) : legendre.value === -1 ? (
                  <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <MinusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {t(STATUS_LABEL[legendre.status])}
              </span>
            </div>

            <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <MathRender math={legendre.symbol} block />
            </div>

            <div className="text-xs text-slate-300 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="font-semibold text-slate-200">{t('solvers.eulerCriterion')}</div>
              <div className="overflow-x-auto">
                <MathRender math={legendre.criterion} />
              </div>
              {legendreRoots?.ok && legendreRoots.roots && (
                <p className="text-emerald-300">
                  {t('solvers.quadratic.bothRoots', {
                    roots: legendreRoots.roots.join(', '),
                    a: legendre.reducedA,
                    p,
                  })}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <EngineMessage code={legendre.code} vars={legendre.vars} title={t('solvers.invalidInputTitle')} />

            {/* The Legendre symbol is undefined for composite moduli, but the
                Jacobi symbol still is — so offer the correct tool instead of a
                confidently wrong ±1 like the previous implementation did. */}
            {jacobi.ok && (
              <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {t('solvers.jacobiSymbol')}
                </span>
                <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                  <MathRender
                    math={`\\left(\\frac{${a}}{${p}}\\right) = ${jacobi.value > 0 ? '+1' : jacobi.value}`}
                    block
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.jacobiNote')}</p>
              </div>
            )}
          </div>
        ))}

      {mode === 'legendre' && residueList?.ok && (
        <Panel>
          <PanelHeading Icon={Grid3x3}>{t('solvers.quadratic.residueListHeading', { p })}</PanelHeading>
          <div className="space-y-2">
            <div className="text-xs text-emerald-300 font-semibold">
              {t('solvers.quadratic.residuesLabel', { count: residueList.residues.length })}
            </div>
            <ResidueChips values={residueList.residues} />
            <div className="text-xs text-rose-300 font-semibold pt-1">
              {t('solvers.quadratic.nonResiduesLabel', { count: residueList.nonResidues.length })}
            </div>
            <ResidueChips values={residueList.nonResidues} tone="rose" />
          </div>
        </Panel>
      )}

      {mode === 'sqrt' && sqrt && <SquareRootPanel result={sqrt} a={values.sqrtA} />}

      {mode === 'quadratic' && quadratic && (
        <>
          {!quadratic.ok ? (
            <EngineMessage code={quadratic.code} vars={quadratic.vars} title={t('solvers.invalidInputTitle')} />
          ) : (
            <Panel tone={quadratic.count > 0n ? 'emerald' : 'rose'}>
              {quadratic.method === 'completeSquare' ? (
                <StepList steps={quadratic.steps} />
              ) : (
                <p className="text-xs text-amber-300 leading-relaxed">
                  {t('solvers.quadratic.scanFallback', { n: quadratic.n })}
                </p>
              )}
              <p className={`text-sm font-bold ${quadratic.count > 0n ? 'text-emerald-400' : 'text-rose-300'}`}>
                {t('solvers.rootsFound', { count: quadratic.count, m: quadratic.n })}
              </p>
              {quadratic.roots && quadratic.roots.length > 0 && <ResidueChips values={quadratic.roots} />}
              {quadratic.truncated && <p className="text-xs text-amber-400">{t('solvers.quadratic.tooManyRoots')}</p>}
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
