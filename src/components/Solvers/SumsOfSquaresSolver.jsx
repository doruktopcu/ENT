import React, { useMemo } from 'react';
import { CheckCircle, Circle, Triangle, XCircle } from 'lucide-react';
import { parseBigInt } from '../../utils/numberTheoryEngine';
import {
  pythagoreanFromPQ,
  pythagoreanTriples,
  sumOfTwoSquares,
  sumsOfSquares,
} from '../../utils/bookEngineTier2';
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
  { id: 'two', labelKey: 'solvers.squares.modeTwo' },
  { id: 'more', labelKey: 'solvers.squares.modeMore' },
  { id: 'pythagorean', labelKey: 'solvers.squares.modePythagorean' },
];

const squaresLatex = (list) => list.map((x) => `${x}^2`).join(' + ');

/** NTIC §3.4, chapter 13 and §14.1–14.2. */
export default function SumsOfSquaresSolver() {
  const { engine, t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('sums_of_squares', {
    mode: 'two',
    n: '325',
    m: '1000',
    limit: '100',
    p: '2',
    q: '3',
  });
  const { mode } = values;

  const two = useMemo(
    () => (mode === 'two' ? sumOfTwoSquares(values.n, engine.factorisation) : null),
    [mode, values.n, engine.factorisation]
  );
  const more = useMemo(() => (mode === 'more' ? sumsOfSquares(values.m) : null), [mode, values.m]);
  const triples = useMemo(
    () => (mode === 'pythagorean' ? pythagoreanTriples(values.limit) : null),
    [mode, values.limit]
  );
  const single = useMemo(
    () => (mode === 'pythagorean' ? pythagoreanFromPQ(values.p, values.q) : null),
    [mode, values.p, values.q]
  );

  let summary = null;
  if (two?.ok) summary = `r_2(${two.n}) = ${two.r2}`;
  if (more?.ok && more.four) summary = `${more.n} = ${squaresLatex(more.four)}`;
  if (triples?.ok) summary = `\\#\\{(x, y, z) : z \\le ${triples.N}\\} = ${triples.count}`;
  useAutoSaveHistory('sums_of_squares', values, summary);

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
        <SolverHeader titleKey="topics.sums_of_squares.title" badge="a² + b² · x² + y² = z²" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />
        {mode === 'two' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field('n', 'fields.integerN', two && !two.ok)}</div>}
        {mode === 'more' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field('m', 'fields.integerN', more && !more.ok)}</div>}
        {mode === 'pythagorean' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {field('limit', 'fields.hypotenuseLimit', triples && !triples.ok)}
            {field('p', 'fields.parameterP', single && !single.ok)}
            {field('q', 'fields.parameterQ', single && !single.ok)}
          </div>
        )}
        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {two &&
        (!two.ok ? (
          <EngineMessage code={two.code} vars={two.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={two.representable ? 'emerald' : 'rose'}>
            <PanelHeading Icon={two.representable ? CheckCircle : XCircle} tone={two.representable ? 'emerald' : 'rose'}>
              {two.representable
                ? t('solvers.squares.isSum', { n: two.n })
                : t('solvers.squares.isNotSum', { n: two.n })}
            </PanelHeading>
            <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.squares.criterion')}</p>
            <MathBox math={`${two.n} = ${two.factorString}`} />
            <ScrollableTable>
              <thead className="bg-slate-900 text-amber-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="p-2">pᵉ</th>
                  <th scope="col" className="p-2">p mod 4</th>
                  <th scope="col" className="p-2">{t('solvers.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {two.rows.map((row) => (
                  <tr key={row.prime.toString()}>
                    <td className="p-2 text-slate-300">{`${row.prime}^${row.power}`}</td>
                    <td className="p-2 text-slate-300">{row.residue.toString()}</td>
                    <td className={`p-2 font-sans font-semibold ${row.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.ok ? '✓' : t('solvers.squares.oddPower')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
            <MathBox math={`r_2(${two.n}) = ${two.r2}`} />
            {two.representations && two.representations.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300">{t('solvers.squares.representations')}</div>
                <ul className="flex flex-wrap gap-1.5 list-none">
                  {two.representations.map(({ a, b }) => (
                    <li key={a.toString()} className="px-2 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                      {`${a}² + ${b}²`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {two.representable && two.representations === null && (
              <p className="text-xs text-slate-400">{t('solvers.squares.tooLargeToList')}</p>
            )}
            {two.gaussian && (
              <MathBox math={`${two.n} = (${two.gaussian.a} + ${two.gaussian.b}i)(${two.gaussian.a} - ${two.gaussian.b}i), \\quad N(a + bi) = a^2 + b^2`} />
            )}
          </Panel>
        ))}

      {more &&
        (!more.ok ? (
          <EngineMessage code={more.code} vars={more.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone="indigo">
            <PanelHeading Icon={Circle} tone="indigo">
              {t('solvers.squares.lagrangeHeading')}
            </PanelHeading>
            <MathBox math={`${more.n} = ${squaresLatex(more.four)}`} />
            {more.three ? (
              <MathBox math={`${more.n} = ${squaresLatex(more.three)}`} />
            ) : (
              <p className="text-xs text-rose-300">
                {t('solvers.squares.threeObstructed', { n: more.n, a: more.obstruction.a, b: more.obstruction.b })}
              </p>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.squares.lagrangeNote')}</p>
          </Panel>
        ))}

      {mode === 'pythagorean' && single && (
        <Panel tone="amber">
          <PanelHeading Icon={Triangle} tone="amber">
            {t('solvers.squares.fromPQ')}
          </PanelHeading>
          {single.ok ? (
            <>
              <MathBox math={single.latex} />
              <p className="text-xs text-slate-300">
                {t(single.primitive ? 'solvers.squares.primitive' : 'solvers.squares.notPrimitive', {
                  x: single.x,
                  y: single.y,
                  z: single.z,
                  area: single.area,
                })}
              </p>
            </>
          ) : (
            <EngineMessage code={single.code} vars={single.vars} />
          )}
        </Panel>
      )}

      {triples &&
        (!triples.ok ? (
          <EngineMessage code={triples.code} vars={triples.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel>
            <PanelHeading>
              {t('solvers.squares.tripleCount', {
                count: triples.count,
                primitive: triples.primitiveCount,
                n: triples.N,
              })}
            </PanelHeading>
            <ScrollableTable maxHeightClass="max-h-64 overflow-y-auto">
              <thead className="bg-slate-900 text-amber-400 sticky top-0">
                <tr>
                  <th scope="col" className="p-2">(x, y, z)</th>
                  <th scope="col" className="p-2">(p, q)</th>
                  <th scope="col" className="p-2">k</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {triples.triples.map((row) => (
                  <tr key={`${row.x}-${row.y}-${row.z}`} className={row.primitive ? 'text-emerald-300' : 'text-slate-400'}>
                    <td className="p-2">{`(${row.x}, ${row.y}, ${row.z})`}</td>
                    <td className="p-2">{`(${row.p}, ${row.q})`}</td>
                    <td className="p-2">{row.k.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
            {triples.truncated && (
              <p className="text-xs text-amber-400">
                {t('solvers.listTruncated', { shown: triples.triples.length, total: triples.count })}
              </p>
            )}
          </Panel>
        ))}
    </div>
  );
}
