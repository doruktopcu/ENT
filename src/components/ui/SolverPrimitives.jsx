import React, { useId } from 'react';
import { AlertTriangle, Calculator, Check, Info, Save } from 'lucide-react';
import MathRender from '../MathRender';
import { useApp } from '../../context/AppContext';

/** Labelled integer input. Uses inputMode so mobile keyboards show digits. */
export function IntegerField({ label, value, onChange, placeholder, invalid = false, className = '' }) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        value={value}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
        className="math-input w-full"
        placeholder={placeholder}
      />
    </div>
  );
}

/** Card header shared by every solver, with the topic title and a badge. */
export function SolverHeader({ titleKey, badge }) {
  const { t } = useApp();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
        <Calculator className="w-4 h-4 text-amber-400" aria-hidden="true" />
        {t(titleKey)}
      </h3>
      {badge && (
        <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-mono">
          {badge}
        </span>
      )}
    </div>
  );
}

/** "Save to history" button with transient confirmation. */
export function SaveToHistoryButton({ onSave, justSaved, disabled = false }) {
  const { t } = useApp();

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={disabled}
      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
    >
      {justSaved ? (
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
      ) : (
        <Save className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      {justSaved ? t('solvers.saved') : t('solvers.saveToHistory')}
    </button>
  );
}

/**
 * Renders an engine failure. The engine returns `{ code, vars, latex }` rather
 * than prose so the message can be shown in the active language.
 */
export function EngineMessage({ code, vars, latex, title, tone = 'error' }) {
  const { t } = useApp();
  if (!code) return null;

  // Not every engine message is a failure: "0x + 0y = 0 holds for every pair"
  // is a valid answer and must not be dressed up as an error.
  const isInfo = tone === 'info';
  const Icon = isInfo ? Info : AlertTriangle;

  return (
    <div
      role="status"
      className={`glass-panel p-5 rounded-2xl flex items-start gap-3 ${
        isInfo
          ? 'border border-indigo-500/30 bg-indigo-500/5 text-indigo-300'
          : 'border border-rose-500/30 bg-rose-500/5 text-rose-300'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1.5 min-w-0">
        {title && <div className="font-bold text-sm">{title}</div>}
        <p className="text-xs leading-relaxed">{t(`engine.${code}`, vars)}</p>
        {latex && (
          <div className="pt-1 text-slate-300">
            <MathRender math={latex} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Scroll container so a wide derivation never widens the popup itself. */
export function ScrollableTable({ children, maxHeightClass = '' }) {
  return (
    <div className={`overflow-x-auto ${maxHeightClass}`}>
      <table className="w-full text-xs text-left text-slate-300 font-mono">{children}</table>
    </div>
  );
}

/** Free-text input (cipher messages), styled like IntegerField. */
export function TextField({ label, value, onChange, placeholder, invalid = false, className = '' }) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={value}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
        className="math-input w-full"
        placeholder={placeholder}
      />
    </div>
  );
}

/**
 * Segmented control for solvers with several modes. Buttons with
 * aria-pressed rather than a full tablist: the panels below are not separate
 * tab panels, only different inputs feeding one result area.
 */
export function ModeTabs({ modes, value, onChange, label }) {
  const { t } = useApp();

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {modes.map((mode) => {
        const active = mode.id === value;
        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(mode.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              active
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t(mode.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

/** Numbered derivation: each step is a translated sentence plus optional LaTeX. */
export function StepList({ steps, titleKey = 'solvers.stepByStep' }) {
  const { t } = useApp();
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t(titleKey)}</h4>
      <ol className="space-y-2 text-xs text-slate-300 list-none">
        {steps.map((step, index) => (
          // Steps are positional and never reordered.
          <li key={index} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">{index + 1}.</span>
              <span>{step.key ? t(`steps.${step.key}`, step.vars) : null}</span>
            </div>
            {step.latex && (
              <div className="pl-5 overflow-x-auto">
                <MathRender math={step.latex} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A row of residues as chips, e.g. the roots of a congruence. */
export function ResidueChips({ values, tone = 'emerald' }) {
  const palette =
    tone === 'rose'
      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
      : tone === 'indigo'
        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';

  return (
    <ul className="flex flex-wrap gap-1.5 list-none">
      {values.map((value) => (
        <li key={value.toString()} className={`px-2 py-1 rounded-md border text-xs font-mono font-bold ${palette}`}>
          {value.toString()}
        </li>
      ))}
    </ul>
  );
}

/** Outer card used for result blocks. */
export function Panel({ children, tone = 'slate', className = '' }) {
  const palette = {
    slate: 'border-slate-800',
    amber: 'border-amber-500/30 bg-amber-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    indigo: 'border-indigo-500/30 bg-indigo-500/5',
    rose: 'border-rose-500/30 bg-rose-500/5',
  }[tone];

  return <div className={`glass-panel p-5 rounded-2xl border space-y-3 ${palette} ${className}`}>{children}</div>;
}

/** Small uppercase heading used inside panels. */
export function PanelHeading({ children, Icon, tone = 'slate' }) {
  const color = {
    slate: 'text-slate-300',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    indigo: 'text-indigo-400',
    rose: 'text-rose-400',
  }[tone];

  return (
    // No `uppercase`: headings carry notation (σ(n), ℤₙ, Fₖ) that case-mapping corrupts.
    <h4 className={`text-sm font-bold flex items-center gap-1.5 ${color}`}>
      {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
      {children}
    </h4>
  );
}

/** Centered display-math box. */
export function MathBox({ math }) {
  return (
    <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
      <MathRender math={math} block />
    </div>
  );
}

/**
 * Minimal multi-series line chart (inline SVG, no dependency). Series are
 * labelled directly at their right-hand end as well as in the legend, so the
 * reader never has to match colours to a key.
 */
const SERIES_COLORS = ['#f59e0b', '#818cf8', '#34d399', '#f472b6'];

export function LineChart({ series, height = 180, yLabel, xLabel, zeroLine = false }) {
  const width = 560;
  const pad = { left: 52, right: 70, top: 12, bottom: 28 };
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return null;

  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys, zeroLine ? 0 : Infinity);
  const yMax = Math.max(...ys, zeroLine ? 0 : -Infinity);
  const sx = (x) => pad.left + ((x - xMin) / (xMax - xMin || 1)) * (width - pad.left - pad.right);
  const sy = (y) => pad.top + (1 - (y - yMin) / (yMax - yMin || 1)) * (height - pad.top - pad.bottom);
  const fmt = (v) =>
    Math.abs(v) >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : Math.abs(v) >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : `${Math.round(v * 100) / 100}`;
  const ticks = [0, 0.5, 1];

  return (
    <figure className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label={yLabel}>
        {ticks.map((f) => {
          const y = yMin + f * (yMax - yMin);
          return (
            <g key={f}>
              <line x1={pad.left} x2={width - pad.right} y1={sy(y)} y2={sy(y)} stroke="currentColor" className="text-slate-800" strokeWidth="1" />
              <text x={pad.left - 6} y={sy(y) + 3} textAnchor="end" className="fill-slate-500" fontSize="10">
                {fmt(y)}
              </text>
            </g>
          );
        })}
        {zeroLine && yMin < 0 && yMax > 0 && (
          <line x1={pad.left} x2={width - pad.right} y1={sy(0)} y2={sy(0)} stroke="currentColor" className="text-slate-500" strokeDasharray="3 3" />
        )}
        {[xMin, xMax].map((x) => (
          <text key={x} x={sx(x)} y={height - 8} textAnchor="middle" className="fill-slate-500" fontSize="10">
            {fmt(x)}
          </text>
        ))}
        {xLabel && (
          <text x={(pad.left + width - pad.right) / 2} y={height - 8} textAnchor="middle" className="fill-slate-500" fontSize="10">
            {xLabel}
          </text>
        )}
        {(() => {
          // End labels: push apart vertically when series finish close together.
          const labelY = series
            .map((s, i) => ({ i, y: sy(s.points[s.points.length - 1].y) + 3 }))
            .sort((a, b) => a.y - b.y);
          for (let j = 1; j < labelY.length; j += 1) {
            labelY[j].y = Math.max(labelY[j].y, labelY[j - 1].y + 11);
          }
          const yFor = Object.fromEntries(labelY.map(({ i, y }) => [i, y]));

          return series.map((s, i) => {
            const color = s.color ?? SERIES_COLORS[i % SERIES_COLORS.length];
            const d = s.points.map((p, j) => `${j === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');
            const last = s.points[s.points.length - 1];
            return (
              <g key={s.label}>
                <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                <text x={sx(last.x) + 6} y={yFor[i]} fill={color} fontSize="10" fontWeight="600">
                  {s.label}
                </text>
              </g>
            );
          });
        })()}
      </svg>
      <figcaption className="flex flex-wrap gap-3 text-[11px] text-slate-400">
        {series.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block" style={{ background: s.color ?? SERIES_COLORS[i % SERIES_COLORS.length] }} />
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/** Two-column key/value list for quick numeric summaries. */
export function FactList({ items }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
      {items.map(({ label, value }) => (
        <div key={label} className="flex justify-between gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
          <dt className="text-slate-400">{label}</dt>
          <dd className="font-mono text-amber-300 text-right break-all">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
