import React, { useMemo } from 'react';
import { Fingerprint, Scale, ShieldAlert, ShieldCheck, Sigma } from 'lucide-react';
import {
  STRONG_LIAR_LIMIT,
  countStrongLiars,
  fermatTest,
  isPrime,
  korseltTest,
  millerTest,
  parseBigInt,
  wilsonTest,
} from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';
import { useAutoSaveHistory, useSolverState } from '../../hooks/useSolverState';
import {
  EngineMessage,
  IntegerField,
  MathBox,
  Panel,
  PanelHeading,
  SaveToHistoryButton,
  ScrollableTable,
  SolverHeader,
} from '../ui/SolverPrimitives';

const FERMAT_OUTCOME = {
  probablePrime: { key: 'solvers.primality.fermatPass', tone: 'text-emerald-400' },
  pseudoprime: { key: 'solvers.primality.fermatPseudoprime', tone: 'text-amber-400' },
  composite: { key: 'solvers.primality.fermatFail', tone: 'text-rose-400' },
  notCoprime: { key: 'solvers.primality.fermatNotCoprime', tone: 'text-rose-400' },
};

const MILLER_OUTCOME = {
  probablePrime: { key: 'solvers.primality.millerPass', tone: 'text-emerald-400' },
  strongPseudoprime: { key: 'solvers.primality.strongPseudoprime', tone: 'text-amber-400' },
  composite: { key: 'solvers.primality.millerFail', tone: 'text-rose-400' },
};

/** NTIC §7.5 and §12.2–12.4: Wilson, Fermat, Miller and Korselt side by side. */
export default function PrimalitySolver() {
  const { engine, t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('primality', { n: '561', a: '2' });
  const { n, a } = values;

  const parsedN = parseBigInt(n);
  const valid = parsedN !== null && parsedN >= 2n;
  const prime = valid && isPrime(parsedN);

  const wilson = useMemo(() => wilsonTest(n), [n]);
  const fermat = useMemo(() => fermatTest(a, n), [a, n]);
  const miller = useMemo(() => millerTest(a, n), [a, n]);
  const korselt = useMemo(() => korseltTest(n, engine.factorisation), [n, engine.factorisation]);
  const liars = useMemo(
    () =>
      valid && !prime && parsedN % 2n === 1n && parsedN <= STRONG_LIAR_LIMIT ? countStrongLiars(parsedN) : null,
    [valid, prime, parsedN]
  );

  const summary = valid ? `${n} ${prime ? '\\in' : '\\notin'} \\mathbb{P}` : null;
  useAutoSaveHistory('primality', values, summary);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.primality.title" badge="(n−1)! · aⁿ⁻¹ · Miller" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <IntegerField
            label={t('fields.integerN')}
            value={n}
            onChange={(next) => setValue('n', next)}
            invalid={!valid}
          />
          <IntegerField
            label={t('fields.baseA')}
            value={a}
            onChange={(next) => setValue('a', next)}
            invalid={parseBigInt(a) === null}
          />
        </div>
        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {!valid ? (
        <EngineMessage code="requiresIntegerAboveOne" title={t('solvers.invalidInputTitle')} />
      ) : (
        <>
          <Panel tone={prime ? 'emerald' : 'rose'}>
            <PanelHeading Icon={prime ? ShieldCheck : ShieldAlert} tone={prime ? 'emerald' : 'rose'}>
              {prime ? t('solvers.primality.verdictPrime', { n }) : t('solvers.primality.verdictComposite', { n })}
            </PanelHeading>
            <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.primality.verdictNote')}</p>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel tone="amber">
              <PanelHeading Icon={Sigma} tone="amber">
                {t('solvers.primality.wilsonHeading')}
              </PanelHeading>
              {wilson.ok ? (
                <>
                  <MathBox math={wilson.latex} />
                  <p className={`text-xs font-semibold ${wilson.isMinusOne ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {wilson.isMinusOne
                      ? t('solvers.primality.wilsonPrime')
                      : t('solvers.primality.wilsonComposite')}
                  </p>
                  {wilson.pairs.length > 0 && (
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>{t('solvers.primality.wilsonPairs')}</div>
                      <div className="overflow-x-auto">
                        <MathRender
                          math={wilson.pairs.map(([x, y]) => `(${x} \\cdot ${y})`).join('\\,')}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EngineMessage code={wilson.code} vars={wilson.vars} tone="info" />
              )}
            </Panel>

            <Panel tone="indigo">
              <PanelHeading Icon={Scale} tone="indigo">
                {t('solvers.primality.fermatHeading', { a })}
              </PanelHeading>
              {fermat.ok ? (
                <>
                  {fermat.residue !== null && (
                    <MathBox math={`${a}^{${n} - 1} \\equiv ${fermat.residue} \\pmod{${n}}`} />
                  )}
                  <p className={`text-xs font-semibold ${FERMAT_OUTCOME[fermat.outcome].tone}`}>
                    {t(FERMAT_OUTCOME[fermat.outcome].key, { a, n, gcd: fermat.gcd })}
                  </p>
                </>
              ) : (
                <EngineMessage code={fermat.code} vars={fermat.vars} />
              )}
            </Panel>
          </div>

          <Panel>
            <PanelHeading Icon={Fingerprint}>{t('solvers.primality.millerHeading', { a })}</PanelHeading>
            {miller.ok ? (
              <>
                <p className="text-xs text-slate-400 leading-relaxed">{t('solvers.primality.millerExplain')}</p>
                <ScrollableTable>
                  <thead className="bg-slate-900 text-amber-400 border-b border-slate-800">
                    <tr>
                      <th scope="col" className="p-2">
                        {t('solvers.step')}
                      </th>
                      <th scope="col" className="p-2">
                        aᵏ mod n
                      </th>
                      <th scope="col" className="p-2">
                        {t('solvers.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {miller.steps.map((step, index) => (
                      <tr key={step.exponent.toString()}>
                        <td className="p-2 text-slate-400">{index + 1}</td>
                        <td className="p-2 text-slate-200 font-sans">
                          <MathRender math={step.latex} />
                        </td>
                        <td className="p-2 font-sans font-semibold">
                          {step.verdict === 'pass' && (
                            <span className="text-emerald-400">{t('solvers.primality.stepPass')}</span>
                          )}
                          {step.verdict === 'fail' && (
                            <span className="text-rose-400">{t('solvers.primality.stepFail')}</span>
                          )}
                          {step.verdict === 'continue' && (
                            <span className="text-slate-400">{t('solvers.primality.stepContinue')}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollableTable>
                <p className={`text-sm font-bold ${MILLER_OUTCOME[miller.outcome].tone}`}>
                  {t(MILLER_OUTCOME[miller.outcome].key, { a: miller.base, n })}
                </p>
              </>
            ) : (
              <EngineMessage code={miller.code} vars={miller.vars} tone="info" />
            )}
            {liars?.ok && (
              <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                {t('solvers.primality.liarCount', { n, count: liars.count, bound: liars.bound })}
              </p>
            )}
          </Panel>

          <Panel>
            <PanelHeading Icon={ShieldAlert}>{t('solvers.primality.korseltHeading')}</PanelHeading>
            {korselt.ok ? (
              <>
                <MathBox math={`${n} = ${korselt.factorString}`} />
                {korselt.verdict !== 'prime' && (
                  <ScrollableTable>
                    <thead className="bg-slate-900 text-amber-400 border-b border-slate-800">
                      <tr>
                        <th scope="col" className="p-2">
                          p
                        </th>
                        <th scope="col" className="p-2">
                          p − 1
                        </th>
                        <th scope="col" className="p-2">
                          (p − 1) | (n − 1)?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {korselt.rows.map((row) => (
                        <tr key={row.prime.toString()}>
                          <td className="p-2 text-slate-300">
                            {row.power > 1n ? `${row.prime}^${row.power}` : row.prime.toString()}
                          </td>
                          <td className="p-2 text-slate-300">{row.pMinusOne.toString()}</td>
                          <td className={`p-2 font-sans font-semibold ${row.divides ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {row.divides ? '✓' : '✗'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ScrollableTable>
                )}
                <p className={`text-xs font-semibold ${korselt.isCarmichael ? 'text-amber-400' : 'text-slate-300'}`}>
                  {t(`solvers.primality.korselt.${korselt.verdict}`, { n })}
                </p>
              </>
            ) : (
              <EngineMessage code={korselt.code} vars={korselt.vars} />
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
