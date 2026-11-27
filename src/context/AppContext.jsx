import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SUPPORTED_LANGUAGES, translations } from '../i18n/translations';
import { DEFAULT_SETTINGS, engineOptions, normaliseSettings } from '../config/settings';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  language: 'ent_language',
  theme: 'ent_theme',
  history: 'ent_history',
  settings: 'ent_settings',
};

/** localStorage throws in some embedded contexts; never let that break the app. */
const safeRead = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWrite = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Storage is full or blocked — preferences simply will not persist. */
  }
};

const safeRemove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* Nothing to do. */
  }
};

const readJson = (key, fallback) => {
  try {
    const raw = safeRead(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/** Walk a dotted path through a translation tree. Returns undefined if absent. */
const lookup = (tree, keys) => {
  let current = tree;
  for (const key of keys) {
    if (current === null || typeof current !== 'object' || !(key in current)) return undefined;
    current = current[key];
  }
  return current;
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = safeRead(STORAGE_KEYS.language);
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : 'en';
  });

  const [theme, setTheme] = useState(() => {
    const saved = safeRead(STORAGE_KEYS.theme);
    return ['dark', 'light', 'system'].includes(saved) ? saved : 'system';
  });

  const [settings, setSettings] = useState(() =>
    normaliseSettings(readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS))
  );

  // Startup preferences only seed the initial state; changing them later must
  // not yank the user out of whatever they are currently doing.
  const [activeTab, setActiveTab] = useState(() => settings.startupTab);
  const [selectedTopicId, setSelectedTopicId] = useState(() => settings.startupSolver);

  const [history, setHistory] = useState(() => {
    const parsed = readJson(STORAGE_KEYS.history, []);
    return Array.isArray(parsed) ? parsed : [];
  });

  // Scoped to a topic so loading a GCD problem cannot bleed into another solver.
  const [presetInputs, setPresetInputs] = useState(null);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.language, language);
    document.documentElement.lang = language;
  }, [language]);

  // Apply the theme, and keep following the OS while "system" is selected.
  useEffect(() => {
    safeWrite(STORAGE_KEYS.theme, theme);

    const query = window.matchMedia('(prefers-color-scheme: dark)');

    let frame;

    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && query.matches);
      const root = document.documentElement;

      // Chrome will not restart a transition when the colour behind a `var()`
      // changes via a class swap, which leaves transitioned elements painting
      // the previous palette. Suppressing transitions for a frame around the
      // swap sidesteps that entirely. See the `.theme-switching` rule in
      // index.css.
      root.classList.add('theme-switching');
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);

      // A timer, not requestAnimationFrame: rAF is paused while the page is
      // hidden, which would leave transitions suppressed indefinitely.
      clearTimeout(frame);
      frame = setTimeout(() => root.classList.remove('theme-switching'), 60);
    };

    apply();

    if (theme !== 'system') {
      return () => clearTimeout(frame);
    }

    // The old implementation read the media query once, so choosing "System"
    // and then flipping the OS theme left the UI stuck on the stale palette.
    query.addEventListener('change', apply);
    return () => {
      clearTimeout(frame);
      query.removeEventListener('change', apply);
    };
  }, [theme]);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    try {
      safeWrite(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {
      /* A history entry that cannot be serialised is not worth crashing over. */
    }
  }, [history]);

  // Lowering the cap should take effect immediately, not at the next save.
  useEffect(() => {
    setHistory((prev) => (prev.length > settings.historyLimit ? prev.slice(0, settings.historyLimit) : prev));
  }, [settings.historyLimit]);

  /**
   * Translate `path`, filling `{name}` placeholders from `vars`.
   * Falls back to English, then to the path itself so a missing key is visible
   * during development rather than rendering as an empty string.
   */
  const t = useCallback(
    (path, vars) => {
      const keys = String(path).split('.');
      const value = lookup(translations[language], keys) ?? lookup(translations.en, keys);

      if (typeof value !== 'string') return typeof value === 'undefined' ? path : value;
      if (!vars) return value;

      return value.replace(/\{(\w+)\}/g, (match, name) =>
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
      );
    },
    [language]
  );

  const historyLimitRef = useRef(settings.historyLimit);
  historyLimitRef.current = settings.historyLimit;

  /**
   * Append a calculation to the log.
   *
   * Solvers used to call this from an effect keyed on their raw inputs, so
   * typing "140" logged three separate entries (and StrictMode doubled them).
   * Recording is now explicit, and an entry identical to the newest one is
   * refreshed in place instead of duplicated.
   */
  const addHistoryItem = useCallback((topicId, title, inputs, summaryResult) => {
    const now = new Date();
    const entry = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      date: now.toLocaleDateString(),
      topicId,
      title,
      inputs,
      summaryResult,
    };

    const signature = JSON.stringify({ topicId, inputs });

    setHistory((prev) => {
      const previousSignature =
        prev.length > 0 ? JSON.stringify({ topicId: prev[0].topicId, inputs: prev[0].inputs }) : null;

      if (previousSignature === signature) return [entry, ...prev.slice(1)];
      return [entry, ...prev].slice(0, historyLimitRef.current);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const deleteHistoryItem = useCallback(
    (id) => setHistory((prev) => prev.filter((item) => item.id !== id)),
    []
  );

  const loadHistoryItemToSolver = useCallback((item) => {
    setSelectedTopicId(item.topicId);
    // Structured clone keeps the solver from mutating the stored entry.
    setPresetInputs({ topicId: item.topicId, inputs: JSON.parse(JSON.stringify(item.inputs)) });
    setActiveTab('solvers');
  }, []);

  // A ref keeps `consumePresetInputs` stable so solvers can depend on it safely.
  const presetRef = useRef(presetInputs);
  presetRef.current = presetInputs;

  const consumePresetInputs = useCallback((topicId) => {
    const pending = presetRef.current;
    if (!pending || pending.topicId !== topicId) return null;
    setPresetInputs(null);
    return pending.inputs;
  }, []);

  const updateSetting = useCallback((key, value) => {
    // `prev` is the fallback, so an unusable value keeps the current setting
    // instead of snapping back to the factory default.
    setSettings((prev) => normaliseSettings({ ...prev, [key]: value }, prev));
  }, []);

  const resetSettings = useCallback(() => setSettings({ ...DEFAULT_SETTINGS }), []);

  const resetEverything = useCallback(() => {
    setHistory([]);
    setSettings({ ...DEFAULT_SETTINGS });
    setLanguage('en');
    setTheme('system');
    safeRemove(STORAGE_KEYS.history);
    safeRemove(STORAGE_KEYS.settings);
  }, []);

  /** Serialise history for download. */
  const exportHistory = useCallback(
    () =>
      JSON.stringify(
        { format: 'ent-lab-history', version: 1, exportedAt: new Date().toISOString(), history },
        null,
        2
      ),
    [history]
  );

  /**
   * Merge an exported file back in. Returns a result object rather than
   * throwing so the settings page can show a precise message.
   */
  const importHistory = useCallback((rawJson) => {
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return { ok: false, code: 'importInvalidJson' };
    }

    const incoming = Array.isArray(parsed) ? parsed : parsed?.history;
    if (!Array.isArray(incoming)) return { ok: false, code: 'importUnrecognised' };

    const valid = incoming.filter(
      (item) =>
        item &&
        typeof item.topicId === 'string' &&
        typeof item.summaryResult === 'string' &&
        item.inputs &&
        typeof item.inputs === 'object'
    );

    if (valid.length === 0) return { ok: false, code: 'importNoEntries' };

    let added = 0;
    setHistory((prev) => {
      const seen = new Set(prev.map((item) => item.id));
      const fresh = valid
        .map((item) => ({
          ...item,
          id: seen.has(item.id) ? `${item.id}-${Math.random().toString(36).slice(2, 8)}` : item.id,
        }))
        .filter((item) => !seen.has(item.id));

      added = fresh.length;
      return [...fresh, ...prev].slice(0, historyLimitRef.current);
    });

    return { ok: true, imported: valid.length, added };
  }, []);

  /**
   * Approximate bytes this extension occupies in localStorage.
   *
   * Measured from state rather than by reading storage back: the values below
   * are exactly what the persistence effects write, and deriving it this way
   * keeps the dependency list honest instead of decorative.
   */
  const storageUsage = useMemo(() => {
    const written = [
      [STORAGE_KEYS.language, language],
      [STORAGE_KEYS.theme, theme],
      [STORAGE_KEYS.settings, JSON.stringify(settings)],
      [STORAGE_KEYS.history, JSON.stringify(history)],
    ];

    // UTF-16 code units, so two bytes each.
    return written.reduce((total, [key, value]) => total + key.length + (value?.length ?? 0), 0) * 2;
  }, [language, theme, settings, history]);

  const options = useMemo(() => engineOptions(settings), [settings]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      settings,
      updateSetting,
      resetSettings,
      resetEverything,
      engine: options,
      activeTab,
      setActiveTab,
      selectedTopicId,
      setSelectedTopicId,
      history,
      addHistoryItem,
      clearHistory,
      deleteHistoryItem,
      loadHistoryItemToSolver,
      exportHistory,
      importHistory,
      storageUsage,
      presetInputs,
      consumePresetInputs,
      t,
    }),
    [
      language,
      theme,
      settings,
      updateSetting,
      resetSettings,
      resetEverything,
      options,
      activeTab,
      selectedTopicId,
      history,
      addHistoryItem,
      clearHistory,
      deleteHistoryItem,
      loadHistoryItemToSolver,
      exportHistory,
      importHistory,
      storageUsage,
      presetInputs,
      consumePresetInputs,
      t,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an <AppProvider>.');
  }
  return context;
}
