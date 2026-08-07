import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Shared plumbing for every solver: input state, "load from history" handling
 * and explicit history recording.
 *
 * Recording is deliberately *not* an effect on the input values. Each solver
 * used to run `addHistoryItem` inside `useEffect(..., [a, b])`, which logged a
 * fresh entry on every keystroke — typing a three-digit number produced three
 * entries, and StrictMode doubled them again.
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
      addHistoryItem(topicId, t(`topics.${topicId}.title`), values, summaryLatex);
      setJustSaved(true);
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setJustSaved(false), 1600);
    },
    [addHistoryItem, t, topicId, values]
  );

  return { values, setValue, setValues, save, justSaved };
}
