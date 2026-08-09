import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

/** How long inputs must stay still before an automatic save is recorded. */
const AUTO_SAVE_DELAY_MS = 900;

/**
 * Shared plumbing for every solver: input state and "load from history".
 *
 * Recording is never a bare effect on the raw inputs. The original code ran
 * `addHistoryItem` inside `useEffect(..., [a, b])`, so typing a three-digit
 * number logged three entries and StrictMode doubled them.
 */
export function useSolverState(topicId, defaults) {
  const { addHistoryItem, consumePresetInputs, presetInputs, t } = useApp();
  const [values, setValues] = useState(defaults);
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef(null);

  useEffect(() => {
    const preset = consumePresetInputs(topicId);
    if (!preset) return;

    setValues((current) => {
      const next = { ...current };
      for (const key of Object.keys(current)) {
        if (preset[key] !== undefined) {
          next[key] = Array.isArray(preset[key]) ? preset[key] : String(preset[key]);
        }
      }
      return next;
    });
  }, [consumePresetInputs, presetInputs, topicId]);

  useEffect(() => () => clearTimeout(savedTimer.current), []);

  const setValue = useCallback((key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const save = useCallback(
    (summaryLatex) => {
      if (!summaryLatex) return;

      addHistoryItem(topicId, t(`topics.${topicId}.title`), values, summaryLatex);
      setJustSaved(true);
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setJustSaved(false), 1600);
    },
    [addHistoryItem, t, topicId, values]
  );

  return { values, setValue, setValues, save, justSaved };
}

/**
 * Opt-in automatic history recording, enabled from Settings.
 *
 * Deliberately a separate hook: the summary is derived from the values that
 * `useSolverState` returns, so it cannot be passed in on the same call.
 *
 * The debounce is the whole point — recording on each render would recreate
 * exactly the keystroke-spam bug that manual saving was introduced to fix.
 * `addHistoryItem` additionally collapses an entry identical to the newest one,
 * so an unchanged calculation refreshes in place rather than piling up.
 */
export function useAutoSaveHistory(topicId, values, summary) {
  const { addHistoryItem, settings, t } = useApp();
  const enabled = settings.autoSaveHistory;

  // Held in a ref so the timer restarts only when the *result* changes, not on
  // every unrelated re-render of the solver.
  const recordRef = useRef(null);
  recordRef.current = () => {
    addHistoryItem(topicId, t(`topics.${topicId}.title`), values, summary);
  };

  useEffect(() => {
    if (!enabled || !summary) return undefined;

    const timer = setTimeout(() => recordRef.current(), AUTO_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [enabled, summary]);
}
