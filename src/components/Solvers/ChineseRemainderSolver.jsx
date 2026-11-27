import React, { useMemo } from 'react';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { parseBigInt, solveCRT } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  SaveToHistoryButton,
  ScrollableTable,
  SolverHeader,
  StepList,
} from '../ui/SolverPrimitives';

const MAX_CONGRUENCES = 10;

export default function ChineseRemainderSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('crt', {
    congruences: [
      { c: '1', a: '2', m: '3' },
      { c: '1', a: '3', m: '5' },
      { c: '1', a: '2', m: '7' },
    ],
  });

  const congruences = values.congruences;

  const addCongruence = () => {
    if (congruences.length >= MAX_CONGRUENCES) return;
    setValue('congruences', [...congruences, { c: '1', a: '1', m: '4' }]);
  };

  const removeCongruence = (index) => {
    if (congruences.length <= 1) return;
    setValue(
      'congruences',
      congruences.filter((_, position) => position !== index)
    );
  };

  // The previous version did `next[index][field] = val` on a shallow copy,
  // mutating the row object in place — which also mutated the history entry
  // the row had been loaded from.
  const updateCongruence = (index, field, nextValue) => {
    setValue(
      'congruences',
      congruences.map((row, position) =>
        position === index ? { ...row, [field]: nextValue } : row
      )
    );
  };

  const result = useMemo(() => solveCRT(congruences), [congruences]);

  const summary = result.hasSolution ? result.solutionString : 'x \\in \\varnothing';
  useAutoSaveHistory('crt', values, summary);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.crt.title" badge="cᵢx ≡ aᵢ (mod mᵢ)" />

        <ul className="space-y-2 list-none">
          {congruences.map((congruence, index) => (
            // Index keys are correct here: rows have no identity of their own
            // and reordering is not possible in this UI.
            <li
              key={index}
              className="flex flex-wrap items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800"
            >
              <span className="text-xs text-amber-400 font-mono font-bold w-6 shrink-0">
                #{index + 1}
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Rows saved before coefficients existed have no `c`. */}
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={congruence.c ?? '1'}
                  aria-label={`${t('fields.coefficientC')} #${index + 1}`}
                  aria-invalid={parseBigInt(congruence.c ?? '1') === null}
                  onChange={(event) => updateCongruence(index, 'c', event.target.value)}
                  className="math-input w-14 text-center"
                />
                <span className="text-xs text-slate-400 font-mono shrink-0">x ≡</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={congruence.a}
                  aria-label={`${t('fields.remainderA')} #${index + 1}`}
                  aria-invalid={parseBigInt(congruence.a) === null}
                  onChange={(event) => updateCongruence(index, 'a', event.target.value)}
                  className="math-input w-20 text-center"
                />
                <span className="text-xs text-slate-400 font-mono shrink-0">(mod</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={congruence.m}
                  aria-label={`${t('fields.modulusM')} #${index + 1}`}
                  aria-invalid={
                    parseBigInt(congruence.m) === null || parseBigInt(congruence.m) <= 0n
                  }
                  onChange={(event) => updateCongruence(index, 'm', event.target.value)}
                  className="math-input w-24 text-center"
                />
                <span className="text-xs text-slate-400 font-mono shrink-0">)</span>
              </div>
              {congruences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCongruence(index)}
                  aria-label={t('solvers.removeCongruence')}
                  title={t('solvers.removeCongruence')}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={addCongruence}
            disabled={congruences.length >= MAX_CONGRUENCES}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            {t('solvers.addCongruence')}
          </button>

          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} />
        </div>
      </div>

      {result.hasSolution ? (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <p className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t('solvers.uniqueSolutionModulo', { m: result.M })}
            </p>
            <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <MathRender math={result.solutionString} block />
            </div>
          </div>

          {result.reductions.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <StepList
                titleKey="solvers.crt.reductionsHeading"
                steps={result.reductions.map((row) => ({
                  key: 'crt.reduceRow',
                  vars: { row: row.row },
                  latex: row.latex,
                }))}
              />
            </div>
          )}

          {result.method === 'merged' && (
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
              <p className="text-xs text-indigo-300 leading-relaxed">{t('solvers.crt.mergedNote')}</p>
              <StepList
                titleKey="solvers.crt.mergeHeading"
                steps={result.mergeSteps.map((step) => ({
                  key: 'crt.mergeStep',
                  vars: { m1: step.M, m2: step.m, gcd: step.gcd },
                  latex: step.latex,
                }))}
              />
            </div>
          )}

          {result.method === 'classical' && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t('solvers.crtBreakdown')}
            </h4>
            <ScrollableTable>
              <thead className="bg-slate-900 text-amber-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="p-2.5">
                    i
                  </th>
                  <th scope="col" className="p-2.5">
                    aᵢ
                  </th>
                  <th scope="col" className="p-2.5">
                    mᵢ
                  </th>
                  <th scope="col" className="p-2.5">
                    Mᵢ = M/mᵢ
                  </th>
                  <th scope="col" className="p-2.5">
                    yᵢ ≡ Mᵢ⁻¹ (mod mᵢ)
                  </th>
                  <th scope="col" className="p-2.5">
                    aᵢMᵢyᵢ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Named `row`, not `t` — the old code shadowed the translator. */}
                {result.terms.map((row, index) => (
                  <tr key={row.mi.toString()} className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-slate-400">{index + 1}</td>
                    <td className="p-2.5 text-amber-300">{row.ai.toString()}</td>
                    <td className="p-2.5 text-slate-300">{row.mi.toString()}</td>
                    <td className="p-2.5 text-indigo-300">{row.Mi.toString()}</td>
                    <td className="p-2.5 text-emerald-300">{row.yi.toString()}</td>
                    <td className="p-2.5 text-slate-200 font-sans">
                      <MathRender math={row.term} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
          </div>
          )}
        </div>
      ) : (
        <EngineMessage
          code={result.code}
          vars={result.vars}
          latex={result.latex}
          title={t('solvers.noSolution')}
        />
      )}
    </div>
  );
}
