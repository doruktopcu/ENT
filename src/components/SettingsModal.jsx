import React, { useEffect, useRef } from 'react';
import { Globe, Monitor, Moon, Settings, Sun, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'tr', flag: '🇹🇷', label: 'Türkçe' },
];

const THEMES = [
  { id: 'dark', labelKey: 'settings.dark', Icon: Moon },
  { id: 'light', labelKey: 'settings.light', Icon: Sun },
  { id: 'system', labelKey: 'settings.system', Icon: Monitor },
];

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, language, setLanguage, theme, setTheme, resetPreferences, t } =
    useApp();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Escape-to-close and initial focus: the modal previously trapped neither.
  useEffect(() => {
    if (!isSettingsOpen) return undefined;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSettingsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleReset = () => {
    if (window.confirm(t('settings.confirmClearStorage'))) resetPreferences();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsSettingsOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('settings.title')}
        className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setIsSettingsOpen(false)}
          aria-label={t('settings.closeAria')}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Settings className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 serif-font">{t('settings.title')}</h3>
            <p className="text-xs text-slate-400">{t('settings.subtitle')}</p>
          </div>
        </div>

        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Globe className="w-4 h-4 text-amber-400" aria-hidden="true" />
            {t('settings.language')}
          </legend>
          <p className="text-xs text-slate-400">{t('settings.languageHelp')}</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {LANGUAGES.map(({ id, flag, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setLanguage(id)}
                aria-pressed={language === id}
                className={`p-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-between ${
                  language === id
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>
                  {flag} {label}
                </span>
                {language === id && <span aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2 pt-2 border-0 border-t border-slate-800 p-0 m-0">
          <legend className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            {t('settings.theme')}
          </legend>
          <p className="text-xs text-slate-400">{t('settings.themeHelp')}</p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {THEMES.map(({ id, labelKey, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                aria-pressed={theme === id}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-colors flex flex-col items-center gap-1.5 ${
                  theme === id
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>{t(labelKey)}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            {t('settings.clearStorage')}
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors"
          >
            {t('settings.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
