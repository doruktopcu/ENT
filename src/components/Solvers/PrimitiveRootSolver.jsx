import React, { useMemo } from 'react';
import { CheckCircle, KeyRound, ListOrdered, XCircle } from 'lucide-react';
import {
  indexTable,
  parseBigInt,
  primitiveRoots,
  primitiveRootTest,
  solveExponentialCongruence,
  solvePowerCongruence,
} from '../../utils/numberTheoryEngine';
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
  ScrollableTable,
  SolverHeader,
  StepList,
} from '../ui/SolverPrimitives';

/** Index tables are only drawn while they still fit on screen. */
const INDEX_TABLE_LIMIT = 120n;

const MODES = [
  { id: 'roots', labelKey: 'solvers.primitive.modeRoots' },
  { id: 'power', labelKey: 'solvers.primitive.modePower' },
  { id: 'exponential', labelKey: 'solvers.primitive.modeLog' },
];

/** NTIC chapter 10: primitive roots, indices and discrete logarithms. */
export default function PrimitiveRootSolver() {
  const { engine, t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('primitive_roots', {
    mode: 'roots',
    n: '17',
    a: '3',
    k: '3',
    target: '5',
    base: '5',
  });
  const { mode, n, a, k, target, base } = values;
  const options = engine.factorisation;

  const roots = useMemo(() => primitiveRoots(n, options), [n, options]);
  const candidate = useMemo(
    () => (mode === 'roots' ? primitiveRootTest(a, n, options) : null),
    [mode, a, n, options]
  );
  const power = useMemo(
    () => (mode === 'power' ? solvePowerCongruence(k, target, n, options) : null),
    [mode, k, target, n, options]
  );
  const logarithm = useMemo(
    () => (mode === 'exponential' ? solveExponentialCongruence(base, target, n, options) : null),
    [mode, base, target, n, options]
  );
  const table = useMemo(
    () =>
      mode === 'roots' && roots.ok && roots.exists && roots.phi <= INDEX_TABLE_LIMIT
        ? indexTable(roots.smallest, roots.n, roots.phi, INDEX_TABLE_LIMIT)
        : null,
    [mode, roots]
  );

  const solved = mode === 'power' ? power : logarithm;
  const equationLatex =
    mode === 'power'
      ? `x^{${k}} \\equiv ${target} \\pmod{${n}}`
      : `${base}^{x} \\equiv ${target} \\pmod{${n}}`;

  let summary = null;
  if (mode === 'roots' && roots.ok) {
    summary = roots.exists
      ? `g_{\\min}(${n}) = ${roots.smallest}, \\quad \\#\\{g\\} = \\varphi(\\varphi(${n})) = ${roots.count}`
      : `${n}: \\; U_{${n}} \\text{ not cyclic}`;
  } else if (mode !== 'roots' && solved?.ok) {
    summary = `${equationLatex} \\implies ${solved.hasSolution ? solved.solutionString : 'x \\in \\varnothing'}`;
  }
  useAutoSaveHistory('primitive_roots', values, summary);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.primitive_roots.title" badge="gᵏ · ind_g · xᵏ ≡ a" />
        <ModeTabs
          modes={MODES}
          value={mode}
          onChange={(next) => setValue('mode', next)}
          label={t('solvers.modeLabel')}
        />

        {mode === 'roots' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IntegerField
              label={t('fields.modulusN')}
              value={n}
              onChange={(next) => setValue('n', next)}
              invalid={!roots.ok}
            />
            <IntegerField
              label={t('fields.candidateA')}
              value={a}
              onChange={(next) => setValue('a', next)}
              invalid={parseBigInt(a) === null}
            />
          </div>
        )}

        {mode === 'power' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <IntegerField
              label={t('fields.exponentK')}
              value={k}
              onChange={(next) => setValue('k', next)}
              invalid={parseBigInt(k) === null}
            />
            <IntegerField
              label={t('fields.targetValueA')}
              value={target}
              onChange={(next) => setValue('target', next)}
              invalid={parseBigInt(target) === null}
            />
            <IntegerField
              label={t('fields.modulusN')}
              value={n}
              onChange={(next) => setValue('n', next)}
              invalid={!roots.ok}
            />
          </div>
        )}

        {mode === 'exponential' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <IntegerField
              label={t('fields.baseB')}
              value={base}
              onChange={(next) => setValue('base', next)}
              invalid={parseBigInt(base) === null}
            />
            <IntegerField
              label={t('fields.targetValueA')}
              value={target}
              onChange={(next) => setValue('target', next)}
              invalid={parseBigInt(target) === null}
            />
            <IntegerField
              label={t('fields.modulusN')}
              value={n}
              onChange={(next) => setValue('n', next)}
              invalid={!roots.ok}
            />
          </div>
        )}

        {mode !== 'roots' && <MathBox math={equationLatex} />}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {!roots.ok ? (
        <EngineMessage code={roots.code} vars={roots.vars} title={t('solvers.invalidInputTitle')} />
      ) : (
        <Panel tone={roots.exists ? 'emerald' : 'rose'}>
          <PanelHeading Icon={roots.exists ? CheckCircle : XCircle} tone={roots.exists ? 'emerald' : 'rose'}>
            {roots.exists
              ? t('solvers.primitive.exists', { n })
              : t('solvers.primitive.doesNotExist', { n })}
          </PanelHeading>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(`solvers.primitive.form.${roots.form}`)}
          </p>
          {roots.exists && (
            <>
              <MathBox
                math={`g = ${roots.smallest}, \\quad \\varphi(${roots.n}) = ${roots.phi}, \\quad \\varphi(\\varphi(${roots.n})) = ${roots.count}`}
              />
              {mode === 'roots' && roots.roots && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    {t('solvers.primitive.allRoots', { count: roots.count })}
                  </div>
                  <ResidueChips values={roots.roots} />
                  {roots.rootsTruncated && (
                    <p className="text-xs text-amber-400">
                      {t('solvers.listTruncated', { shown: roots.roots.length, total: roots.count })}
                    </p>
                  )}
                </div>
              )}
              {mode === 'roots' && !roots.rootsComplete && (
                <p className="text-xs text-slate-400">{t('solvers.primitive.tooManyToList')}</p>
              )}
            </>
          )}
        </Panel>
      )}

      {mode === 'roots' && candidate && (
        <Panel tone="indigo">
          <PanelHeading Icon={KeyRound} tone="indigo">
            {t('solvers.primitive.testHeading', { a, n })}
          </PanelHeading>
          {candidate.ok ? (
            <>
              <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.primitive.testExplain')}</p>
              {candidate.rows.length > 0 && (
                <ScrollableTable>
                  <thead className="bg-slate-900 text-indigo-300 border-b border-slate-800">
                    <tr>
                      <th scope="col" className="p-2">
                        q | φ(n)
                      </th>
                      <th scope="col" className="p-2">
                        a^(φ(n)/q) mod n
                      </th>
                      <th scope="col" className="p-2">
                        {t('solvers.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {candidate.rows.map((row) => (
                      <tr key={row.q.toString()}>
                        <td className="p-2 text-slate-300">{row.q.toString()}</td>
                        <td className="p-2 text-amber-300">
                          {`${candidate.a}^${row.exponent} ≡ ${row.residue}`}
                        </td>
                        <td className="p-2 font-sans font-semibold">
                          {row.isOne ? (
                            <span className="text-rose-400">= 1 ✗</span>
                          ) : (
                            <span className="text-emerald-400">≠ 1 ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollableTable>
              )}
              <p
                className={`text-sm font-bold ${candidate.isPrimitiveRoot ? 'text-emerald-400' : 'text-slate-300'}`}
              >
                {candidate.isPrimitiveRoot
                  ? t('solvers.isPrimitiveRoot', { m: n })
                  : t('solvers.primitive.notRoot', { a: candidate.a, n })}
              </p>
            </>
          ) : (
            <EngineMessage code={candidate.code} vars={candidate.vars} />
          )}
        </Panel>
      )}

      {mode === 'roots' && table && (
        <Panel>
          <PanelHeading Icon={ListOrdered}>
            {t('solvers.primitive.indexTable', { g: roots.smallest, n })}
          </PanelHeading>
          <ScrollableTable maxHeightClass="max-h-56 overflow-y-auto">
            <thead className="bg-slate-900 text-amber-400 sticky top-0">
              <tr>
                <th scope="col" className="p-2">
                  i = ind(a)
                </th>
                <th scope="col" className="p-2">
                  a ≡ {roots.smallest.toString()}^i
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {table.rows.map((row) => (
                <tr key={row.exponent.toString()}>
                  <td className="p-2 text-slate-300">{row.exponent.toString()}</td>
                  <td className="p-2 text-amber-300">{row.residue.toString()}</td>
                </tr>
              ))}
            </tbody>
          </ScrollableTable>
        </Panel>
      )}

      {mode !== 'roots' && solved && (
        <>
          {!solved.ok ? (
            <EngineMessage code={solved.code} vars={solved.vars} title={t('solvers.invalidInputTitle')} />
          ) : (
            <Panel tone={solved.hasSolution ? 'emerald' : 'rose'}>
              <StepList steps={solved.steps} />
              {solved.hasSolution ? (
                <div className="space-y-2">
                  <p className="text-emerald-400 font-bold text-sm">
                    {t('solvers.primitive.solutionCount', {
                      count: solved.solutions.length,
                      m: mode === 'power' ? solved.n : solved.phi,
                    })}
                  </p>
                  <MathBox math={solved.solutionString} />
                </div>
              ) : (
                <EngineMessage code="indexNoSolution" latex={solved.latex} title={t('solvers.noSolution')} />
              )}
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
