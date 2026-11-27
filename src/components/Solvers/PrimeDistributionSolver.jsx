import React, { useMemo } from 'react';
import { BarChart3, Flag, Grid3x3, Infinity as InfinityIcon, Sigma, Users } from 'lucide-react';
import { parseBigInt } from '../../utils/numberTheoryEngine';
import {
  averageOrders,
  primeCounting,
  primeRace,
  sieveOfEratosthenes,
  twinPrimes,
  zetaApproximations,
} from '../../utils/bookEngineTier2';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  FactList,
  IntegerField,
  LineChart,
  MathBox,
  ModeTabs,
  Panel,
  PanelHeading,
  SaveToHistoryButton,
  SolverHeader,
  TextField,
} from '../ui/SolverPrimitives';

const MODES = [
  { id: 'sieve', labelKey: 'solvers.dist.modeSieve' },
  { id: 'counting', labelKey: 'solvers.dist.modeCounting' },
  { id: 'race', labelKey: 'solvers.dist.modeRace' },
  { id: 'twins', labelKey: 'solvers.dist.modeTwins' },
  { id: 'averages', labelKey: 'solvers.dist.modeAverages' },
  { id: 'zeta', labelKey: 'solvers.dist.modeZeta' },
];

const RACE_MODULI = [
  { id: '4', labelKey: 'solvers.dist.raceMod4' },
  { id: '3', labelKey: 'solvers.dist.raceMod3' },
];

const num = (value, digits = 4) =>
  Number.isInteger(value) ? value.toLocaleString('en-US') : value.toLocaleString('en-US', { maximumFractionDigits: digits });

/** NTIC §6.2.2 and the analytic chapters 20–22 and 24. */
export default function PrimeDistributionSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('prime_distribution', {
    mode: 'counting',
    sieveN: '100',
    x: '1000000',
    raceX: '100000',
    modulus: '4',
    twinX: '100000',
    avgX: '100000',
    s: '2',
    zetaN: '10000',
  });
  const { mode } = values;

  const sieve = useMemo(() => (mode === 'sieve' ? sieveOfEratosthenes(values.sieveN) : null), [mode, values.sieveN]);
  const counting = useMemo(() => (mode === 'counting' ? primeCounting(values.x) : null), [mode, values.x]);
  const race = useMemo(
    () => (mode === 'race' ? primeRace(values.raceX, values.modulus) : null),
    [mode, values.raceX, values.modulus]
  );
  const twins = useMemo(() => (mode === 'twins' ? twinPrimes(values.twinX) : null), [mode, values.twinX]);
  const averages = useMemo(() => (mode === 'averages' ? averageOrders(values.avgX) : null), [mode, values.avgX]);
  const zeta = useMemo(() => (mode === 'zeta' ? zetaApproximations(values.s, values.zetaN) : null), [mode, values.s, values.zetaN]);

  const active = { sieve, counting, race, twins, averages, zeta }[mode];

  let summary = null;
  if (sieve?.ok) summary = `\\pi(${sieve.n}) = ${sieve.count}`;
  if (counting?.ok) summary = `\\pi(${counting.x}) = ${counting.pi}, \\; \\mathrm{Li}(${counting.x}) \\approx ${counting.li.toFixed(1)}`;
  if (race?.ok) summary = `\\pi(${race.x}; ${race.modulus}, 1) = ${race.ones}, \\; \\pi(${race.x}; ${race.modulus}, ${race.other}) = ${race.others}`;
  if (twins?.ok) summary = `\\pi_2(${twins.x}) = ${twins.count}`;
  if (averages?.ok) summary = `\\tfrac{1}{${averages.x}}\\sum \\tau(n) \\approx ${averages.tau.average.toFixed(4)}`;
  if (zeta?.ok) summary = `\\zeta(${zeta.s}) \\approx ${zeta.partial.toFixed(8)}`;
  useAutoSaveHistory('prime_distribution', values, summary);

  const field = (key, labelKey) => (
    <IntegerField
      key={key}
      label={t(labelKey)}
      value={values[key]}
      onChange={(next) => setValue(key, next)}
      invalid={parseBigInt(values[key]) === null || (active && !active.ok)}
    />
  );

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.prime_distribution.title" badge="π(x) · Li(x) · ζ(s)" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />
        <p className="text-xs text-slate-400 leading-relaxed">{t(`solvers.dist.explain.${mode}`)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mode === 'sieve' && field('sieveN', 'fields.upToN')}
          {mode === 'counting' && field('x', 'fields.upToX')}
          {mode === 'race' && field('raceX', 'fields.upToX')}
          {mode === 'twins' && field('twinX', 'fields.upToX')}
          {mode === 'averages' && field('avgX', 'fields.upToX')}
          {mode === 'zeta' && (
            <>
              <TextField label={t('fields.realS')} value={values.s} onChange={(next) => setValue('s', next)} invalid={zeta && !zeta.ok} />
              {field('zetaN', 'fields.termsN')}
            </>
          )}
        </div>
        {mode === 'race' && (
          <ModeTabs modes={RACE_MODULI} value={values.modulus} onChange={(next) => setValue('modulus', next)} label={t('solvers.dist.raceModulus')} />
        )}
        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {active && !active.ok && <EngineMessage code={active.code} vars={active.vars} title={t('solvers.invalidInputTitle')} />}

      {sieve?.ok && (
        <Panel tone="amber">
          <PanelHeading Icon={Grid3x3} tone="amber">
            {t('solvers.dist.sieveCount', { n: sieve.n, count: sieve.count })}
          </PanelHeading>
          <p className="text-xs text-slate-300">{t('solvers.dist.sievingPrimes', { primes: sieve.sievingPrimes.join(', ') })}</p>
          <ul className="grid grid-cols-10 gap-1 list-none text-[11px] font-mono" aria-label={t('solvers.dist.sieveGrid')}>
            {sieve.grid.map(({ k, crossedBy }) => (
              <li
                key={k}
                title={crossedBy ? `${k} = ${crossedBy} · ${k / crossedBy}` : undefined}
                className={`text-center py-1 rounded border ${
                  crossedBy === 0
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {k}
                {crossedBy ? <sub className="text-[8px] text-slate-500">{crossedBy}</sub> : null}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500">{t('solvers.dist.sieveLegend')}</p>
        </Panel>
      )}

      {counting?.ok && (
        <Panel tone="indigo">
          <PanelHeading Icon={BarChart3} tone="indigo">
            {t('solvers.dist.countingHeading', { x: num(counting.x) })}
          </PanelHeading>
          <FactList
            items={[
              { label: 'π(x)', value: num(counting.pi) },
              { label: 'Li(x)', value: num(counting.li, 1) },
              { label: 'x / ln x', value: num(counting.xOverLog, 1) },
              { label: 'π(x) / (x / ln x)', value: num(counting.pi / counting.xOverLog) },
              { label: 'Li(x) − π(x)', value: num(counting.li - counting.pi, 1) },
              { label: 'x / ln x − π(x)', value: num(counting.xOverLog - counting.pi, 1) },
            ]}
          />
          <LineChart
            series={[
              { label: 'π(x)', points: counting.series.map((p) => ({ x: p.x, y: p.pi })) },
              { label: 'Li(x)', points: counting.series.map((p) => ({ x: p.x, y: p.li })) },
              { label: 'x/ln x', points: counting.series.map((p) => ({ x: p.x, y: p.xOverLog })) },
            ]}
            yLabel={t('solvers.dist.countingHeading', { x: num(counting.x) })}
          />
          {/* The curves above nearly coincide; the errors are where the story is. */}
          <LineChart
            series={[
              { label: 'Li − π', color: '#818cf8', points: counting.series.map((p) => ({ x: p.x, y: p.li - p.pi })) },
              { label: 'x/ln x − π', color: '#34d399', points: counting.series.map((p) => ({ x: p.x, y: p.xOverLog - p.pi })) },
            ]}
            zeroLine
            height={150}
            yLabel={t('solvers.dist.errorChart')}
          />
          <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.dist.pntNote')}</p>
        </Panel>
      )}

      {race?.ok && (
        <Panel tone="amber">
          <PanelHeading Icon={Flag} tone="amber">
            {t('solvers.dist.raceHeading', { m: race.modulus, x: num(race.x) })}
          </PanelHeading>
          <FactList
            items={[
              { label: `p ≡ 1 (mod ${race.modulus})`, value: num(race.ones) },
              { label: `p ≡ ${race.other} (mod ${race.modulus})`, value: num(race.others) },
            ]}
          />
          <LineChart
            series={[{ label: `#${race.other} − #1`, points: race.series.map((p) => ({ x: p.x, y: p.gap })) }]}
            zeroLine
            yLabel={t('solvers.dist.raceHeading', { m: race.modulus, x: num(race.x) })}
          />
          <p className="text-xs text-slate-300">
            {race.oneLeadsFirst
              ? t('solvers.dist.raceFirstLead', { x: num(race.oneLeadsFirst), m: race.modulus })
              : t('solvers.dist.raceNeverLeads', { x: num(race.x), m: race.modulus, other: race.other })}
          </p>
          {race.changes.length > 0 && (
            <p className="text-[11px] text-slate-500">
              {t('solvers.dist.raceChanges', { list: race.changes.map((c) => `${c.x}→${c.leader}`).join(', ') })}
            </p>
          )}
        </Panel>
      )}

      {twins?.ok && (
        <Panel tone="emerald">
          <PanelHeading Icon={Users} tone="emerald">
            {t('solvers.dist.twinsHeading', { count: num(twins.count), x: num(twins.x) })}
          </PanelHeading>
          <FactList
            items={[
              { label: 'π₂(x)', value: num(twins.count) },
              { label: '2C₂ ∫₂ˣ dt / (ln t)²', value: num(twins.estimate, 1) },
            ]}
          />
          <p className="text-xs font-mono text-emerald-300 leading-relaxed break-words">
            {twins.pairs.map(([p, q]) => `(${p}, ${q})`).join(' ')}
            {twins.count > twins.pairs.length ? ' …' : ''}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.dist.twinsNote')}</p>
        </Panel>
      )}

      {averages?.ok && (
        <Panel tone="indigo">
          <PanelHeading Icon={Sigma} tone="indigo">
            {t('solvers.dist.averagesHeading', { x: num(averages.x) })}
          </PanelHeading>
          <FactList
            items={[
              { label: '(1/x) Σ τ(n)', value: num(averages.tau.average) },
              { label: 'ln x + 2γ − 1', value: num(averages.tau.prediction) },
              { label: '(1/x) Σ σ(n)', value: num(averages.sigma.average, 2) },
              { label: 'π² x / 12', value: num(averages.sigma.prediction, 2) },
              { label: '(1/x) Σ φ(n)', value: num(averages.phi.average, 2) },
              { label: '3x / π²', value: num(averages.phi.prediction, 2) },
              { label: '#{a² + b² ≤ x} / x', value: num(averages.circle.average, 6) },
              { label: 'π', value: num(Math.PI, 6) },
            ]}
          />
        </Panel>
      )}

      {zeta?.ok && (
        <Panel tone="amber">
          <PanelHeading Icon={InfinityIcon} tone="amber">
            {t('solvers.dist.zetaHeading', { s: zeta.s, n: num(zeta.N) })}
          </PanelHeading>
          <MathBox math={`\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p} \\frac{1}{1 - p^{-s}}`} />
          <FactList
            items={[
              { label: `Σ_{n ≤ ${zeta.N}} n⁻ˢ`, value: zeta.partial.toFixed(12) },
              { label: `∏_{p ≤ ${zeta.N}} (1 − p⁻ˢ)⁻¹`, value: zeta.product.toFixed(12) },
              { label: t('solvers.dist.tailBound'), value: zeta.tailBound.toExponential(3) },
              ...(zeta.exact !== null ? [{ label: t('solvers.dist.exactValue'), value: zeta.exact.toFixed(12) }] : []),
            ]}
          />
        </Panel>
      )}
    </div>
  );
}
