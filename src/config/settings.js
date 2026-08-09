// Explicit extension: this module is imported by the Node test runner, whose
// ESM loader does not do Vite-style extension resolution.
import { TOPICS } from './topics.js';

/**
 * User-tunable preferences.
 *
 * Each entry declares its own bounds so the settings UI, the persistence layer
 * and the engine call sites all agree on what a legal value is — validation
 * lives here rather than being re-implemented in the form.
 */
export const DEFAULT_SETTINGS = {
  // Appearance is handled separately (language, theme) because those two need
  // to apply before the rest of the app mounts.

  // Computation
  residuePreviewLimit: 200,
  polynomialScanLimit: 5000,
  factorisationBudget: 2_000_000,

  // Startup
  startupTab: 'solvers',
  startupSolver: 'gcd_lcm',

  // History
  historyLimit: 50,
  autoSaveHistory: false,
};

export const NUMERIC_SETTINGS = {
  residuePreviewLimit: { min: 10, max: 5_000, step: 10 },
  polynomialScanLimit: { min: 100, max: 100_000, step: 100 },
  factorisationBudget: { min: 100_000, max: 20_000_000, step: 100_000 },
  historyLimit: { min: 10, max: 500, step: 10 },
};

export const STARTUP_TABS = ['solvers', 'workbench', 'history', 'wiki'];

/**
 * Returns null for anything that is not a usable number.
 *
 * Empty input is rejected explicitly: a cleared `<input type="number">` reports
 * `''`, and `Number('')` is 0, which would silently clamp the setting to its
 * minimum instead of leaving it alone.
 */
const clampNumber = (value, { min, max }) => {
  if (value === '' || value === null || value === undefined) return null;

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;

  return Math.min(Math.max(Math.round(numeric), min), max);
};

/** Clamp a single numeric setting, falling back when the input is unusable. */
export function clampSetting(key, value, fallback) {
  const bounds = NUMERIC_SETTINGS[key];
  if (!bounds) return value;

  const clamped = clampNumber(value, bounds);
  return clamped === null ? fallback : clamped;
}

/**
 * Coerce anything loaded from storage (or typed into a field) into a valid
 * settings object. Unknown keys are dropped; a bad value keeps whatever
 * `fallback` holds rather than propagating into the engine.
 */
export function normaliseSettings(raw, fallback = DEFAULT_SETTINGS) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const base = { ...DEFAULT_SETTINGS, ...fallback };
  const result = { ...base };

  for (const [key, bounds] of Object.entries(NUMERIC_SETTINGS)) {
    const clamped = clampNumber(source[key], bounds);
    result[key] = clamped === null ? base[key] : clamped;
  }

  if (STARTUP_TABS.includes(source.startupTab)) {
    result.startupTab = source.startupTab;
  }

  if (TOPICS.some((topic) => topic.id === source.startupSolver)) {
    result.startupSolver = source.startupSolver;
  }

  if (typeof source.autoSaveHistory === 'boolean') {
    result.autoSaveHistory = source.autoSaveHistory;
  }

  return result;
}

/** Engine option bags derived from the current settings. */
export function engineOptions(settings) {
  return {
    residue: {
      previewLimit: BigInt(settings.residuePreviewLimit),
      budget: BigInt(settings.factorisationBudget),
    },
    polynomial: { scanLimit: BigInt(settings.polynomialScanLimit) },
    factorisation: { budget: BigInt(settings.factorisationBudget) },
  };
}
