import React, { useMemo, useState } from 'react';
import { Table2 } from 'lucide-react';
import { GROUP_TABLE_LIMIT, groupTables } from '../../../utils/bookEngineTier2';
import { parseBigInt } from '../../../utils/numberTheoryEngine';
import { useApp } from '../../../context/AppContext';
import { ModeTabs, Panel, PanelHeading, ScrollableTable } from '../../ui/SolverPrimitives';

const TABLES = [
  { id: 'multiplication', labelKey: 'solvers.groups.multiplication' },
  { id: 'addition', labelKey: 'solvers.groups.addition' },
  { id: 'powers', labelKey: 'solvers.groups.powers' },
];

/** Cayley tables and power table of ℤₙ (NTIC §8.1–8.2), units highlighted. */
export default function GroupTablesPanel({ n }) {
  const { t } = useApp();
  const [table, setTable] = useState('multiplication');
  const parsed = parseBigInt(n);
  const result = useMemo(
    () => (parsed !== null && parsed >= 2n && parsed <= GROUP_TABLE_LIMIT ? groupTables(parsed) : null),
    [parsed]
  );
  if (!result?.ok) return null;

  const units = new Set(result.units);
  const rows = result[table];
  const header = table === 'powers' ? rows[0].map((_, k) => `a^${k + 1}`) : rows.map((_, j) => j);

  return (
    <Panel>
      <PanelHeading Icon={Table2}>{t('solvers.groups.heading', { n: result.n })}</PanelHeading>
      <ModeTabs modes={TABLES} value={table} onChange={setTable} label={t('solvers.groups.heading', { n: result.n })} />
      <ScrollableTable maxHeightClass="max-h-80 overflow-y-auto">
        <thead className="bg-slate-900 text-amber-400 sticky top-0">
          <tr>
            <th scope="col" className="p-1.5">{table === 'addition' ? '+' : table === 'powers' ? 'a' : '·'}</th>
            {header.map((h) => (
              <th key={h} scope="col" className="p-1.5 text-center">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {rows.map((row, a) => (
            <tr key={a} className={table !== 'addition' && units.has(a) ? 'bg-emerald-500/5' : ''}>
              <th scope="row" className={`p-1.5 text-left ${units.has(a) ? 'text-emerald-300' : 'text-slate-500'}`}>{a}</th>
              {row.map((value, j) => (
                <td key={j} className={`p-1.5 text-center ${value === 1 && table !== 'addition' ? 'text-emerald-300 font-bold' : value === 0 ? 'text-slate-600' : 'text-slate-300'}`}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
      <p className="text-xs text-slate-400 leading-relaxed">
        {t('solvers.groups.units', {
          units: result.units.join(', '),
          orders: result.orders.map((o) => `ord(${o.a}) = ${o.order}`).join(', '),
        })}
      </p>
    </Panel>
  );
}
