import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Calculator, History, Search, Settings, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'solvers', labelKey: 'tabs.solvers', Icon: Calculator },
  { id: 'workbench', labelKey: 'tabs.workbench', Icon: Sparkles },
  { id: 'history', labelKey: 'tabs.history', Icon: History },
  { id: 'wiki', labelKey: 'tabs.wiki', Icon: BookOpen },
];

export default function SearchHeader({ topics, onSelectTopic }) {
  const { activeTab, setActiveTab, t } = useApp();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // The dropdown previously had no dismiss path other than picking a result.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredTopics = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];

    return topics.filter((topic) => {
      const haystack = [
        t(`topics.${topic.id}.title`),
        t(`topics.${topic.id}.description`),
        ...topic.keywords,
      ]
        .join(' ')
        .toLocaleLowerCase();

      return haystack.includes(needle);
    });
  }, [query, topics, t]);

  const showNoResults = query.trim().length > 0 && filteredTopics.length === 0;

  return (
    <div className="relative z-30 mb-6" ref={containerRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="math-input w-full pl-10 pr-10 py-2.5 text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                aria-label={t('clearSearch')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {isOpen && (filteredTopics.length > 0 || showNoResults) && (
            <div className="absolute left-0 right-0 top-full mt-2 glass-panel border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto z-50">
              {showNoResults ? (
                <p className="p-4 text-xs text-slate-400">{t('noSearchResults', { query })}</p>
              ) : (
                <>
                  <div className="p-2 text-xs font-semibold text-amber-400 uppercase tracking-wider border-b border-slate-800">
                    {t('matchingTopics')} ({filteredTopics.length})
                  </div>
                  {filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        onSelectTopic(topic);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-amber-500/10 border-b border-slate-800/60 last:border-0 transition-colors flex items-start justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-200 group-hover:text-amber-300 flex items-center gap-2">
                          <Calculator className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                          {t(`topics.${topic.id}.title`)}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t(`topics.${topic.id}.description`)}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <nav
          aria-label={t('nav.sections')}
          className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-xl shrink-0"
        >
          {TABS.map(({ id, labelKey, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t(labelKey)}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            className={`p-1.5 rounded-lg transition-colors ml-1 ${
              activeTab === 'settings'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-300 border border-transparent'
            }`}
            aria-label={t('tabs.settings')}
            title={t('tabs.settings')}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}
