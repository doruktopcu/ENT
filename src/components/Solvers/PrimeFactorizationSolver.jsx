import React, { useMemo } from 'react';
import { Grid3x3, Hash, PieChart, ShieldCheck, Sigma } from 'lucide-react';
import { divisorsOf, primeFactorization } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  SolverHeader,
} from '../ui/SolverPrimitives';

const DIVISOR_DISPLAY_LIMIT = 200;

export default function PrimeFactorizationSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('prime_factor', { n: '24000' });
  const { n } = values;

  const result = useMemo(() => primeFactorization(n), [n]);
  const divisors = useMemo(
    () => (result.ok ? divisorsOf(n, DIVISOR_DISPLAY_LIMIT) : { ok: false }),
    [n, result.ok]
  );

  const handleSave = () => {
    if (!result.ok) return;
    save(
      `${result.n} = ${result.factorString}, \\quad \\tau = ${result.tau}, \\quad \\sigma = ${result.sigma}, \\quad \\mu = ${result.mobius}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.prime_factor.title" badge="τ(n) · σ(n) · μ(n)" />

        <IntegerField
          label={t('fields.integerN')}
          value={n}
          onChange={(next) => setValue('n', next)}
          placeholder="24000"
          invalid={!result.ok}
        />

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={handleSave} justSaved={justSaved} disabled={!result.ok} />
        </div>
      </div>

      {!result.ok ? (
        <EngineMessage
          code={result.code}
          vars={{ n: result.n }}
          title={t('solvers.invalidInputTitle')}
        />
      ) : (
        <>
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {t('solvers.canonicalDecomposition')}
              </span>
              {result.isUnit ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {t('solvers.unit')}
                </span>
              ) : result.isPrime ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  {t('solvers.prime')}
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {t('solvers.composite')}
                </span>
              )}
            </div>

            <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <MathRender math={`${result.n} = ${result.factorString}`} block />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Hash className="w-4 h-4" aria-hidden="true" />
                {t('solvers.numberOfDivisors')}
              </h4>
              <div className="text-3xl font-extrabold text-emerald-300 font-mono break-all">
                <MathRender math={`\\tau(${result.n}) = ${result.tau}`} />
              </div>
              <p className="text-xs text-slate-400">{t('solvers.tauFormulaNote')}</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-2">
              <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <PieChart className="w-4 h-4" aria-hidden="true" />
                {t('solvers.sumOfDivisors')}
              </h4>
              <div className="text-3xl font-extrabold text-indigo-300 font-mono break-all">
                <MathRender math={`\\sigma(${result.n}) = ${result.sigma}`} />
              </div>
              <p className="text-xs text-slate-400">{t('solvers.sigmaFormulaNote')}</p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sigma className="w-4 h-4" aria-hidden="true" />
              {t('solvers.mobiusValue')}
            </h4>
            <div className="text-2xl font-extrabold text-amber-300 font-mono">
              <MathRender math={`\\mu(${result.n}) = ${result.mobius}`} />
            </div>
            <p className="text-xs text-slate-400">
              {result.mobius === 0n
                ? t('solvers.mobiusNotSquarefree')
                : t('solvers.mobiusSquarefree', { value: result.mobius })}
            </p>
          </div>

          {divisors.ok && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                <Grid3x3 className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {t('solvers.divisorList')}
              </h4>
              <ul className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800 list-none">
                {divisors.divisors.map((divisor) => (
                  <li
                    key={divisor.toString()}
                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-xs font-mono"
                  >
                    {divisor.toString()}
                  </li>
                ))}
              </ul>
              {divisors.truncated && (
                <p className="text-[11px] text-amber-400">
                  {t('solvers.divisorListTruncated', {
                    shown: divisors.divisors.length,
                    total: divisors.total,
                  })}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
