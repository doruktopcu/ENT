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

const AppContext = createContext(null);

const STORAGE_KEYS = {
  language: 'ent_language',
  theme: 'ent_theme',
  history: 'ent_history',
};

const MAX_HISTORY_ITEMS = 50;

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

  const [activeTab, setActiveTab] = useState('solvers');
  const [selectedTopicId, setSelectedTopicId] = useState('gcd_lcm');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      const saved = safeRead(STORAGE_KEYS.history);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
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
    try {
      safeWrite(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {
      /* A history entry that cannot be serialised is not worth crashing over. */
    }
  }, [history]);

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
      return [entry, ...prev].slice(0, MAX_HISTORY_ITEMS);
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

  const resetPreferences = useCallback(() => {
    setHistory([]);
    setLanguage('en');
    setTheme('system');
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      activeTab,
      setActiveTab,
      selectedTopicId,
      setSelectedTopicId,
      isSettingsOpen,
      setIsSettingsOpen,
      history,
      addHistoryItem,
      clearHistory,
      deleteHistoryItem,
      loadHistoryItemToSolver,
      presetInputs,
      consumePresetInputs,
      resetPreferences,
      t,
    }),
    [
      language,
      theme,
      activeTab,
      selectedTopicId,
      isSettingsOpen,
      history,
      addHistoryItem,
      clearHistory,
      deleteHistoryItem,
      loadHistoryItemToSolver,
      presetInputs,
      consumePresetInputs,
      resetPreferences,
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
