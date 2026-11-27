import React, { useMemo } from 'react';
import { Award, Dices, Search, Sparkles } from 'lucide-react';
import { parseBigInt } from '../../utils/numberTheoryEngine';
import { fermatFactor, fermatNumber, lucasLehmer, pollardRho } from '../../utils/bookEngineTier2';
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
  { id: 'fermat', labelKey: 'solvers.factoring.modeFermat' },
  { id: 'rho', labelKey: 'solvers.factoring.modeRho' },
  { id: 'fermatNumbers', labelKey: 'solvers.factoring.modeFermatNumbers' },
  { id: 'mersenne', labelKey: 'solvers.factoring.modeMersenne' },
];

/** NTIC §12.1 (Fermat & Mersenne numbers), §12.5.3 and §12.6.1 (factoring). */
export default function FactoringSolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('factoring', {
    mode: 'fermat',
    n: '93',
    rhoN: '9991',
    seed: '2',
    c: '1',
    k: '5',
    p: '13',
  });
  const { mode } = values;

  const fermat = useMemo(() => (mode === 'fermat' ? fermatFactor(values.n) : null), [mode, values.n]);
  const rho = useMemo(
    () => (mode === 'rho' ? pollardRho(values.rhoN, { seed: values.seed, c: values.c }) : null),
    [mode, values.rhoN, values.seed, values.c]
  );
  const fNumber = useMemo(() => (mode === 'fermatNumbers' ? fermatNumber(values.k) : null), [mode, values.k]);
  const mersenne = useMemo(() => (mode === 'mersenne' ? lucasLehmer(values.p) : null), [mode, values.p]);

  let summary = null;
  if (fermat?.ok && fermat.found) summary = `${values.n} = ${fermat.a} \\cdot ${fermat.b}`;
  if (rho?.ok && rho.found) summary = `${values.rhoN} = ${rho.factor} \\cdot ${rho.cofactor}`;
  if (fNumber?.ok) summary = `F_{${fNumber.k}} ${fNumber.isPrime ? '\\in' : '\\notin'} \\mathbb{P}`;
  if (mersenne?.ok) summary = `2^{${mersenne.p}} - 1 ${mersenne.isPrime ? '\\in' : '\\notin'} \\mathbb{P}`;
  useAutoSaveHistory('factoring', values, summary);

  const field = (key, labelKey, invalid) => (
    <IntegerField
      key={key}
      label={t(labelKey)}
      value={values[key]}
      onChange={(next) => setValue(key, next)}
      invalid={invalid ?? parseBigInt(values[key]) === null}
    />
  );

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.factoring.title" badge="s² − t² · ρ · Fₖ · Mₚ" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />
        <p className="text-xs text-slate-400 leading-relaxed">{t(`solvers.factoring.explain.${mode}`)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mode === 'fermat' && field('n', 'fields.oddIntegerN', fermat && !fermat.ok)}
          {mode === 'rho' && [
            field('rhoN', 'fields.integerN', rho && !rho.ok),
            field('seed', 'fields.seed'),
            field('c', 'fields.polynomialShift'),
          ]}
          {mode === 'fermatNumbers' && field('k', 'fields.indexK', fNumber && !fNumber.ok)}
          {mode === 'mersenne' && field('p', 'fields.exponentP', mersenne && !mersenne.ok)}
        </div>
        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {fermat &&
        (!fermat.ok ? (
          <EngineMessage code={fermat.code} vars={fermat.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={fermat.found ? 'emerald' : 'rose'}>
            <PanelHeading Icon={Search} tone="emerald">
              {fermat.found
                ? t('solvers.factoring.fermatFound', { tries: fermat.tries })
                : t('solvers.factoring.fermatGaveUp', { tries: fermat.tries })}
            </PanelHeading>
            <ScrollableTable maxHeightClass="max-h-56 overflow-y-auto">
              <thead className="bg-slate-900 text-amber-400 sticky top-0">
                <tr>
                  <th scope="col" className="p-2">s</th>
                  <th scope="col" className="p-2">s² − n</th>
                  <th scope="col" className="p-2">{t('solvers.factoring.perfectSquare')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fermat.steps.map((step) => (
                  <tr key={step.s.toString()}>
                    <td className="p-2 text-slate-300">{step.s.toString()}</td>
                    <td className="p-2 text-slate-300">{step.r.toString()}</td>
                    <td className={`p-2 font-sans ${step.isSquare ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {step.isSquare ? '✓' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
            {fermat.found && <MathBox math={fermat.latex} />}
            {fermat.trivial && <p className="text-xs text-amber-400">{t('solvers.factoring.trivial')}</p>}
          </Panel>
        ))}

      {rho &&
        (!rho.ok ? (
          <EngineMessage code={rho.code} vars={rho.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={rho.found ? 'emerald' : 'rose'}>
            <PanelHeading Icon={Dices} tone="emerald">
              {rho.found ? t('solvers.factoring.rhoFound', { k: rho.k }) : t('solvers.factoring.rhoFailed')}
            </PanelHeading>
            <MathBox math={`x_0, x_1, \\dots = ${rho.sequence.slice(0, 8).join(', ')}, \\dots`} />
            <ScrollableTable maxHeightClass="max-h-56 overflow-y-auto">
              <thead className="bg-slate-900 text-amber-400 sticky top-0">
                <tr>
                  <th scope="col" className="p-2">k</th>
                  <th scope="col" className="p-2">x₂ₖ − xₖ</th>
                  <th scope="col" className="p-2">gcd(·, n)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rho.rounds.map((round) => (
                  <tr key={round.k}>
                    <td className="p-2 text-slate-400">{round.k}</td>
                    <td className="p-2 text-slate-300">{round.diff.toString()}</td>
                    <td className={`p-2 ${round.d === 1n ? 'text-slate-500' : 'text-emerald-400 font-bold'}`}>
                      {round.d.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
            {rho.found && <MathBox math={rho.latex} />}
          </Panel>
        ))}

      {fNumber &&
        (!fNumber.ok ? (
          <EngineMessage code={fNumber.code} vars={fNumber.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={fNumber.isPrime ? 'emerald' : 'amber'}>
            <PanelHeading Icon={Sparkles} tone={fNumber.isPrime ? 'emerald' : 'amber'}>
              {fNumber.isPrime
                ? t('solvers.factoring.fermatPrime', { k: fNumber.k })
                : t('solvers.factoring.fermatComposite', { k: fNumber.k })}
            </PanelHeading>
            <MathBox math={fNumber.latex} />
            <FactList
              items={[
                { label: t('solvers.factoring.value'), value: fNumber.value },
                { label: t('solvers.factoring.digits'), value: fNumber.digits },
              ]}
            />
            {fNumber.factor ? (
              <p className="text-xs text-slate-300">
                {t('solvers.factoring.fermatFactor', {
                  d: fNumber.factor.d,
                  j: fNumber.factor.j,
                  k2: fNumber.k + 2n,
                  cofactor: fNumber.factor.cofactor,
                })}
              </p>
            ) : (
              !fNumber.isPrime && <p className="text-xs text-slate-400">{t('solvers.factoring.noSmallFactor')}</p>
            )}
          </Panel>
        ))}

      {mersenne &&
        (!mersenne.ok ? (
          <EngineMessage code={mersenne.code} vars={mersenne.vars} title={t('solvers.invalidInputTitle')} />
        ) : (
          <Panel tone={mersenne.isPrime ? 'emerald' : 'rose'}>
            <PanelHeading Icon={Award} tone={mersenne.isPrime ? 'emerald' : 'rose'}>
              {mersenne.isPrime
                ? t('solvers.factoring.mersennePrime', { p: mersenne.p })
                : t('solvers.factoring.mersenneComposite', { p: mersenne.p })}
            </PanelHeading>
            <FactList items={[{ label: '2ᵖ − 1', value: mersenne.value }]} />
            {!mersenne.exponentPrime && (
              <p className="text-xs text-slate-300">
                {t('solvers.factoring.compositeExponent', { p: mersenne.p, divisor: mersenne.divisor })}
              </p>
            )}
            {mersenne.steps.length > 0 && (
              <ScrollableTable maxHeightClass="max-h-56 overflow-y-auto">
                <thead className="bg-slate-900 text-amber-400 sticky top-0">
                  <tr>
                    <th scope="col" className="p-2">i</th>
                    <th scope="col" className="p-2">xᵢ = xᵢ₋₁² − 2 mod 2ᵖ − 1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {mersenne.steps.map((step) => (
                    <tr key={step.i.toString()}>
                      <td className="p-2 text-slate-400">{step.i.toString()}</td>
                      <td className="p-2 text-slate-300 break-all">{step.residue}</td>
                    </tr>
                  ))}
                </tbody>
              </ScrollableTable>
            )}
            {mersenne.perfect && (
              <p className="text-xs text-emerald-300 break-all">
                {t('solvers.factoring.perfect', { p: mersenne.p, value: mersenne.perfect })}
              </p>
            )}
          </Panel>
        ))}
    </div>
  );
}
