import React, { useMemo } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { findOrder, modularExponentiation, parseBigInt } from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  SaveToHistoryButton,
  SolverHeader,
} from '../ui/SolverPrimitives';

export default function ModularExponentiationSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('mod_exp', {
    base: '3',
    exp: '400',
    mod: '7',
  });
  const { base, exp, mod } = values;

  const power = useMemo(() => modularExponentiation(base, exp, mod), [base, exp, mod]);
  const order = useMemo(() => findOrder(base, mod), [base, mod]);

  const handleSave = () => {
    if (!power.ok) return;
    save(`${base}^{${exp}} \\equiv ${power.value} \\pmod{${mod}}`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.mod_exp.title" badge="aᵉ mod m · ordₘ(a)" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <IntegerField
            label={t('fields.baseA')}
            value={base}
            onChange={(next) => setValue('base', next)}
            invalid={parseBigInt(base) === null}
          />
          <IntegerField
            label={t('fields.exponentE')}
            value={exp}
            onChange={(next) => setValue('exp', next)}
            invalid={parseBigInt(exp) === null}
          />
          <IntegerField
            label={t('fields.modulusM')}
            value={mod}
            onChange={(next) => setValue('mod', next)}
            invalid={!power.ok}
          />
        </div>

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={handleSave} justSaved={justSaved} disabled={!power.ok} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4" aria-hidden="true" />
            {t('solvers.fastExponentiation')}
          </h4>
          {power.ok ? (
            <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <MathRender math={`${base}^{${exp}} \\equiv ${power.value} \\pmod{${mod}}`} block />
            </div>
          ) : (
            // A negative exponent used to silently return 0 here.
            <EngineMessage code={power.code} vars={power.vars} />
          )}
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
          <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            {t('solvers.multiplicativeOrder')}
          </h4>
          {order.exists ? (
            <div className="space-y-2">
              <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                <MathRender
                  math={`\\operatorname{ord}_{${mod}}(${base}) = ${order.order}`}
                  block
                />
              </div>
              <div className="text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-2 rounded-lg">
                <span>{t('solvers.primitiveRootStatus')}</span>
                {order.isPrimitiveRoot ? (
                  <span className="text-emerald-400 font-bold">
                    ✓ {t('solvers.isPrimitiveRoot', { m: mod })}
                  </span>
                ) : (
                  <span className="text-slate-400">
                    {t('solvers.isNotPrimitiveRoot', { m: mod, phi: order.phi })}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <EngineMessage code={order.code} vars={order.vars} />
          )}
        </div>
      </div>
    </div>
  );
}
