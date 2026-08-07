import React, { useMemo, useState } from 'react';
import { CheckCircle, Sliders, Sparkles, Table } from 'lucide-react';
import MathRender from './MathRender';
import { useApp } from '../context/AppContext';
import { fermatTest, isPerfectSquare, parseBigInt } from '../utils/numberTheoryEngine';
import { IntegerField } from './ui/SolverPrimitives';

const RANGE_MIN = 5;
const RANGE_MAX = 500;

const TEMPLATES = [
  {
    id: 'perfect_square',
    labelKey: 'workbench.template1',
    // A JS expression, not a JSX string attribute: `math="p \\cdot i"` passes
    // the backslashes through literally and KaTeX renders `\\` as a line break.
    latex: 'p \\cdot i + 1 = k^2',
    usesSecondParam: false,
  },
  {
    id: 'fermat_test',
    labelKey: 'workbench.template2',
    latex: 'a^{n-1} \\equiv 1 \\pmod{n}',
    usesSecondParam: false,
  },
  {
    id: 'modular_sweep',
    labelKey: 'workbench.template3',
    latex: 'a \\cdot x \\equiv r \\pmod{m}',
    usesSecondParam: true,
  },
];

export default function CustomFormulaWorkbench() {
  const { t } = useApp();
  const [templateId, setTemplateId] = useState('perfect_square');
  const [param1, setParam1] = useState('5');
  const [param2, setParam2] = useState('100');
  const [rangeLimit, setRangeLimit] = useState('50');

  const template = TEMPLATES.find((entry) => entry.id === templateId) ?? TEMPLATES[0];

  const { rows, error } = useMemo(() => {
    const p1 = parseBigInt(param1);
    const p2 = parseBigInt(param2);
    const limitNumber = Number(rangeLimit);

    if (p1 === null || (template.usesSecondParam && p2 === null)) {
      return { rows: [], error: 'invalidParameters' };
    }
    if (!Number.isFinite(limitNumber)) {
      return { rows: [], error: 'invalidParameters' };
    }

    const limit = BigInt(Math.min(Math.max(Math.trunc(limitNumber), 0), RANGE_MAX));
    const results = [];

    if (template.id === 'perfect_square') {
      for (let i = 1n; i <= limit; i += 1n) {
        const value = p1 * i + 1n;
        // Newton's method instead of the old r*r <= value scan, which was
        // O(sqrt(value)) per row and froze the tab for large p.
        const { isSquare, root } = isPerfectSquare(value);
        results.push({
          key: i.toString(),
          input: i.toString(),
          latex: `${p1} \\cdot ${i} + 1 = ${value}`,
          status: isSquare
            ? t('workbench.perfectSquare', { root, value })
            : t('workbench.notPerfectSquare'),
          isMatch: isSquare,
        });
      }
    } else if (template.id === 'fermat_test') {
      for (let n = 3n; n <= limit; n += 2n) {
        const outcome = fermatTest(p1, n);
        if (!outcome.ok) continue;

        const statusKey = {
          probablePrime: 'workbench.fermatProbablePrime',
          pseudoprime: 'workbench.fermatPseudoprime',
          composite: 'workbench.fermatComposite',
          notCoprime: 'workbench.fermatNotCoprime',
        }[outcome.outcome];

        results.push({
          key: n.toString(),
          input: n.toString(),
          latex:
            outcome.residue === null
              ? `\\gcd(${p1}, ${n}) = ${outcome.gcd}`
              : `${p1}^{${n - 1n}} \\equiv ${outcome.residue} \\pmod{${n}}`,
          status: t(statusKey, { a: p1, n, gcd: outcome.gcd }),
          isMatch: outcome.outcome === 'probablePrime' || outcome.outcome === 'pseudoprime',
          isWarning: outcome.outcome === 'pseudoprime',
        });
      }
    } else if (template.id === 'modular_sweep') {
      // p2 was previously fed straight into `% p2`, so clearing the field threw
      // a RangeError ("Division by zero") and blanked the whole tab.
      if (p2 <= 0n) return { rows: [], error: 'modulusMustBePositive' };

      for (let x = 0n; x <= limit; x += 1n) {
        const remainder = ((p1 * x) % p2 + p2) % p2;
        results.push({
          key: x.toString(),
          input: x.toString(),
          latex: `${p1} \\cdot ${x} \\equiv ${remainder} \\pmod{${p2}}`,
          status: t('workbench.remainderIs', { value: remainder }),
          isMatch: remainder === 1n,
        });
      }
    }

    return { rows: results, error: null };
  }, [param1, param2, rangeLimit, template, t]);

  const matchCount = rows.filter((row) => row.isMatch).length;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-amber-200 serif-font">
              {t('workbench.title')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{t('workbench.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 shrink-0">
          <span>{t('workbench.foundMatches')}:</span>
          <span className="font-bold text-emerald-400">
            {matchCount} / {rows.length}
          </span>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" aria-hidden="true" />
          {t('workbench.selectTemplate')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup">
          {TEMPLATES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="radio"
              aria-checked={templateId === entry.id}
              onClick={() => setTemplateId(entry.id)}
              className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                templateId === entry.id
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="font-bold mb-1">{t(entry.labelKey)}</div>
              <MathRender math={entry.latex} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <IntegerField
            label={
              template.id === 'fermat_test'
                ? t('fields.baseA')
                : template.id === 'modular_sweep'
                  ? t('fields.multiplierA')
                  : t('fields.integerN')
            }
            value={param1}
            onChange={setParam1}
            invalid={parseBigInt(param1) === null}
          />

          {/* Only rendered for the template that actually reads it; it used to
              sit there permanently as a dead "Secondary Constant" input. */}
          {template.usesSecondParam ? (
            <IntegerField
              label={t('fields.modulusM')}
              value={param2}
              onChange={setParam2}
              invalid={parseBigInt(param2) === null || parseBigInt(param2) <= 0n}
            />
          ) : (
            <div aria-hidden="true" />
          )}

          <div>
            <label
              htmlFor="workbench-range"
              className="block text-xs font-semibold text-slate-400 mb-1"
            >
              {t('workbench.rangeBounds')}
            </label>
            <input
              id="workbench-range"
              type="number"
              value={rangeLimit}
              onChange={(event) => setRangeLimit(event.target.value)}
              min={RANGE_MIN}
              max={RANGE_MAX}
              className="math-input w-full"
            />
          </div>
        </div>

        {template.id === 'fermat_test' && (
          <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 leading-relaxed">
            {t('workbench.fermatCaveat')}
          </p>
        )}
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Table className="w-4 h-4 text-amber-400" aria-hidden="true" />
          {t('workbench.outputTable')}
        </h4>

        {error ? (
          <p className="text-xs text-rose-300 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl">
            {t(`workbench.${error}`)}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-xs text-slate-400 p-3">{t('workbench.emptyRange')}</p>
        ) : (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs text-left text-slate-300 font-mono">
              <thead className="bg-slate-900 text-amber-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th scope="col" className="p-2.5">
                    {t('workbench.inputColumn')}
                  </th>
                  <th scope="col" className="p-2.5">
                    {t('workbench.evaluatedExpr')}
                  </th>
                  <th scope="col" className="p-2.5">
                    {t('workbench.status')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className={
                      row.isWarning
                        ? 'bg-rose-500/15'
                        : row.isMatch
                          ? 'bg-amber-500/15'
                          : 'hover:bg-slate-800/40'
                    }
                  >
                    <td className="p-2.5 text-slate-400">{row.input}</td>
                    <td className="p-2.5 text-slate-200 font-sans">
                      <MathRender math={row.latex} />
                    </td>
                    <td className="p-2.5 font-sans font-semibold">
                      {row.isMatch ? (
                        <span
                          className={`flex items-center gap-1 ${
                            row.isWarning ? 'text-rose-300' : 'text-amber-300'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {row.status}
                        </span>
                      ) : (
                        <span className="text-slate-500">{row.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
