import React, { useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { parseBigInt, solveLinearCongruence } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  SolverHeader,
} from '../ui/SolverPrimitives';

export default function LinearCongruenceSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('linear_congruence', {
    a: '140',
    b: '133',
    m: '301',
  });
  const { a, b, m } = values;

  const parsed = useMemo(
    () => ({ a: parseBigInt(a), b: parseBigInt(b), m: parseBigInt(m) }),
    [a, b, m]
  );

  const result = useMemo(() => solveLinearCongruence(a, b, m), [a, b, m]);
  const inputsValid = parsed.a !== null && parsed.b !== null && parsed.m !== null;

  const handleSave = () => {
    const equation = `${a}x \\equiv ${b} \\pmod{${m}}`;
    if (!result.hasSolution) {
      save(`${equation} \\implies \\varnothing`);
      return;
    }

    const shown = result.incongruentSolutions.slice(0, 4).join(', ');
    const suffix = result.incongruentSolutions.length > 4 ? ', \\dots' : '';
    save(`${equation} \\implies x \\in \\{${shown}${suffix}\\}`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.linear_congruence.title" badge="ax ≡ b (mod m)" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <IntegerField
            label={t('fields.coefficientA')}
            value={a}
            onChange={(next) => setValue('a', next)}
            placeholder="140"
            invalid={parsed.a === null}
          />
          <IntegerField
            label={t('fields.constantB')}
            value={b}
            onChange={(next) => setValue('b', next)}
            placeholder="133"
            invalid={parsed.b === null}
          />
          <IntegerField
            label={t('fields.modulusM')}
            value={m}
            onChange={(next) => setValue('m', next)}
            placeholder="301"
            invalid={parsed.m === null || (parsed.m !== null && parsed.m <= 0n)}
          />
        </div>

        {inputsValid && (
          <div className="text-center p-3 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
            <MathRender math={`${a}x \\equiv ${b} \\pmod{${m}}`} block />
          </div>
        )}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={handleSave} justSaved={justSaved} disabled={!inputsValid} />
        </div>
      </div>

      {result.hasSolution ? (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <p className="flex items-start gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>
                {t('solvers.congruenceSolutionCount', {
                  count: result.numSolutions,
                  m: parsed.m,
                })}
              </span>
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 block">
                {t('solvers.incongruentSolutionsHeading', { m: parsed.m })}
              </span>
              <ul className="flex flex-wrap gap-2 list-none">
                {result.incongruentSolutions.map((solution) => (
                  <li
                    key={solution.toString()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-mono font-bold"
                  >
                    <MathRender math={`x \\equiv ${solution} \\pmod{${m}}`} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t('solvers.stepByStep')}
            </h4>
            <ol className="space-y-2 text-xs text-slate-300 list-none">
              {result.explanation.map((step, index) => (
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
