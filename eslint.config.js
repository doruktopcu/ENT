import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Flat config (ESLint 9).
 *
 * The a11y plugin is deliberately part of the default run rather than an
 * optional extra: this is an educational tool whose entire output is text and
 * mathematics, so label and landmark mistakes matter more than usual.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      // BigInt literals (1n) need 2020 or later.
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        chrome: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // This codebase does not use PropTypes; the components are internal and
      // small enough that runtime prop checking would be noise.
      'react/prop-types': 'off',

      // Catch the class of bug that bit this project: an unused variable left
      // behind by a refactor, or a caught error that is silently swallowed.
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'warn',

      // `t` is stable per language but comes from context; the hooks plugin
      // cannot know that, so exhaustive-deps stays on as an error to force an
      // explicit decision at each call site.
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  {
    // Build tooling and the icon generator run in Node, not the browser.
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
