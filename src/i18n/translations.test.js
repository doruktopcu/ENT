/**
 * Structural tests for the translation trees.
 *
 * A missing key falls back to English at runtime and is easy to miss in review,
 * so parity is asserted here instead of being left to manual checking.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { SUPPORTED_LANGUAGES, translations } from './translations.js';
import { TOPICS } from '../config/topics.js';

const collectPaths = (node, prefix = '') => {
  if (typeof node === 'string') return [prefix];
  return Object.entries(node).flatMap(([key, value]) =>
    collectPaths(value, prefix ? `${prefix}.${key}` : key)
  );
};

const placeholdersOf = (value) =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

const read = (tree, path) => path.split('.').reduce((node, key) => node?.[key], tree);

test('every supported language has a translation tree', () => {
  for (const language of SUPPORTED_LANGUAGES) {
    assert.ok(translations[language], `missing tree for "${language}"`);
  }
});

test('all languages expose exactly the same key paths', () => {
  const englishPaths = collectPaths(translations.en).sort();

  for (const language of SUPPORTED_LANGUAGES.filter((code) => code !== 'en')) {
    const paths = collectPaths(translations[language]).sort();

    const missing = englishPaths.filter((path) => !paths.includes(path));
    const extra = paths.filter((path) => !englishPaths.includes(path));

    assert.deepEqual(missing, [], `"${language}" is missing keys`);
    assert.deepEqual(extra, [], `"${language}" has keys English does not`);
  }
});

test('placeholders match across languages', () => {
  for (const path of collectPaths(translations.en)) {
    const expected = placeholdersOf(read(translations.en, path));

    for (const language of SUPPORTED_LANGUAGES.filter((code) => code !== 'en')) {
      assert.deepEqual(placeholdersOf(read(translations[language], path)), expected, `placeholders differ at "${path}"`);
    }
  }
});

test('no translation string is empty', () => {
  for (const language of SUPPORTED_LANGUAGES) {
    for (const path of collectPaths(translations[language])) {
      assert.notEqual(read(translations[language], path).trim(), '', `empty string at ${language}.${path}`);
    }
  }
});

test('every topic has a title, description, and lecture notes in both languages', () => {
  for (const language of SUPPORTED_LANGUAGES) {
    for (const { id } of TOPICS) {
      for (const path of [
        `topics.${id}.title`,
        `topics.${id}.description`,
        `insights.${id}.pedagogy`,
        `insights.${id}.theorem`,
        `insights.${id}.history`,
      ]) {
        assert.equal(typeof read(translations[language], path), 'string', `missing ${language}.${path}`);
      }
    }
  }
});

test('Turkish-only mathematical vocabulary never appears in the English tree', () => {
  // EBOB/EKOK/TKS/IKS are Turkish abbreviations. They belong in the Turkish
  // tree and in the search keyword list, never in English-facing copy.
  const forbidden = ['EBOB', 'EKOK', 'ÇKT', 'TKS', 'İKS', 'Çözücü', 'Hesapla', 'Vikipedi'];

  for (const path of collectPaths(translations.en)) {
    const value = read(translations.en, path);
    for (const term of forbidden) {
      assert.ok(!value.includes(term), `English string "${path}" contains Turkish term "${term}"`);
    }
  }
});

test('the Turkish tree is actually translated, not copied from English', () => {
  // Strings that are pure notation carry no prose to translate. Listing them
  // explicitly keeps the check strict: anything else identical is a real gap.
  const INTENTIONALLY_IDENTICAL = new Set(['solvers.sigmaFormulaNote']);

  const isLatex = (value) => value.includes('\\');

  const identical = collectPaths(translations.en).filter((path) => {
    if (INTENTIONALLY_IDENTICAL.has(path)) return false;

    const en = read(translations.en, path);
    return en === read(translations.tr, path) && !isLatex(en) && en.length > 12;
  });

  assert.deepEqual(identical, [], 'these Turkish strings are still the English text');
});
