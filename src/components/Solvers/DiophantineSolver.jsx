import React, { useMemo } from 'react';
import { CheckCircle, Table } from 'lucide-react';
import { parseBigInt, solveDiophantine } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import LatticePointsPanel from './panels/LatticePointsPanel';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  ScrollableTable,
  SolverHeader,
} from '../ui/SolverPrimitives';

/** Render "21x - 35y = 14" rather than "21x + -35y = 14". */
function equationLatex(a, b, c) {
  if (a === null || b === null || c === null) return '';
  const bTerm = b < 0n ? `- ${-b}y` : `+ ${b}y`;
  return `${a}x ${bTerm} = ${c}`;
}

export default function DiophantineSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('diophantine', {
    a: '21',
    b: '-35',
    c: '14',
  });
  const { a, b, c } = values;

  const parsed = useMemo(
    () => ({ a: parseBigInt(a), b: parseBigInt(b), c: parseBigInt(c) }),
    [a, b, c]
  );

  const result = useMemo(() => solveDiophantine(a, b, c), [a, b, c]);

  const inputsValid = parsed.a !== null && parsed.b !== null && parsed.c !== null;

  const summary = useMemo(() => {
    if (!inputsValid) return null;
    const equation = equationLatex(parsed.a, parsed.b, parsed.c);

    // The degenerate case (0x + 0y = 0) reports hasSolution without producing
    // x0/y0, which used to be interpolated straight into the summary as
    // "(undefined, undefined)".
    if (result.isDegenerate) return `${equation} \\implies (x, y) \\in \\mathbb{Z}^2`;
    if (result.hasSolution) {
      return `${equation} \\implies (x_0, y_0) = (${result.x0}, ${result.y0})`;
    }
    return `${equation} \\implies \\varnothing`;
  }, [inputsValid, parsed, result]);

  useAutoSaveHistory('diophantine', values, summary);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.diophantine.title" badge="ax + by = c" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <IntegerField
            label={t('fields.coefficientA')}
            value={a}
            onChange={(next) => setValue('a', next)}
            placeholder="21"
            invalid={parsed.a === null}
          />
          <IntegerField
            label={t('fields.coefficientB')}
            value={b}
            onChange={(next) => setValue('b', next)}
            placeholder="-35"
            invalid={parsed.b === null}
          />
          <IntegerField
            label={t('fields.constantC')}
            value={c}
            onChange={(next) => setValue('c', next)}
            placeholder="14"
            invalid={parsed.c === null}
          />
        </div>

        {inputsValid && (
          <div className="text-center p-3 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
            <MathRender math={equationLatex(parsed.a, parsed.b, parsed.c)} block />
          </div>
        )}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {result.hasSolution && !result.isDegenerate ? (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <p className="flex items-start gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>
                {t('solvers.diophantineSolvable', {
                  a: parsed.a,
                  b: parsed.b,
                  c: parsed.c,
                  d: result.gcd,
                })}
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                <span className="text-xs text-slate-400 block mb-1">
                  {t('solvers.particularSolution')}
                </span>
                <MathRender math={`x_0 = ${result.x0}, \\quad y_0 = ${result.y0}`} block />
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                <span className="text-xs text-slate-400 block mb-1">
                  {t('solvers.generalSolution')} (t ∈ ℤ)
                </span>
                <MathRender
                  math={`\\begin{cases} ${result.generalX} \\\\ ${result.generalY} \\end{cases}`}
                  block
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t('solvers.stepByStep')}
            </h4>
            <ol className="space-y-2 text-xs text-slate-300 list-none">
              {result.steps.map((step, index) => (
                <li
                  key={step.key}
                  className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5"
                >
                  <div className="flex gap-2">
                    <span className="text-amber-400 font-bold shrink-0">{index + 1}.</span>
                    <span>{t(`steps.${step.key}`, step.vars)}</span>
                  </div>
                  {step.latex && (
                    <div className="pl-5 overflow-x-auto">
                      <MathRender math={step.latex} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-400" aria-hidden="true" />
              {t('solvers.sampleSolutions')}
            </h4>
            <ScrollableTable>
              <thead className="bg-slate-900 text-amber-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="p-2.5">
                    {t('solvers.parameter')} t
                  </th>
                  <th scope="col" className="p-2.5">
                    x
                  </th>
                  <th scope="col" className="p-2.5">
                    y
                  </th>
                  <th scope="col" className="p-2.5">
                    {t('solvers.verification')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {result.sampleSolutions.map((solution) => (
                  <tr key={solution.t.toString()} className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-slate-400">{solution.t.toString()}</td>
                    <td className="p-2.5 text-amber-300">{solution.x.toString()}</td>
                    <td className="p-2.5 text-emerald-300">{solution.y.toString()}</td>
                    <td className="p-2.5 text-slate-300 font-sans">
                      <MathRender
                        math={`${parsed.a}(${solution.x}) ${parsed.b < 0n ? '-' : '+'} ${
                          parsed.b < 0n ? -parsed.b : parsed.b
                        }(${solution.y}) = ${parsed.c}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
          </div>
        </div>
      ) : (
        <EngineMessage
          code={result.code}
          vars={result.vars}
          latex={result.latex}
          tone={result.hasSolution ? 'info' : 'error'}
          title={result.hasSolution ? t('solvers.solutionExists') : t('solvers.noSolution')}
        />
      )}
      <LatticePointsPanel a={a} b={b} c={c} />
    </div>
  );
}
