import React, { useMemo } from 'react';
import { Infinity as InfinityIcon, Spline } from 'lucide-react';
import { parseBigInt } from '../../utils/numberTheoryEngine';
import { mordellPoints, pellEquation } from '../../utils/bookEngineTier2';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  MathBox,
  ModeTabs,
  Panel,
  PanelHeading,
  SaveToHistoryButton,
  ScrollableTable,
  SolverHeader,
} from '../ui/SolverPrimitives';

const MODES = [
  { id: 'pell', labelKey: 'solvers.curves.modePell' },
  { id: 'mordell', labelKey: 'solvers.curves.modeMordell' },
];

/** NTIC chapter 15: Pell's equation (§15.4–15.6) and Mordell curves (§15.3). */
export default function PellCurvesSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('pell_curves', {
    mode: 'pell',
    d: '2',
    k: '-2',
    bound: '10000',
  });
  const { mode } = values;

  const pell = useMemo(() => (mode === 'pell' ? pellEquation(values.d) : null), [mode, values.d]);
  const mordell = useMemo(
    () => (mode === 'mordell' ? mordellPoints(values.k, values.bound) : null),
    [mode, values.k, values.bound]
  );

  let summary = null;
  if (pell?.ok) summary = `x^2 - ${pell.d}y^2 = 1: \\; (${pell.fundamental.x}, ${pell.fundamental.y})`;
  if (mordell?.ok) summary = `y^2 = x^3 + (${mordell.k}): \\; ${mordell.points.length} \\text{ pts}, |x| \\le ${mordell.bound}`;
  useAutoSaveHistory('pell_curves', values, summary);

  const field = (key, labelKey, invalid) => (
    <IntegerField
      label={t(labelKey)}
      value={values[key]}
      onChange={(next) => setValue(key, next)}
      invalid={invalid ?? parseBigInt(values[key]) === null}
    />
  );

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.pell_curves.title" badge="x² − dy² = 1 · y² = x³ + k" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />
        {mode === 'pell' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field('d', 'fields.nonSquareD', pell && !pell.ok)}</div>
        )}
        {mode === 'mordell' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field('k', 'fields.constantK', mordell && !mordell.ok)}
            {field('bound', 'fields.searchBound', mordell && !mordell.ok)}
          </div>
        )}
        <MathBox math={mode === 'pell' ? `x^2 - ${values.d}\\,y^2 = 1` : `y^2 = x^3 + (${values.k})`} />
        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {pell &&
        (!pell.ok ? (
          <EngineMessage code={pell.code} vars={pell.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone="emerald">
            <PanelHeading Icon={InfinityIcon} tone="emerald">
              {t('solvers.curves.pellHeading')}
            </PanelHeading>
            <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.curves.cfExplain', { length: pell.periodLength })}</p>
            <MathBox math={pell.cfLatex} />
            <MathBox math={`(x_1, y_1) = (${pell.fundamental.x}, ${pell.fundamental.y})`} />
            <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.curves.compositionExplain')}</p>
            <MathBox math={pell.compositionLatex} />
            <ScrollableTable maxHeightClass="max-h-64 overflow-y-auto">
              <thead className="bg-slate-900 text-amber-400 sticky top-0">
                <tr>
                  <th scope="col" className="p-2">k</th>
                  <th scope="col" className="p-2">xₖ</th>
                  <th scope="col" className="p-2">yₖ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pell.solutions.map((s, index) => (
                  <tr key={s.x.toString()}>
                    <td className="p-2 text-slate-400">{index + 1}</td>
                    <td className="p-2 text-emerald-300 break-all">{s.x.toString()}</td>
                    <td className="p-2 text-emerald-300 break-all">{s.y.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
            <p className="text-xs text-slate-300">
              {pell.negative
                ? t('solvers.curves.negativeYes', { d: pell.d, x: pell.negative.x, y: pell.negative.y })
                : t('solvers.curves.negativeNo', { d: pell.d })}
            </p>
          </Panel>
        ))}

      {mordell &&
        (!mordell.ok ? (
          <EngineMessage code={mordell.code} vars={mordell.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={mordell.points.length > 0 ? 'emerald' : 'rose'}>
            <PanelHeading Icon={Spline} tone={mordell.points.length > 0 ? 'emerald' : 'rose'}>
              {t('solvers.curves.mordellCount', { count: mordell.points.length, bound: mordell.bound })}
            </PanelHeading>
            {mordell.points.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 list-none">
                {mordell.points.map((p) => (
                  <li key={`${p.x},${p.y}`} className="px-2 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                    {`(${p.x}, ${p.y})`}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.curves.mordellNote')}</p>
          </Panel>
        ))}
    </div>
  );
}
