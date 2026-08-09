import React, { useMemo } from 'react';
import { CheckCircle, MinusCircle, XCircle } from 'lucide-react';
import { jacobiSymbol, legendreSymbol, parseBigInt } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  SolverHeader,
} from '../ui/SolverPrimitives';

const STATUS_LABEL = {
  residue: 'solvers.quadraticResidue',
  nonResidue: 'solvers.quadraticNonResidue',
  divisible: 'solvers.divisibleByP',
};

export default function QuadraticResidueSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('quadratic_residue', {
    a: '10',
    p: '13',
  });
  const { a, p } = values;

  const legendre = useMemo(() => legendreSymbol(a, p), [a, p]);
  // Shown whenever the Legendre symbol is undefined but Jacobi still applies.
  const jacobi = useMemo(() => jacobiSymbol(a, p), [a, p]);

  const summary = legendre.ok
    ? legendre.symbol
    : jacobi.ok
      ? `\\left(\\frac{${a}}{${p}}\\right)_{\\text{Jacobi}} = ${jacobi.value}`
      : null;

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
        <SolverHeader titleKey="topics.quadratic_residue.title" badge="(a/p)" />

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

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {legendre.ok ? (
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
            {legendre.squareRoot !== null && legendre.squareRoot !== undefined && (
              <p className="text-emerald-300">
                {t('solvers.witnessRoot', {
                  x: legendre.squareRoot,
                  a: legendre.reducedA,
                  p,
                })}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <EngineMessage
            code={legendre.code}
            vars={legendre.vars}
            title={t('solvers.invalidInputTitle')}
          />

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
      )}
    </div>
  );
}
