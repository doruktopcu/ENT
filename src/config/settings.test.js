/**
 * Settings validation tests.
 *
 * These values are fed straight into the engine as BigInt bounds, so a bad one
 * does not merely look wrong — it can hang the UI or silently truncate output.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_SETTINGS,
  NUMERIC_SETTINGS,
  STARTUP_TABS,
  clampSetting,
  engineOptions,
  normaliseSettings,
} from './settings.js';
import { TOPICS } from './topics.js';

test('defaults are self-consistent and within their own bounds', () => {
  for (const [key, bounds] of Object.entries(NUMERIC_SETTINGS)) {
    const value = DEFAULT_SETTINGS[key];
    assert.equal(typeof value, 'number', `${key} must have a numeric default`);
    assert.ok(value >= bounds.min && value <= bounds.max, `${key} default is outside its bounds`);
  }

  assert.ok(STARTUP_TABS.includes(DEFAULT_SETTINGS.startupTab));
  assert.ok(TOPICS.some((topic) => topic.id === DEFAULT_SETTINGS.startupSolver));
});

test('normaliseSettings clamps numbers into range', () => {
  const result = normaliseSettings({
    residuePreviewLimit: 999_999,
    polynomialScanLimit: -50,
    historyLimit: 37.6,
  });

  assert.equal(result.residuePreviewLimit, NUMERIC_SETTINGS.residuePreviewLimit.max);
  assert.equal(result.polynomialScanLimit, NUMERIC_SETTINGS.polynomialScanLimit.min);
  assert.equal(result.historyLimit, 38, 'fractional input is rounded');
});

test('unusable values keep the fallback rather than snapping to a bound', () => {
  const current = { ...DEFAULT_SETTINGS, residuePreviewLimit: 350 };

  // A cleared <input type="number"> reports '', and Number('') is 0 — which
  // would clamp to the minimum if it were not rejected explicitly.
  for (const bad of ['', null, undefined, 'abc', NaN, Infinity]) {
    assert.equal(
      normaliseSettings({ ...current, residuePreviewLimit: bad }, current).residuePreviewLimit,
      350,
      `input ${String(bad)} must not change the setting`
    );
    assert.equal(clampSetting('residuePreviewLimit', bad, 350), 350);
  }
});

test('normaliseSettings rejects unknown enum values and keeps the rest', () => {
  const result = normaliseSettings({
    startupTab: 'not-a-tab',
    startupSolver: 'not-a-solver',
    autoSaveHistory: 'yes please',
    somethingElse: 42,
  });

  assert.equal(result.startupTab, DEFAULT_SETTINGS.startupTab);
  assert.equal(result.startupSolver, DEFAULT_SETTINGS.startupSolver);
  assert.equal(result.autoSaveHistory, DEFAULT_SETTINGS.autoSaveHistory);
  assert.equal('somethingElse' in result, false, 'unknown keys must be dropped');
});

test('normaliseSettings accepts every valid enum value', () => {
  for (const tab of STARTUP_TABS) {
    assert.equal(normaliseSettings({ startupTab: tab }).startupTab, tab);
  }
  for (const topic of TOPICS) {
    assert.equal(normaliseSettings({ startupSolver: topic.id }).startupSolver, topic.id);
  }
  assert.equal(normaliseSettings({ autoSaveHistory: true }).autoSaveHistory, true);
});

test('normaliseSettings survives junk from storage', () => {
  for (const junk of [null, undefined, 'a string', 42, []]) {
    assert.deepEqual(normaliseSettings(junk), DEFAULT_SETTINGS, `input ${String(junk)}`);
  }
});

test('engineOptions produces BigInt bounds the engine can use directly', () => {
  const options = engineOptions(DEFAULT_SETTINGS);

  assert.equal(typeof options.residue.previewLimit, 'bigint');
  assert.equal(typeof options.residue.budget, 'bigint');
  assert.equal(typeof options.polynomial.scanLimit, 'bigint');
  assert.equal(typeof options.factorisation.budget, 'bigint');

  assert.equal(options.residue.previewLimit, BigInt(DEFAULT_SETTINGS.residuePreviewLimit));
  assert.equal(options.polynomial.scanLimit, BigInt(DEFAULT_SETTINGS.polynomialScanLimit));
});
