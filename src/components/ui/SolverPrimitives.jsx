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
