# Elementary Number Theory (ENT) Lab

[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-amber.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![React 18](https://img.shields.io/badge/Framework-React_18-indigo.svg)](https://react.dev/)
[![Multilingual](https://img.shields.io/badge/Language-English_%7C_Türkçe-blue.svg)]()
[![Themes](https://img.shields.io/badge/Theme-Dark_%7C_Light_%7C_System-emerald.svg)]()

A Chrome extension (Manifest V3) for Elementary Number Theory: interactive solvers with
step-by-step derivations, a formula workbench, a searchable theory guide, and a calculation
history — all backed by exact `BigInt` arithmetic and fully localised in English and Turkish.

---

## Features

### Interactive solvers

All arithmetic is arbitrary-precision. Each solver shows its derivation, not just an answer.

| Solver | What it computes |
| --- | --- |
| **Extended GCD & LCM** | `gcd(a, b)`, the Bezout identity `au + bv = d`, `lcm(a, b)`, and the full division chain |
| **Linear Diophantine** | `ax + by = c`: solvability test, a particular solution, the parametric family `x(t), y(t)`, and every solution with x, y > 0 |
| **Linear congruence** | `ax ≡ b (mod m)`: every incongruent solution, the modular inverse, and the reduction steps |
| **Modular polynomial** | Roots of degree 1–5 polynomials `f(x) ≡ b (mod m)`, with an evaluation table, plus Hensel lifting to prime powers and CRT recombination for composite `m` |
| **Euler totient** | `φ(n)`, the complete residue system `ℤₙ`, the reduced residue system `(ℤ/nℤ)ˣ`, and addition / multiplication / power tables for n ≤ 24 |
| **Prime factorisation** | Canonical decomposition, `τ(n)`, `σ(n)`, the Möbius function `μ(n)`, and the divisor list |
| **Chinese Remainder** | Systems `cᵢx ≡ aᵢ (mod mᵢ)`: coefficients are reduced first, coprime moduli use the classical construction, and shared factors are merged pairwise with a compatibility check |
| **Modular exponentiation** | `aᵉ mod m` by square-and-multiply, the order `ordₘ(a)`, and a primitive-root test |
| **Quadratic residues & congruences** | The Legendre symbol via Euler's criterion, the Jacobi symbol, the residue list mod p, every square root of `a` mod `n`, and `ax² + bx + c ≡ 0` by completing the square |
| **Primitive roots & discrete logs** | Existence (`n = 2, 4, pᵏ, 2pᵏ`), the test lemma, every primitive root, a table of indices, and `xᵏ ≡ a` / `bˣ ≡ a` via indices |
| **Cryptography** | Caesar and affine ciphers, the exponent cipher, Diffie–Hellman key exchange, RSA, and two-of-three CRT secret sharing, using the textbook's A = 1 … Z = 26 block encoding |
| **Primality tests** | Wilson's theorem, the Fermat test, Miller's test step by step, strong pseudoprimes with a liar count, and Korselt's criterion for Carmichael numbers |
| **Factoring & special primes** | Fermat factoring, Pollard rho with its rounds, Fermat numbers with Euler-form factors, Lucas–Lehmer for Mersenne primes and the perfect numbers they give |
| **Sums of squares** | Which n are a² + b² (with r₂(n) and the Gaussian factorisation of primes), three- and four-square representations, and every Pythagorean triple up to a bound |
| **Pell's equation & curves** | x² − dy² = 1 from the continued fraction of √d plus composition, the negative Pell equation, and integer points on y² = x³ + k |
| **Arithmetic functions** | σₖ, φ, μ, λ, Λ, ω, Ω, abundancy, perfect / abundant / amicable numbers, aliquot sequences, Thabit's rule, Dirichlet products and Möbius inversion |
| **Distribution of primes** | Sieve of Eratosthenes, π(x) against Li(x) and x/ln x (charted), prime races mod 4 and mod 3, twin primes, average orders of τ, σ, φ, and ζ(s) |

The last eight solvers, and the extensions to the other solvers, follow
Crisman's *Number Theory: In Context and Interactive*. See [Reference textbook](#reference-textbook).

### Beyond the solvers

- **Lecture notes** — intuition, the formal theorem, and historical context for
  every topic, in both languages.
- **Formula workbench** — sweep a range and watch a sequence behave: perfect-square generators,
  a Fermat primality scan that explicitly flags pseudoprimes, and a modular multiplication sweep.
- **Theory guide** — twelve localised entries with LaTeX statements and external references.
- **History** — save a calculation explicitly (or automatically), then reload its parameters back
  into its solver. Export and re-import the log as JSON.
- **Settings page** — language, theme, computation limits, startup defaults, history behaviour and
  stored-data management, all persisted locally.
- **Themes** — dark, light, or follow the system (and it keeps following if you change the OS setting).

### Settings

| Group | What it controls |
| --- | --- |
| **Appearance** | Interface language (English / Türkçe) and theme (dark / light / system) |
| **Computation limits** | Residue preview size, polynomial scan range, and the trial-division budget. The lab computes as you type, so these caps keep a large input from freezing the window |
| **Startup** | Which tab and which solver the lab opens on |
| **History** | How many entries to keep, and whether saving is manual or automatic (debounced, never per keystroke) |
| **Data** | Storage used, entries saved, JSON export/import, and selective reset |

---

## Install

```bash
npm install
npm run build
```

Then open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select
the `dist/` folder. A pre-built `dist/` is committed, so you can skip the build and load it directly.

---

## Development

```bash
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm test` | Run the engine, settings and i18n test suites |
| `npm run lint` | ESLint (React, hooks and jsx-a11y rules) |
| `npm run lint:fix` | ESLint with autofix |
| `npm run icons` | Regenerate `public/icons` at 16/48/128 px |

### Testing

`npm test` runs Node's built-in test runner; `npm run lint` runs ESLint with the React, hooks and
accessibility rule sets. The number-theory tests check results against
brute-force implementations rather than hard-coded constants — `τ`/`σ` against divisor
enumeration, `φ` against counting coprimes, congruences against exhaustive search, the Legendre
symbol against enumerating squares, primality against a sieve. `bookAdditions.test.js` does the
same for the textbook-derived functions (square roots mod n for every n ≤ 250, Hensel lifting,
primitive roots, Miller's test against the textbook strong-probable-prime definition, Korselt
against brute force), and also pins the book's own worked examples, cited by number;
`bookEngineTier2.test.js` covers the later chapters the same way. The i18n tests assert that the
English and Turkish trees have identical key paths and placeholders, that no string is empty,
and that no Turkish-only term (EBOB, EKOK, TKS, İKS) appears in English-facing copy. The settings
tests cover clamping, enum validation and recovery from junk in storage.

### Project layout

```
src/
  utils/numberTheoryEngine.js   Core mathematics. Returns error codes, never prose.
  utils/bookEngineTier2.js      Textbook chapters 3, 6, 8, 12–15, 18–24 (same contract).
  i18n/translations.js          English + Turkish. The single source of UI text.
  config/topics.js              Topic registry and search keywords.
  config/settings.js            Preference defaults, bounds and validation.
  context/AppContext.jsx        Language, theme, settings, history, translations.
  hooks/useSolverState.js       Shared solver input / history plumbing.
  components/SettingsPage.jsx   The settings surface.
  components/                   UI, one component per solver.
docs/BOOK_SOURCES.md            What was taken from the reference textbook, and where.
scripts/generate_icons.js       Renders the extension icons from code.
ent.py                          Standalone Python engine (the original nine solvers).
```

### Localisation

The engine never returns human-readable text. It returns `{ code, vars, latex }`, and the UI
renders `t('engine.' + code, vars)`. Derivation steps work the same way: language-neutral LaTeX
travels with a translation key for the prose around it. When adding a string, add it to **both**
trees in `src/i18n/translations.js` — `npm test` fails on any mismatch.

---

## Python engine (`ent.py`)

The same algorithms without any dependencies, usable from a REPL, a script, or the included
Colab notebook. The original Turkish function names (`ebob`, `ekok`, `ext_ebob`,
`diophantus_solver`, `lineer_kongruens_cozumu`, …) are kept as the public API, with English
aliases alongside. Functions return values instead of printing; `python ent.py` runs a demo.

```python
import ent

ent.ext_ebob(21, -35)              # (7, 2, 1)  ->  21*2 + (-35)*1 == 7
ent.solve_linear_congruence(140, 133, 301)
ent.crt([(2, 3), (3, 5), (2, 7)])  # (23, 105)
ent.is_prime(561)                  # False — Carmichael numbers do not slip through
```

The textbook-derived additions exist only in the JavaScript engine for now.

---

## Reference textbook

The newer solvers follow Karl-Dieter Crisman, *Number Theory: In Context and Interactive*
(2024 edition, free online at <https://math.gordon.edu/ntic/>). Each topic's lecture notes name
the relevant sections and link to the online book.

The book is licensed CC BY-ND 4.0, so the lab copies none of its text, figures or code. It
implements the mathematics in its own words and uses the book's worked examples as test
fixtures. [`docs/BOOK_SOURCES.md`](docs/BOOK_SOURCES.md) lists, for every function, the
sections it draws on, the examples it is tested against, and where it departs from the book.
It also records a small numerical inconsistency found in the book's affine-cipher example.

---

## Privacy & permissions

The extension requests **no permissions**. It makes **no network requests** — KaTeX, its fonts,
and all styles are bundled. Preferences and history stay in the browser's local storage and
never leave the machine.

---

## Technical notes

- **Manifest V3**, React 18, Vite, Tailwind CSS, KaTeX.
- Light and dark themes are driven by CSS custom properties holding raw RGB triplets, which
  Tailwind resolves through `rgb(var(--…) / <alpha-value>)`. Switching themes rewrites the
  palette rather than every class name.
- Trial division and residue enumeration are bounded, so a large input degrades to a clear
  "could not finish" message instead of freezing the popup.

---

## License

MIT.
