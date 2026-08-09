import React, { useId, useRef, useState } from 'react';
import {
  Cpu,
  Database,
  Download,
  Globe,
  History as HistoryIcon,
  Monitor,
  Moon,
  RotateCcw,
  Settings as SettingsIcon,
  Sun,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NUMERIC_SETTINGS, STARTUP_TABS, clampSetting } from '../config/settings';
import { TOPICS } from '../config/topics';

const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'tr', flag: '🇹🇷', label: 'Türkçe' },
];

const THEMES = [
  { id: 'dark', labelKey: 'settings.dark', Icon: Moon },
  { id: 'light', labelKey: 'settings.light', Icon: Sun },
  { id: 'system', labelKey: 'settings.system', Icon: Monitor },
];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** A titled block with an icon, used for each settings group. */
function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4 pt-1">{children}</div>
    </section>
  );
}

/** Label + control + hint, laid out consistently. */
function Row({ label, hint, htmlFor, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center gap-2">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-200">
          {label}
        </label>
        {hint && <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div className="sm:justify-self-end">{children}</div>
    </div>
  );
}

/** Numeric setting with its own draft state so a half-typed value is allowed. */
function NumberSetting({ settingKey, label, hint }) {
  const { settings, updateSetting } = useApp();
  const bounds = NUMERIC_SETTINGS[settingKey];
  const id = useId();
  const [draft, setDraft] = useState(String(settings[settingKey]));

  // Re-sync when the value changes elsewhere (restore defaults, reset).
  const [lastSeen, setLastSeen] = useState(settings[settingKey]);
  if (lastSeen !== settings[settingKey]) {
    setLastSeen(settings[settingKey]);
    setDraft(String(settings[settingKey]));
  }

  // Clamp here as well as in the reducer so the field always snaps to the
  // value that was actually stored — including when the stored value does not
  // change (an out-of-range or empty entry), which would leave the draft
  // showing something that was never applied.
  const commit = () => {
    const next = clampSetting(settingKey, draft, settings[settingKey]);
    setDraft(String(next));
    updateSetting(settingKey, next);
  };

  return (
    <Row label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
        }}
        className="math-input w-full sm:w-40 text-right"
      />
    </Row>
  );
}

function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.id)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isActive
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {option.Icon && <option.Icon className="w-3.5 h-3.5" aria-hidden="true" />}
            {option.label}
            {isActive && <span aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage() {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    settings,
    updateSetting,
    resetSettings,
    resetEverything,
    history,
    clearHistory,
    exportHistory,
    importHistory,
    storageUsage,
    t,
  } = useApp();

  const fileInputRef = useRef(null);
  const [notice, setNotice] = useState(null);

  const announce = (tone, message) => setNotice({ tone, message });

  const handleExport = () => {
    const blob = new Blob([exportHistory()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ent-lab-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoking immediately can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('ok', t('settings.exportDone', { count: history.length }));
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    // Allow re-picking the same file straight away.
    event.target.value = '';
    if (!file) return;

    const result = importHistory(await file.text());
    if (result.ok) {
      announce('ok', t('settings.importDone', { added: result.added, total: result.imported }));
    } else {
      announce('error', t(`settings.${result.code}`));
    }
  };

  const handleClearHistory = () => {
    if (!window.confirm(t('history.confirmClear'))) return;
    clearHistory();
    announce('ok', t('settings.historyCleared'));
  };

  const handleResetEverything = () => {
    if (!window.confirm(t('settings.confirmResetEverything'))) return;
    resetEverything();
    announce('ok', t('settings.resetDone'));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-amber-400" aria-hidden="true" />
          <h2 className="text-base font-bold text-amber-200 serif-font">{t('settings.title')}</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">{t('settings.subtitle')}</p>
      </div>

      {notice && (
        <p
          role="status"
          className={`text-xs p-3 rounded-xl border ${
            notice.tone === 'ok'
              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
              : 'text-rose-300 bg-rose-500/10 border-rose-500/30'
          }`}
        >
          {notice.message}
        </p>
      )}

      <Section
        icon={Globe}
        title={t('settings.appearance')}
        description={t('settings.appearanceHelp')}
      >
        <Row label={t('settings.language')} hint={t('settings.languageHelp')}>
          <SegmentedControl
            ariaLabel={t('settings.language')}
            value={language}
            onChange={setLanguage}
            options={LANGUAGES.map((item) => ({
              id: item.id,
              label: `${item.flag} ${item.label}`,
            }))}
          />
        </Row>

        <Row label={t('settings.theme')} hint={t('settings.themeHelp')}>
          <SegmentedControl
            ariaLabel={t('settings.theme')}
            value={theme}
            onChange={setTheme}
            options={THEMES.map((item) => ({
              id: item.id,
              label: t(item.labelKey),
              Icon: item.Icon,
            }))}
          />
        </Row>
      </Section>

      <Section
        icon={Cpu}
        title={t('settings.computation')}
        description={t('settings.computationHelp')}
      >
        <NumberSetting
          settingKey="residuePreviewLimit"
          label={t('settings.residuePreviewLimit')}
          hint={t('settings.residuePreviewLimitHelp')}
        />
        <NumberSetting
          settingKey="polynomialScanLimit"
          label={t('settings.polynomialScanLimit')}
          hint={t('settings.polynomialScanLimitHelp')}
        />
        <NumberSetting
          settingKey="factorisationBudget"
          label={t('settings.factorisationBudget')}
          hint={t('settings.factorisationBudgetHelp')}
        />
      </Section>

      <Section
        icon={SettingsIcon}
        title={t('settings.startup')}
        description={t('settings.startupHelp')}
      >
        <Row label={t('settings.startupTab')} htmlFor="startup-tab">
          <select
            id="startup-tab"
            value={settings.startupTab}
            onChange={(event) => updateSetting('startupTab', event.target.value)}
            className="math-input w-full sm:w-56"
          >
            {STARTUP_TABS.map((tab) => (
              <option key={tab} value={tab}>
                {t(`tabs.${tab}`)}
              </option>
            ))}
          </select>
        </Row>

        <Row label={t('settings.startupSolver')} htmlFor="startup-solver">
          <select
            id="startup-solver"
            value={settings.startupSolver}
            onChange={(event) => updateSetting('startupSolver', event.target.value)}
            className="math-input w-full sm:w-56"
          >
            {TOPICS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {t(`topics.${topic.id}.title`)}
              </option>
            ))}
          </select>
        </Row>
      </Section>

      <Section
        icon={HistoryIcon}
        title={t('settings.historySection')}
        description={t('settings.historySectionHelp')}
      >
        <NumberSetting
          settingKey="historyLimit"
          label={t('settings.historyLimit')}
          hint={t('settings.historyLimitHelp')}
        />

        <Row label={t('settings.saveMode')} hint={t('settings.saveModeHelp')}>
          <SegmentedControl
            ariaLabel={t('settings.saveMode')}
            value={settings.autoSaveHistory ? 'auto' : 'manual'}
            onChange={(mode) => updateSetting('autoSaveHistory', mode === 'auto')}
            options={[
              { id: 'manual', label: t('settings.saveManual') },
              { id: 'auto', label: t('settings.saveAuto') },
            ]}
          />
        </Row>
      </Section>

      <Section icon={Database} title={t('settings.data')} description={t('settings.dataHelp')}>
        <dl className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
            <dt className="text-slate-400">{t('settings.storageUsed')}</dt>
            <dd className="text-slate-100 font-mono font-bold mt-1">{formatBytes(storageUsage)}</dd>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
            <dt className="text-slate-400">{t('settings.entriesSaved')}</dt>
            <dd className="text-slate-100 font-mono font-bold mt-1">{history.length}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={history.length === 0}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            {t('settings.exportHistory')}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            {t('settings.importHistory')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />

          <button
            type="button"
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
          >
            {t('history.clearAll')}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetSettings}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            {t('settings.restoreDefaults')}
          </button>

          <button
            type="button"
            onClick={handleResetEverything}
            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
          >
            {t('settings.resetEverything')}
          </button>
        </div>
      </Section>
    </div>
  );
}
