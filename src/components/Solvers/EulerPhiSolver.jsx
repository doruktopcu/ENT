import React, { useMemo } from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { computeEulerPhi } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  SolverHeader,
} from '../ui/SolverPrimitives';

export default function EulerPhiSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('euler_phi', { n: '50' });
  const { n } = values;

  const result = useMemo(() => computeEulerPhi(n), [n]);

  const handleSave = () => {
    if (!result.ok) return;
    save(`\\varphi(${result.n}) = ${result.phi}`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.euler_phi.title" badge="φ(n)" />

        <IntegerField
          label={t('fields.positiveIntegerN')}
          value={n}
          onChange={(next) => setValue('n', next)}
          placeholder="50"
          invalid={!result.ok}
        />

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={handleSave} justSaved={justSaved} disabled={!result.ok} />
        </div>
      </div>

      {!result.ok ? (
        <EngineMessage code={result.code} title={t('solvers.invalidInputTitle')} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {t('topics.euler_phi.title')}
                </span>
                <div className="mt-2 text-3xl font-extrabold text-amber-300 font-mono break-all">
                  <MathRender math={`\\varphi(${result.n}) = ${result.phi}`} />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('solvers.totientMeaning', { n: result.n, phi: result.phi })}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs overflow-x-auto">
                <MathRender math={result.formula} block />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                {t('solvers.primeFactorBreakdown')}
              </span>
              <ul className="mt-3 space-y-2 list-none">
                {result.factors.map((factor) => (
                  <li
                    key={factor.prime.toString()}
                    className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800"
                  >
                    <span>
                      {t('solvers.primeFactorRow', { p: factor.prime, k: factor.power })}
                    </span>
                    <span className="text-indigo-300">
                      <MathRender
                        math={`1 - \\frac{1}{${factor.prime}} = \\frac{${factor.prime - 1n}}{${factor.prime}}`}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {t('solvers.crsHeading')}
              </h4>
              <ul className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800 list-none">
                {result.crs.map((value) => (
                  <li
                    key={value.toString()}
                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-xs font-mono"
                  >
                    {value.toString()}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-400">
                {t('solvers.crsCount', { n: result.n })}
              </p>
              {/* The old build claimed "Total elements = n" while silently
                  rendering only the first 100 residues. */}
              {result.truncated && (
                <p className="text-[11px] text-amber-400">
                  {t('solvers.residuePreviewTruncated', {
                    shown: result.previewLimit,
                    total: result.n,
                  })}
                </p>
              )}
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {t('solvers.rrsHeading')}
              </h4>
              <ul className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800 list-none">
                {result.rrs.map((value) => (
                  <li
                    key={value.toString()}
                    className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold"
                  >
                    {value.toString()}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-400 font-medium">
                {t('solvers.rrsCount', { n: result.n, phi: result.phi })}
              </p>
              {result.truncated && (
                <p className="text-[11px] text-amber-400">
                  {t('solvers.residuePreviewTruncated', {
                    shown: result.previewLimit,
                    total: result.n,
                  })}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
