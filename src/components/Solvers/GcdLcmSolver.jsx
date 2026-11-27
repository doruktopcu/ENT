import React, { useMemo } from 'react';
import { FileText } from 'lucide-react';
import { extGCD, lcm, parseBigInt } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  ScrollableTable,
  SolverHeader,
} from '../ui/SolverPrimitives';

export default function GcdLcmSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('gcd_lcm', { a: '140', b: '301' });
  const { a, b } = values;

  const result = useMemo(() => {
    const parsedA = parseBigInt(a);
    const parsedB = parseBigInt(b);
    if (parsedA === null || parsedB === null) return { ok: false };

    return { ok: true, ext: extGCD(parsedA, parsedB), lcmResult: lcm(parsedA, parsedB) };
  }, [a, b]);

  const summary = result.ok
    ? `\\gcd(${a}, ${b}) = ${result.ext.gcd}, \\quad \\operatorname{lcm}(${a}, ${b}) = ${result.lcmResult.lcm}`
    : null;
  useAutoSaveHistory('gcd_lcm', values, summary);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.gcd_lcm.title" badge={t('solvers.euclideanBadge')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegerField
            label={t('fields.integerA')}
            value={a}
            onChange={(next) => setValue('a', next)}
            placeholder="140"
            invalid={parseBigInt(a) === null}
          />
          <IntegerField
            label={t('fields.integerB')}
            value={b}
            onChange={(next) => setValue('b', next)}
            placeholder="301"
            invalid={parseBigInt(b) === null}
          />
        </div>

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {!result.ok ? (
        <EngineMessage code="invalidInput" title={t('solvers.invalidInputTitle')} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {t('solvers.gcdLabel')}
                </span>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-amber-300 font-mono break-all">
                    {result.ext.gcd.toString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    gcd({a}, {b})
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs text-slate-300">
                <div className="font-semibold text-amber-200 mb-1">{t('solvers.bezoutIdentity')}</div>
                <MathRender math={result.ext.verification} block />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {t('solvers.lcmLabel')}
                </span>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-emerald-300 font-mono break-all">
                    {result.lcmResult.lcm.toString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    lcm({a}, {b})
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs text-slate-300">
                <div className="font-semibold text-emerald-200 mb-1">{t('solvers.formula')}</div>
                <MathRender math={result.lcmResult.formula} block />
              </div>
            </div>
          </div>

          {result.ext.steps.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {t('solvers.stepByStep')}
              </h4>

              <ScrollableTable>
                <thead className="bg-slate-900 text-amber-400 border-b border-slate-800">
                  <tr>
                    <th scope="col" className="p-2.5">
                      {t('solvers.step')}
                    </th>
                    <th scope="col" className="p-2.5">
                      {t('solvers.divisionEquation')}
                    </th>
                    <th scope="col" className="p-2.5">
                      {t('solvers.quotient')}
                    </th>
                    <th scope="col" className="p-2.5">
                      {t('solvers.remainder')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.ext.steps.map((step, index) => (
                    <tr key={`${step.r_prev}-${step.r_curr}`} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-slate-400">{index + 1}</td>
                      <td className="p-2.5 font-sans">
                        <MathRender
                          math={`${step.r_prev} = ${step.q} \\cdot ${step.r_curr} + ${step.r_next}`}
                        />
                      </td>
                      <td className="p-2.5 text-amber-300">{step.q.toString()}</td>
                      <td className="p-2.5 text-emerald-400">{step.r_next.toString()}</td>
                    </tr>
                  ))}
                </tbody>
              </ScrollableTable>
            </div>
          )}
        </>
      )}
    </div>
  );
}
