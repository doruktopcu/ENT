import React, { useMemo } from 'react';
import { Grid2x2Check } from 'lucide-react';
import { positiveLatticePoints } from '../../../utils/bookEngineTier2';
import { useApp } from '../../../context/AppContext';
import { MathBox, Panel, PanelHeading } from '../../ui/SolverPrimitives';

/** Solutions with x, y > 0 (NTIC §3.3). Only meaningful for a, b > 0. */
export default function LatticePointsPanel({ a, b, c }) {
  const { t } = useApp();
  const result = useMemo(() => positiveLatticePoints(a, b, c), [a, b, c]);
  if (!result.ok || !result.solvable) return null;

  return (
    <Panel tone="indigo">
      <PanelHeading Icon={Grid2x2Check} tone="indigo">
        {t('solvers.lattice.heading', { count: result.count })}
      </PanelHeading>
      <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.lattice.explain')}</p>
      <MathBox math={result.latex} />
      {result.points.length > 0 && (
        <p className="text-xs font-mono text-indigo-300 leading-relaxed break-words">
          {result.points.map((p) => `(${p.x}, ${p.y})`).join(' ')}
          {result.truncated ? ' …' : ''}
        </p>
      )}
    </Panel>
  );
}
