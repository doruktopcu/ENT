import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Calculator, Clock, History, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MathRender from './MathRender';

/** Render an input value compactly, including the CRT's array of congruences. */
function formatInputValue(value) {
  if (Array.isArray(value)) {
    return value.map((row) => `${row.a} (mod ${row.m})`).join('; ');
  }
  return String(value);
}

export default function HistoryTab() {
  const { history, clearHistory, deleteHistoryItem, loadHistoryItemToSolver, t } = useApp();
  const [query, setQuery] = useState('');

  const filteredHistory = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return history;

    return history.filter((item) =>
      [item.title, item.summaryResult, JSON.stringify(item.inputs)]
        .join(' ')
        .toLocaleLowerCase()
        .includes(needle)
    );
  }, [history, query]);

  const handleClearAll = () => {
    // Clearing was destructive and immediate, with no way back.
    if (window.confirm(t('history.confirmClear'))) clearHistory();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-amber-200 serif-font">{t('history.title')}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{t('history.subtitle')}</p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            {t('history.clearAll')}
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('history.searchPlaceholder')}
            aria-label={t('history.searchPlaceholder')}
            className="math-input w-full pl-9"
          />
        </div>
      )}

      {filteredHistory.length > 0 ? (
        <ul className="space-y-3 list-none">
          {filteredHistory.map((item) => (
            <li
              key={item.id}
              className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                    {item.date} {item.timestamp}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-amber-300 overflow-x-auto">
                  <MathRender math={item.summaryResult} />
                </div>

                <div className="text-[11px] text-slate-400 flex flex-wrap gap-2 font-mono">
                  <span className="text-slate-500">{t('history.inputs')}:</span>
                  {Object.entries(item.inputs).map(([key, value]) => (
                    <span key={key} className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">
                      {key}={formatInputValue(value)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => loadHistoryItemToSolver(item)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {t('history.loadProblem')}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteHistoryItem(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  aria-label={t('history.delete')}
                  title={t('history.delete')}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" aria-hidden="true" />
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0 ? t('history.empty') : t('history.noMatches', { query })}
          </p>
        </div>
      )}
    </div>
  );
}
