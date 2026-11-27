import React, { useId, useMemo } from 'react';
import { FunctionSquare, Heart, Repeat, Sigma } from 'lucide-react';
import { parseBigInt } from '../../utils/numberTheoryEngine';
import {
  ARITHMETIC_FUNCTIONS,
  arithmeticProfile,
  dirichletProduct,
  mobiusInversion,
  thabitRule,
} from '../../utils/bookEngineTier2';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  FactList,
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
  { id: 'profile', labelKey: 'solvers.arith.modeProfile' },
  { id: 'dirichlet', labelKey: 'solvers.arith.modeDirichlet' },
  { id: 'inversion', labelKey: 'solvers.arith.modeInversion' },
  { id: 'thabit', labelKey: 'solvers.arith.modeThabit' },
];

/** Notation for the named functions; language-neutral. */
const SYMBOL = { I: 'I', u: 'u', N: 'N', mu: 'μ', phi: 'φ', tau: 'τ', sigma: 'σ', lambda: 'λ', mu2: 'μ²' };

function FunctionSelect({ label, value, onChange }) {
  const { t } = useApp();
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 mb-1">
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="math-input w-full">
        {ARITHMETIC_FUNCTIONS.map((name) => (
          <option key={name} value={name}>
            {`${SYMBOL[name]} — ${t(`solvers.arith.fn.${name}`)}`}
          </option>
        ))}
      </select>
    </div>
  );
}

/** NTIC chapters 18–19 (σ, perfect and amicable numbers) and 23 (Dirichlet products). */
export default function ArithmeticFunctionsSolver() {
  const { engine, t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('arithmetic_functions', {
    mode: 'profile',
    n: '220',
    f: 'mu',
    g: 'N',
    N: '30',
    thabitN: '2',
  });
  const { mode } = values;

  const profile = useMemo(
    () => (mode === 'profile' ? arithmeticProfile(values.n, engine.factorisation) : null),
    [mode, values.n, engine.factorisation]
  );
  const product = useMemo(
    () => (mode === 'dirichlet' ? dirichletProduct(values.f, values.g, values.N) : null),
    [mode, values.f, values.g, values.N]
  );
  const inversion = useMemo(
    () => (mode === 'inversion' ? mobiusInversion(values.g, values.N) : null),
    [mode, values.g, values.N]
  );
  const thabit = useMemo(() => (mode === 'thabit' ? thabitRule(values.thabitN) : null), [mode, values.thabitN]);

  let summary = null;
  if (profile?.ok) summary = `\\sigma(${profile.n}) = ${profile.sigma}, \\; \\tau(${profile.n}) = ${profile.tau}`;
  if (product?.ok) summary = `${SYMBOL[values.f]} \\star ${SYMBOL[values.g]}${product.matches ? ` = ${SYMBOL[product.matches]}` : ''}`;
  if (inversion?.ok) summary = `(${SYMBOL[values.g]} \\star u) \\star \\mu = ${SYMBOL[values.g]}`;
  if (thabit?.ok && thabit.pair) summary = `(${thabit.pair[0]}, ${thabit.pair[1]})`;
  useAutoSaveHistory('arithmetic_functions', values, summary);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.arithmetic_functions.title" badge="σₖ · μ · f ⋆ g" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />

        {mode === 'profile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IntegerField label={t('fields.positiveIntegerN')} value={values.n} onChange={(next) => setValue('n', next)} invalid={profile && !profile.ok} />
          </div>
        )}
        {mode === 'dirichlet' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FunctionSelect label={t('fields.functionF')} value={values.f} onChange={(next) => setValue('f', next)} />
            <FunctionSelect label={t('fields.functionG')} value={values.g} onChange={(next) => setValue('g', next)} />
            <IntegerField label={t('fields.upToN')} value={values.N} onChange={(next) => setValue('N', next)} invalid={product && !product.ok} />
          </div>
        )}
        {mode === 'inversion' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FunctionSelect label={t('fields.functionG')} value={values.g} onChange={(next) => setValue('g', next)} />
            <IntegerField label={t('fields.upToN')} value={values.N} onChange={(next) => setValue('N', next)} invalid={inversion && !inversion.ok} />
          </div>
        )}
        {mode === 'thabit' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IntegerField label={t('fields.integerN')} value={values.thabitN} onChange={(next) => setValue('thabitN', next)} invalid={parseBigInt(values.thabitN) === null || (thabit && !thabit.ok)} />
          </div>
        )}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {profile &&
        (!profile.ok ? (
          <EngineMessage code={profile.code} vars={profile.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <>
            <Panel tone="amber">
              <PanelHeading Icon={Sigma} tone="amber">
                {t(`solvers.arith.kind.${profile.kind}`, { n: profile.n })}
              </PanelHeading>
              <MathBox math={`${profile.n} = ${profile.factorString}, \\quad \\frac{\\sigma(n)}{n} = \\frac{${profile.abundancy.num}}{${profile.abundancy.den}}`} />
              <FactList
                items={[
                  { label: 'τ(n) = σ₀(n)', value: profile.tau.toString() },
                  { label: 'σ(n) = σ₁(n)', value: profile.sigma.toString() },
                  { label: 'σ₂(n)', value: profile.sigma2.toString() },
                  { label: 'σ₃(n)', value: profile.sigma3.toString() },
                  { label: 'φ(n)', value: profile.phi.toString() },
                  { label: 'μ(n)', value: profile.mu.toString() },
                  { label: 'λ(n) = (−1)^Ω(n)', value: profile.lambda.toString() },
                  { label: 'ω(n), Ω(n)', value: `${profile.omega}, ${profile.bigOmega}` },
                  {
                    label: 'Λ(n)',
                    value: profile.vonMangoldtPrime ? `ln ${profile.vonMangoldtPrime} ≈ ${profile.vonMangoldt.toFixed(6)}` : '0',
                  },
                  { label: 's(n) = σ(n) − n', value: profile.aliquot.toString() },
                ]}
              />
              {profile.multiplyPerfect !== null && profile.multiplyPerfect > 2n && (
                <p className="text-xs text-emerald-300">{t('solvers.arith.multiplyPerfect', { n: profile.n, k: profile.multiplyPerfect })}</p>
              )}
            </Panel>
            <Panel tone="indigo">
              <PanelHeading Icon={Heart} tone="indigo">
                {t('solvers.arith.aliquotHeading')}
              </PanelHeading>
              <MathBox math={profile.chain.join(' \\to ')} />
              <p className="text-xs text-slate-300">
                {profile.amicablePartner !== null
                  ? t('solvers.arith.amicable', { n: profile.n, m: profile.amicablePartner })
                  : t('solvers.arith.notAmicable', { n: profile.n })}
              </p>
            </Panel>
          </>
        ))}

      {(product || inversion) &&
        ((product ?? inversion).ok ? (
          <Panel tone="emerald">
            <PanelHeading Icon={product ? FunctionSquare : Repeat} tone="emerald">
              {product
                ? product.matches
                  ? t('solvers.arith.productMatches', { f: SYMBOL[values.f], g: SYMBOL[values.g], h: SYMBOL[product.matches] })
                  : t('solvers.arith.productNew', { f: SYMBOL[values.f], g: SYMBOL[values.g] })
                : inversion.recovered
                  ? t('solvers.arith.inversionWorks', { g: SYMBOL[values.g] })
                  : t('solvers.arith.inversionFails')}
            </PanelHeading>
            <MathBox
              math={
                product
                  ? `(f \\star g)(n) = \\sum_{d \\mid n} f(d)\\, g\\!\\left(\\tfrac{n}{d}\\right)`
                  : `f = g \\star u \\iff g = f \\star \\mu`
              }
            />
            {inversion?.fMatches && (
              <p className="text-xs text-slate-300">
                {t('solvers.arith.inversionF', { g: SYMBOL[values.g], f: SYMBOL[inversion.fMatches] })}
              </p>
            )}
            <ScrollableTable maxHeightClass="max-h-64 overflow-y-auto">
              <thead className="bg-slate-900 text-amber-400 sticky top-0">
                <tr>
                  <th scope="col" className="p-2">n</th>
                  {product ? (
                    <>
                      <th scope="col" className="p-2">{SYMBOL[values.f]}(n)</th>
                      <th scope="col" className="p-2">{SYMBOL[values.g]}(n)</th>
                      <th scope="col" className="p-2">({SYMBOL[values.f]} ⋆ {SYMBOL[values.g]})(n)</th>
                    </>
                  ) : (
                    <>
                      <th scope="col" className="p-2">g(n)</th>
                      <th scope="col" className="p-2">f = g ⋆ u</th>
                      <th scope="col" className="p-2">f ⋆ μ</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(product ?? inversion).rows.map((row) => (
                  <tr key={row.n}>
                    <td className="p-2 text-slate-400">{row.n}</td>
                    {product ? (
                      <>
                        <td className="p-2 text-slate-300">{row.f}</td>
                        <td className="p-2 text-slate-300">{row.g}</td>
                        <td className="p-2 text-emerald-300 font-bold">{row.h}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2 text-slate-300">{row.g}</td>
                        <td className="p-2 text-amber-300">{row.f}</td>
                        <td className="p-2 text-emerald-300 font-bold">{row.back}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
          </Panel>
        ) : (
          <EngineMessage code={(product ?? inversion).code} vars={(product ?? inversion).vars} title={t('solvers.invalidInputTitle')} />
        ))}

      {thabit &&
        (!thabit.ok ? (
          <EngineMessage code={thabit.code} vars={thabit.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={thabit.works ? 'emerald' : 'rose'}>
            <PanelHeading Icon={Heart} tone={thabit.works ? 'emerald' : 'rose'}>
              {thabit.works ? t('solvers.arith.thabitWorks', { n: thabit.n }) : t('solvers.arith.thabitFails', { n: thabit.n })}
            </PanelHeading>
            <MathBox math={`p_n = 3 \\cdot 2^n - 1, \\quad q_n = 9 \\cdot 2^{2n-1} - 1`} />
            <FactList
              items={thabit.checks.map((c) => ({
                label: c.label.replace('_{n-1}', 'ₙ₋₁').replace('_n', 'ₙ'),
                value: `${c.value} ${c.prime ? '✓' : '✗'}`,
              }))}
            />
            {thabit.pair && <MathBox math={`2^{${thabit.n}} p_{n-1} p_n = ${thabit.pair[0]}, \\quad 2^{${thabit.n}} q_n = ${thabit.pair[1]}`} />}
          </Panel>
        ))}
    </div>
  );
}
