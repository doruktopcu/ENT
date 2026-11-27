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
    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${color}`}>
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
