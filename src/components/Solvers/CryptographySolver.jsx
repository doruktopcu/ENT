import React, { useMemo } from 'react';
import { KeyRound, Lock, Share2, Unlock, Users } from 'lucide-react';
import {
  affineCipher,
  decodeNumber,
  diffieHellman,
  exponentCipher,
  parseBigInt,
  rsaCipher,
  secretSharing,
} from '../../utils/numberTheoryEngine';
import MathRender from '../MathRender';
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
  StepList,
  TextField,
} from '../ui/SolverPrimitives';

const MODES = [
  { id: 'affine', labelKey: 'solvers.crypto.modeAffine' },
  { id: 'exponent', labelKey: 'solvers.crypto.modeExponent' },
  { id: 'dh', labelKey: 'solvers.crypto.modeDh' },
  { id: 'rsa', labelKey: 'solvers.crypto.modeRsa' },
  { id: 'sharing', labelKey: 'solvers.crypto.modeSharing' },
];

const INPUT_TYPES = [
  { id: 'text', labelKey: 'solvers.crypto.inputText' },
  { id: 'numbers', labelKey: 'solvers.crypto.inputNumbers' },
];

/** How many block rows the cipher table shows. */
const BLOCK_ROW_LIMIT = 60;

/**
 * Defaults are the book's own worked examples, so a student can follow the
 * text: Caesar (§11.2.1), Example 11.4.3, Example 11.5.4 and Example 11.7.2.
 */
const DEFAULTS = {
  mode: 'affine',
  message: 'MathIsCool',
  inputType: 'text',
  affineBlock: '1',
  affineA: '1',
  affineB: '3',
  affineN: '26',
  expBlock: '0',
  expP: '2305843009213693951',
  expE: '17',
  dhP: '991',
  dhG: '55',
  dhM: '130',
  dhN: '123',
  rsaBlock: '2',
  rsaP: '89',
  rsaQ: '97',
  rsaE: '71',
  secretK: '5',
  shareP: '13',
  shareM1: '17',
  shareM2: '19',
  shareM3: '16',
  shareT: '12',
};

/** Plaintext → ciphertext → recovered, one row per block. */
function BlockTable({ result, cipherModulus }) {
  const { t } = useApp();
  const rows = result.blocks.slice(0, BLOCK_ROW_LIMIT);
  const showLetters = result.letters !== null;

  return (
    <ScrollableTable maxHeightClass="max-h-64 overflow-y-auto">
      <thead className="bg-slate-900 text-amber-400 sticky top-0">
        <tr>
          {showLetters && (
            <th scope="col" className="p-2">
              {t('solvers.crypto.block')}
            </th>
          )}
          <th scope="col" className="p-2">
            x
          </th>
          <th scope="col" className="p-2">
            {t('solvers.crypto.encrypted')}
          </th>
          <th scope="col" className="p-2">
            {t('solvers.crypto.decrypted')}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60">
        {rows.map((x, index) => (
          // Blocks can repeat ("TH" twice), so position is the identity.
          <tr key={index}>
            {showLetters && <td className="p-2 text-slate-300">{decodeNumber(x)}</td>}
            <td className="p-2 text-slate-300">{x.toString()}</td>
            <td className="p-2 text-amber-300 break-all">{result.cipher[index].toString()}</td>
            <td className={`p-2 ${result.decrypted[index] === x ? 'text-emerald-300' : 'text-rose-300'}`}>
              {result.decrypted[index].toString()}
            </td>
          </tr>
        ))}
      </tbody>
      {cipherModulus && (
        <caption className="caption-bottom text-left text-[11px] text-slate-500 pt-2 font-sans">
          {t('solvers.crypto.blocksBelow', { n: cipherModulus })}
        </caption>
      )}
    </ScrollableTable>
  );
}

/** Message input shared by the three ciphers. */
function MessageInputs({ values, setValue, blockKey, allowWhole }) {
  const { t } = useApp();

  return (
    <div className="space-y-3">
      <ModeTabs
        modes={INPUT_TYPES}
        value={values.inputType}
        onChange={(next) => setValue('inputType', next)}
        label={t('solvers.crypto.inputType')}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextField
          className="sm:col-span-2"
          label={values.inputType === 'text' ? t('fields.message') : t('fields.numberList')}
          value={values.message}
          onChange={(next) => setValue('message', next)}
        />
        {values.inputType === 'text' && (
          <IntegerField
            label={allowWhole ? t('fields.blockSizeWhole') : t('fields.blockSize')}
            value={values[blockKey]}
            onChange={(next) => setValue(blockKey, next)}
            invalid={parseBigInt(values[blockKey]) === null}
          />
        )}
      </div>
      {values.inputType === 'text' && (
        <p className="text-[11px] text-slate-500 leading-relaxed">{t('solvers.crypto.encodingNote')}</p>
      )}
    </div>
  );
}

/** NTIC chapter 11: classical and public-key ciphers built on congruences. */
export default function CryptographySolver() {
  const { t } = useApp();
  const { values, setValue, save, justSaved } = useSolverState('cryptography', DEFAULTS);
  const { mode } = values;

  const result = useMemo(() => {
    const message = values.message;
    const inputMode = values.inputType;
    switch (mode) {
      case 'affine':
        return affineCipher({
          message,
          mode: inputMode,
          blockSize: values.affineBlock,
          a: values.affineA,
          b: values.affineB,
          n: values.affineN,
        });
      case 'exponent':
        return exponentCipher({ message, mode: inputMode, blockSize: values.expBlock, p: values.expP, e: values.expE });
      case 'dh':
        return diffieHellman(values.dhP, values.dhG, values.dhM, values.dhN);
      case 'rsa':
        return rsaCipher({
          message,
          mode: inputMode,
          blockSize: values.rsaBlock,
          p: values.rsaP,
          q: values.rsaQ,
          e: values.rsaE,
        });
      case 'sharing':
        return secretSharing({
          K: values.secretK,
          p: values.shareP,
          moduli: [values.shareM1, values.shareM2, values.shareM3],
          t: values.shareT,
        });
      default:
        return { ok: false, code: 'invalidInput' };
    }
  }, [mode, values]);

  let summary = null;
  if (result.ok) {
    if (mode === 'affine') summary = `${result.encryptLatex} : \\{${result.cipher.join(', ')}\\}`;
    if (mode === 'exponent') summary = `p = ${result.p},\\; e = ${result.e},\\; f = ${result.f}`;
    if (mode === 'dh') summary = `K \\equiv ${result.aliceKey} \\pmod{${result.p}}`;
    if (mode === 'rsa') summary = `(n, e) = (${result.n}, ${result.e}),\\; d = ${result.d}`;
    if (mode === 'sharing') summary = `K_0 = ${result.K0},\\; k = (${result.keys.map((k) => k.key).join(', ')})`;
  }
  useAutoSaveHistory('cryptography', values, summary);

  const field = (key, labelKey) => (
    <IntegerField
      key={key}
      label={t(labelKey)}
      value={values[key]}
      onChange={(next) => setValue(key, next)}
      invalid={parseBigInt(values[key]) === null}
    />
  );

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <SolverHeader titleKey="topics.cryptography.title" badge="ax+b · xᵉ · gᵐⁿ · RSA" />
        <ModeTabs modes={MODES} value={mode} onChange={(next) => setValue('mode', next)} label={t('solvers.modeLabel')} />
        <p className="text-xs text-slate-400 leading-relaxed">{t(`solvers.crypto.explain.${mode}`)}</p>

        {mode === 'affine' && (
          <>
            <MessageInputs values={values} setValue={setValue} blockKey="affineBlock" />
            <div className="grid grid-cols-3 gap-3">
              {field('affineA', 'fields.multiplierA')}
              {field('affineB', 'fields.shiftB')}
              {field('affineN', 'fields.modulusN')}
            </div>
          </>
        )}

        {mode === 'exponent' && (
          <>
            <MessageInputs values={values} setValue={setValue} blockKey="expBlock" allowWhole />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('expP', 'fields.primeP')}
              {field('expE', 'fields.exponentE')}
            </div>
          </>
        )}

        {mode === 'dh' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {field('dhP', 'fields.primeP')}
            {field('dhG', 'fields.baseG')}
            {field('dhM', 'fields.aliceSecret')}
            {field('dhN', 'fields.bobSecret')}
          </div>
        )}

        {mode === 'rsa' && (
          <>
            <MessageInputs values={values} setValue={setValue} blockKey="rsaBlock" allowWhole />
            <div className="grid grid-cols-3 gap-3">
              {field('rsaP', 'fields.primeP')}
              {field('rsaQ', 'fields.primeQ')}
              {field('rsaE', 'fields.publicExponent')}
            </div>
          </>
        )}

        {mode === 'sharing' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {field('secretK', 'fields.secretK')}
            {field('shareP', 'fields.primeP')}
            {field('shareT', 'fields.randomT')}
            {field('shareM1', 'fields.shareModulus1')}
            {field('shareM2', 'fields.shareModulus2')}
            {field('shareM3', 'fields.shareModulus3')}
          </div>
        )}

        <div className="flex justify-end">
          <SaveToHistoryButton onSave={() => save(summary)} justSaved={justSaved} disabled={!summary} />
        </div>
      </div>

      {!result.ok ? (
        <EngineMessage code={result.code} vars={result.vars} title={t('solvers.invalidInputTitle')} />
      ) : (
        <>
          {mode === 'affine' && (
            <Panel tone="amber">
              <PanelHeading Icon={Lock} tone="amber">
                {t('solvers.crypto.keys')}
              </PanelHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <MathBox math={result.encryptLatex} />
                <MathBox math={result.decryptLatex} />
              </div>
              <p className="text-xs text-slate-300">
                {t('solvers.crypto.inverseNote', { a: result.a, inverse: result.aInverse, n: result.n })}
              </p>
              {result.cipherText !== null && (
                <div className="text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 break-all">
                  <div className="text-slate-400">{result.letters}</div>
                  <div className="text-amber-300 font-bold">{result.cipherText}</div>
                </div>
              )}
              {result.oversizedBlock !== null && (
                <p className="text-xs text-amber-400">
                  {t('solvers.crypto.lossyWarning', { block: result.oversizedBlock, n: result.n })}
                </p>
              )}
              <BlockTable result={result} />
            </Panel>
          )}

          {mode === 'exponent' && (
            <Panel tone="amber">
              <PanelHeading Icon={KeyRound} tone="amber">
                {t('solvers.crypto.keys')}
              </PanelHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <MathBox math={`c \\equiv x^{${result.e}} \\pmod{${result.p}}`} />
                <MathBox math={result.keyLatex} />
              </div>
              <BlockTable result={result} cipherModulus={result.p} />
              {result.recovered !== null && (
                <p className="text-xs text-emerald-300 font-mono">
                  <Unlock className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                  {result.recovered}
                </p>
              )}
            </Panel>
          )}

          {mode === 'dh' && (
            <Panel tone={result.agree ? 'emerald' : 'rose'}>
              <PanelHeading Icon={Users} tone="emerald">
                {t('solvers.crypto.dhHeading')}
              </PanelHeading>
              <StepList steps={result.steps} />
              <MathBox math={`K = g^{mn} \\equiv ${result.aliceKey} \\pmod{${result.p}}`} />
              {!result.isPrimitiveRoot && (
                <p className="text-xs text-amber-400">{t('solvers.crypto.dhNotGenerator', { g: result.g, p: result.p })}</p>
              )}
            </Panel>
          )}

          {mode === 'rsa' && (
            <Panel tone="amber">
              <PanelHeading Icon={KeyRound} tone="amber">
                {t('solvers.crypto.rsaHeading')}
              </PanelHeading>
              <StepList steps={result.steps} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Notation only — "public"/"private" prose lives in the step list. */}
                <MathBox math={`(n, e) = (${result.n}, ${result.e})`} />
                <MathBox math={`d = ${result.d}`} />
              </div>
              <BlockTable result={result} cipherModulus={result.n} />
              {result.recovered !== null && (
                <p className="text-xs text-emerald-300 font-mono">
                  <Unlock className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                  {result.recovered}
                </p>
              )}
            </Panel>
          )}

          {mode === 'sharing' && (
            <Panel tone="indigo">
              <PanelHeading Icon={Share2} tone="indigo">
                {t('solvers.crypto.sharingHeading')}
              </PanelHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <MathBox math={result.thresholdLatex} />
                <MathBox math={result.secretLatex} />
              </div>
              <ScrollableTable>
                <thead className="bg-slate-900 text-indigo-300 border-b border-slate-800">
                  <tr>
                    <th scope="col" className="p-2">
                      {t('solvers.crypto.person')}
                    </th>
                    <th scope="col" className="p-2">
                      mᵢ
                    </th>
                    <th scope="col" className="p-2">
                      kᵢ = K₀ mod mᵢ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.keys.map((key, index) => (
                    <tr key={key.m.toString()}>
                      <td className="p-2 text-slate-400">{index + 1}</td>
                      <td className="p-2 text-slate-300">{key.m.toString()}</td>
                      <td className="p-2 text-amber-300 font-bold">{key.key.toString()}</td>
                    </tr>
                  ))}
                </tbody>
              </ScrollableTable>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300">{t('solvers.crypto.reconstruct')}</div>
                {result.reconstructions.map((row) => (
                  <div
                    key={`${row.i}-${row.j}`}
                    className="text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto"
                  >
                    <span className="text-slate-400 mr-2">
                      {row.i} + {row.j}:
                    </span>
                    <MathRender math={row.latex} />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
