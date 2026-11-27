# Chrome Web Store submission — Number Theory Lab 1.1.0

Everything the Developer Dashboard asks for, ready to paste. Upload package:
`release/number-theory-lab-1.1.0.zip`, built with `npm run package`.

## Package

| Item | Value |
| --- | --- |
| Manifest | V3, version `1.1.0` |
| Permissions | **None** (no `permissions`, `host_permissions` or content scripts) |
| Remote code | None — React, KaTeX, fonts and styles are bundled |
| Network requests | None. The only URLs are reference links the user clicks (Wikipedia, MathWorld, the free online textbook) |
| Icons | 16, 48, 128 px in `icons/` |

## Store listing

**Name:** Number Theory Lab

**Summary** (manifest description, ≤ 132 characters):
> Number theory solvers with step-by-step derivations: gcd to CRT, primitive roots, RSA, primality tests, sums of squares and π(x).

**Category:** Education · **Language:** English (Turkish included in the UI)

**Detailed description (English):**

> Number Theory Lab is an offline workbench for elementary number theory. Each of its 17 solvers shows the full derivation, not just the answer, and uses exact big-integer arithmetic.
>
> • Divisibility: extended Euclid, Bezout, linear Diophantine equations with positive solutions
> • Congruences: linear congruences, the Chinese Remainder Theorem (also with shared moduli), polynomial roots with Hensel lifting
> • Groups mod n: Euler φ, ℤₙ tables, orders, primitive roots, indices and discrete logarithms
> • Quadratic residues: Legendre and Jacobi symbols, square roots mod n, completing the square
> • Cryptography: Caesar and affine ciphers, the exponent cipher, Diffie–Hellman, RSA and secret sharing
> • Primes: Wilson, Fermat and Miller tests, Carmichael numbers, Fermat factoring, Pollard rho, Mersenne primes
> • Sums of squares, Pythagorean triples, Pell's equation and Mordell curves
> • Arithmetic functions: σ, μ, perfect and amicable numbers, Dirichlet products and Möbius inversion
> • Distribution of primes: the sieve, π(x) against Li(x), prime races, twin primes and ζ(s)
>
> The lecture notes give intuition, the formal theorem and historical context for each topic. Each topic also points to the matching sections of Karl-Dieter Crisman's free textbook "Number Theory: In Context and Interactive". You can save calculations to a local history, export the history, and switch between dark, light and system themes. The whole interface is available in English and Turkish.
>
> No account, no permissions, no tracking. Nothing leaves your browser.

**Detailed description (Turkish, optional second listing language):**

> Number Theory Lab, temel sayılar teorisi için çevrimdışı bir çalışma ortamıdır. 17 çözücünün her biri yalnızca sonucu değil, tam çıkarımı gösterir ve kesin büyük tam sayı aritmetiği kullanır: Öklid ve Bezout, Çin Kalan Teoremi, Hensel yükseltmesi, ilkel kökler ve ayrık logaritmalar, karesel kalanlar, RSA ve Diffie–Hellman, asallık testleri ve çarpanlama, kareler toplamı, Pell denklemi, aritmetik fonksiyonlar, π(x) ve ζ(s). Hesap yoktur, izin istemez, hiçbir veri tarayıcınızdan çıkmaz.

## Privacy practices tab

| Question | Answer |
| --- | --- |
| Single purpose | "An educational calculator that solves and explains elementary number theory problems." |
| Permission justifications | Not applicable — the extension requests no permissions |
| Remote code | "No, I am not using remote code" |
| Data collected | None of the listed categories. Language, theme, settings and the optional history are kept in the browser's `localStorage` and never sent anywhere |
| Certifications | Tick all three: no selling of user data, no use for unrelated purposes, no use for creditworthiness |
| Privacy policy URL | Not required when no user data is collected. If the form insists, host the "Privacy & permissions" section of the README (e.g. the GitHub README URL) |

## Graphics you still need to provide

The dashboard requires images that cannot be generated from the code:

- **At least one screenshot**, 1280 × 800 or 640 × 400, PNG or JPEG. Suggested shots: the CRT solver with merge steps, the π(x) vs Li(x) chart, the RSA walkthrough, and the Turkish UI.
- **Small promo tile**, 440 × 280 (optional but recommended).
- The 128 px store icon is `public/icons/icon128.png`.

## Licence notes for reviewers

- Extension code: MIT.
- Crisman's textbook (CC BY-ND 4.0) is **not** bundled; no text from it is reproduced. It is credited and linked; see `docs/BOOK_SOURCES.md`.
- KaTeX fonts are MIT/OFL, bundled under `assets/`.

## Release checklist

1. `npm run package`: tests, lint and build all pass, and it writes `release/number-theory-lab-<version>.zip`.
2. In the Developer Dashboard, open the existing item → **Package → Upload new package**.
3. Update the description from this file, add screenshots, and confirm the privacy answers.
4. **Submit for review.**
