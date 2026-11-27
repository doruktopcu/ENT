# Book sources: *Number Theory: In Context and Interactive*

This file records what the lab took from

> Karl-Dieter Crisman, **Number Theory: In Context and Interactive**, 2024/6 edition,
> Gordon College. Free online at <https://math.gordon.edu/ntic/>.

It lists, function by function, which sections the mathematics comes from, which of the
book's worked examples are used as test fixtures, and where the implementation departs from
the text. Section, theorem and example numbers are the book's own. Page numbers are the
printed page numbers. In the one-sided PDF (`nticoneside.pdf`), PDF page = printed page + 23.

## Licence and how the book is used

The book's text is licensed **CC BY-NoDerivatives 4.0**, and some images are under
non-commercial licences. So the lab:

- **does not copy** prose, figures or Sage code from the book. Every UI string, lecture note
  and code comment is written in our own words.
- **uses the mathematics**: definitions, theorems and algorithms. Ideas and procedures are not
  covered by copyright, and every one is cited below.
- **reuses worked examples as numbers only**. The inputs and expected outputs of the book's
  examples become regression tests (`src/utils/bookAdditions.test.js`), so the lab provably
  agrees with what a student reads. Each result was recomputed independently.
- **credits the book in the UI**. Each topic in `src/config/topics.js` has a `book` field,
  shown in the lecture notes as "Textbook: Crisman, … §x.y" with a link to the online edition.

The book itself is not bundled with the extension.

---

## Tier 1 additions

### Chapter 5 — Linear congruences

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `solveCRT` (coefficients) | §5.5.2, Example 5.5.1 (p. 68) | Solve each Aᵢx ≡ Bᵢ (mod Nᵢ) on its own, then apply the CRT | Fixture: 2x≡2 (5), 5x≡4 (6), 3x≡2 (7) ⇒ x ≡ 206 (mod 210) |
| `solveCRT` (shared moduli) | §5.5.1 (pp. 66–67), Exercise 5.6.24 | A solution exists iff gcd(nᵢ, nⱼ) ∣ aᵢ − aⱼ (Qin; rediscovered by Lebesgue, 1859); solutions agree modulo a smaller number (the lcm) | The book states the condition but gives no procedure. The pairwise merge algorithm is standard, not from the book |

### Chapter 7 — General congruences

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `henselLift` | Theorem 7.2.3 Hensel's Lemma (p. 90), Remark 7.2.7 (p. 92) | Lift condition f(xₑ₋₁)/pᵉ⁻¹ + k·f′(xₑ₋₁) ≡ 0 (mod p); degenerate case p ∣ f′: every k works iff pᵉ ∣ f(xₑ₋₁), otherwise none | Fixtures: Examples 7.2.5–7.2.6 (p. 91), x²+1 ≡ 0 mod 5, 25, 125 ⇒ {2,3}, {7,18}, {57,68} |
| `solvePolynomialByPrimePowers` | Fact 7.2.2 (p. 89), Example 7.2.1, Algorithm 16.1.5 (pp. 275–276) | Solve modulo each prime power, combine by CRT; the counts multiply | Also checks the 4·2·2 = 16 roots of x² ≡ 1 (mod 120) from the §7.3 discussion |
| `wilsonTest` | Theorem 7.5.1 Wilson (p. 95); proof pairing (p. 96); Exercise 7.7.7 (converse) | (p − 1)! ≡ −1 (mod p); the a ↔ a⁻¹ pairing shown for small primes | Fixture: p = 11 pairs (2,6), (3,4), (5,9), (7,8), as in the proof |

### Chapter 10 — Primitive roots

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `primitiveRootExistence` | Fact 10.3.1, Proposition 10.3.2 (p. 142); §10.7 (p. 152) | No primitive root for n = 8, 12 or 2ᵏ (k ≥ 3); full list n = 2, 4, pᵏ, 2pᵏ | The book quotes the full characterisation without proof (§10.7); we only classify |
| `primitiveRootTest` | Lemma 10.2.3 (p. 140); Example 10.2.6 | a is primitive iff a^(φ(n)/q) ≢ 1 for every prime q ∣ φ(n) | Fixture: 3 and 14 are primitive roots of 17 |
| `primitiveRoots` | Definition 10.1.1, Fact 10.3.6 (p. 143), Exercise 10.6.9 | There are φ(φ(n)) primitive roots when one exists | Listing them as gᵏ with gcd(k, φ(n)) = 1 is standard. Tests cross-check against brute force for n ≤ 200 |
| `indexTable` | §10.5.1 (p. 148) | The classic printed "table of indices" | — |
| `solvePowerCongruence` | §10.5.1, Examples 10.5.1–10.5.3 (pp. 148–150) | xᵏ ≡ a ⇒ x = gⁱ, k·i ≡ ind(a) (mod φ(n)) | Fixtures: x³≡5 (17) ⇒ 11; x⁴≡5 (17) none; x³≡7 (19) ⇒ {4,6,9}; x⁶≡8 (49) ⇒ {6,10,16,33,39,43} |
| `solveExponentialCongruence` | §10.5.2, Examples 10.5.4 and 10.5.6 (pp. 150–151) | bˣ ≡ a ⇒ ind(b)·x ≡ ind(a) (mod φ(n)); answers given mod φ(n) as in the book | Fixtures: 5ˣ≡17 (19) ⇒ x ∈ {4, 13} (mod 18); 16ˣ≡13 (19) none |
| `discreteIndex` | Index idea from §10.5 | — | **Baby-step giant-step is not from the book**, which uses tables or trial and error. It is capped at φ(n) ≤ 10¹⁰ |

### Chapter 11 — Cryptography

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `encodeMessage`, `decodeNumber` | §11.1.1 (pp. 156–157) | A–Z ↦ 1–26; a k-letter block read in base 26 with the first letter as the units digit | Fixtures: "q" ↦ 17; the pair encoding of "thebestdayofthisyear" ⇒ 228, 57, 499, 124, 651, 171, 228, 503, 155, 469 |
| `affineCipher` | §11.2.1 Caesar (pp. 158–159); §11.2.3, Fact 11.2.2 (pp. 159–160) | m ≡ ax + b (mod n), decrypt with a′(m − b), gcd(a, n) = 1 | Caesar fixture "MathIsCool" ⇒ "PDWKLVFRRO". **Deviation:** residue 0 is shown as n (so W + 3 ⇒ Z); the book's decoder returns an empty string for 0. **Discrepancy in the book:** for key (5, 18, 709) the book prints ciphertext [213, 481, 502, 629, 299]. Recomputing from that key and the book's own encoding [39, 228, 503, 393, 327] gives [213, 449, 406, 565, 235]. The test therefore checks the first block, the inverse 142 and the round trip |
| `exponentCipher` | Algorithm 11.3.3 (p. 164) | c ≡ xᵉ (mod p), gcd(e, p − 1) = 1, f ≡ e⁻¹ (mod p − 1) | The book calls this "Diffie–Hellman encryption". The UI calls it the exponent cipher; it is also known as the Pohlig–Hellman cipher |
| `diffieHellman` | Algorithm 11.4.2, Example 11.4.3 (p. 167) | Publish p, g; secrets m, n; shared key g^(mn) | Fixture: p = 991, g = 55, m = 130, n = 123. The "g is not a primitive root" warning is ours |
| `rsaCipher` | §11.5.2, Example 11.5.4 (p. 170), Algorithm 11.5.5 (p. 171) | n = pq, φ = (p−1)(q−1), d ≡ e⁻¹ (mod φ) | Fixture: p = 89, q = 97, e = 71 ⇒ n = 8633, φ = 8448, d = 119 |
| `secretSharing` | Algorithm 11.7.1, Example 11.7.2 (pp. 179–180) | Two-of-three CRT threshold scheme, K₀ = K + tp, keys K₀ mod mᵢ | Fixture: K = 5, p = 13, moduli 17, 19, 16, t = 12 ⇒ K₀ = 161, keys 8, 9, 1. **Deviation:** the algorithm asks for m₁ < m₂ < m₃, yet the example lists 17, 19, 16. We sort the moduli so m₁m₂ is the smallest pairwise product; the example still passes (16·17 = 272 > 13·19 = 247). K is recovered as K₀ mod p, so t need not be known |

### Chapter 12 — Primality

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `fermatTest` *(existing)* | Definitions 12.2.3, 12.2.5 (pp. 190–191) | Cross-reference only | The book's base-a test is aⁿ ≡ a; ours is aⁿ⁻¹ ≡ 1, which is equivalent when gcd(a, n) = 1 |
| `korseltTest` | Proposition 12.2.10 Korselt (p. 193), Definition 12.2.9, Fact 12.2.8 | Squarefree and p − 1 ∣ n − 1 for all p ∣ n | Fixtures: 561 (Fact 12.2.8) and 29341 (Example 12.2.11) are Carmichael. Cross-checked by brute force for n ≤ 3000 |
| `millerTest` | Theorem 12.3.2, Algorithm 12.3.3 (p. 195), Definition 12.4.1 (p. 196) | The book's top-down order: start at a^((n−1)/2), stop at −1 or at anything other than ±1, halve while +1 | Fixtures from Example 12.3.4: 1387 fails at once, 2047 is a strong pseudoprime, 1009 is "continue, then pass". Checked against the usual strong-probable-prime test for every odd n < 700 and every base |
| `countStrongLiars` | Theorem 12.4.6 (p. 197), Algorithm 12.4.7 | At most (n − 1)/4 bases fool Miller's test | The bound is checked for every odd composite below 1500 |
| `isPrime` witness fix | — | — | **Not from the book.** Adding 41 to the witness list makes the deterministic range n < 3.3·10²⁴ (Sorenson & Webster, 2015), which the old comment already claimed |

### Chapter 16 — Quadratic congruences

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `squareRootsMod` | Facts 16.1.1–16.1.2, Example 16.1.4, Algorithm 16.1.5 (pp. 274–276) | Solve modulo prime powers, then combine with the CRT | **Tonelli–Shanks (roots mod p) is not from the book**, which searches. **Lifting modulo 2ᵉ is not from the book**, which defers it to Exercise 16.8.17. Fixture: x² ≡ −1 (mod 14) has no solution |
| `solveQuadraticCongruence` | Algorithm 16.2.4, Fact 16.2.5 (p. 277); the §16.2 example (p. 276) | Multiply by 4a, (2ax + b)² ≡ b² − 4ac, x ≡ (2a)⁻¹(s − b) | Fixture: x² − 2x + 3 ≡ 0 (mod 9) ⇒ {5, 6}. When gcd(2a, n) ≠ 1 the bounded scan is our own fallback |
| `quadraticResidueList` | Definition 16.3.1 (p. 278), Sage note 16.3.3 | Non-zero residues of an odd prime | Fixture: residues of 17 = {1, 2, 4, 8, 9, 13, 15, 16} |

### Lecture notes and history lines

The new lecture-note prose is our own. These historical facts are taken from the book's
remarks:

- Ibn al-Haytham stated Wilson's theorem in the eleventh century (Remark 7.5.2, p. 96).
- Carmichael numbers are named for Robert Carmichael's examples (Definition 12.2.9).
- There was a GCHQ precedent for public-key cryptography (Historical remark 11.4.1, p. 167).

Other dates come from general knowledge, not the book: Lagrange 1771, Korselt 1899,
Miller 1976, Rabin 1980, RSA 1977, and Cocks 1973/1997.

---

## Topics cross-referenced but not derived from the book

The pre-existing solvers (gcd, Diophantine, linear congruences, φ, factorisation,
modular powers, Legendre/Jacobi) were written before the book was consulted. Their `book`
field in `topics.js` points readers to the matching sections; nothing was changed to follow
the book's presentation.

## Tier 2 additions (`src/utils/bookEngineTier2.js`)

### Chapters 3, 6 and 8

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `positiveLatticePoints` | §3.3 (pp. 26–30), Definition 3.3.3 | Positivity of x(t), y(t) cuts t to an interval; count integers in it with floor/ceiling | Brute-force check over a, b ≤ 10, c ≤ 80 |
| `pythagoreanFromPQ`, `pythagoreanTriples` | Theorem 3.4.6, Algorithm 3.4.7 (p. 33), Proposition 3.4.9 (area) | x = q² − p², y = 2pq, z = p² + q² with p < q coprime, opposite parity; multiples give the rest | Fixtures from the book's list: (3, 4, 5), (5, 12, 13). Count cross-checked by brute force to z ≤ 150 |
| `sieveOfEratosthenes` | Algorithm 6.2.3, Example 6.2.4 (p. 76) | Cross out multiples of primes p ≤ √n | Fixture: 25 primes ≤ 100, sieving by 2, 3, 5, 7 |
| `groupTables` | §8.1–8.2 (pp. 107–112) | Addition, multiplication and power tables of ℤₙ ("visualization"), units and orders | The book shows colour plots; we show tables with units highlighted |

### Chapter 12 — special primes and factoring

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `fermatNumber` | Definition 12.1.1 (p. 185), §11.5.1 (Euler's 641 · 6700417) | Fₖ = 2^(2ᵏ) + 1; F₅ is composite | **Searching only factors j·2^(k+2) + 1 is not from the book** (classical Euler–Lucas result) |
| `lucasLehmer` | Algorithm 12.1.9, Example 12.1.10 (p. 188); Example 12.1.3; Theorem 19.4.2 | x₀ = 4, xᵢ₊₁ = xᵢ² − 2 mod Mₚ; composite p ⇒ composite Mₚ; perfect number 2^(p−1)Mₚ | Fixture: p = 5 ⇒ 14, 8, 0. Mersenne exponents ≤ 127 checked |
| `fermatFactor` | Algorithm 12.5.9, Example 12.5.10 (pp. 202–203) | Start at ⌈√n⌉, find s² − n = t² | Fixtures: 143 = 13·11 on the first try; 93 = 31·3 at s = 17 |
| `pollardRho` | Algorithms 12.6.1, 12.6.3; Example 12.6.4 (pp. 204–207) | f(x) = x² + 1, seed 2, compare x₂ₖ with xₖ (Floyd) | Fixture: n = 9991, sequence 2, 5, 26, 677, 8735, 8950, differences 21, 8709, 3977 ⇒ factor 97. **Book typo:** it factors 3672 where the difference is −3762 |

### Chapters 13–14 — sums of squares

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `sumOfTwoSquares` | Fact 13.1.1, Theorem 13.5.5, Example 13.5.6 (pp. 214–233), Exercise 13.7.7 (r₂); Example 14.1.1, Definition 14.1.2 (Gaussian integers) | Criterion on primes ≡ 3 (mod 4); count r₂(n) = 4∏(e + 1) over p ≡ 1 (mod 4); p = (a + bi)(a − bi) | The r₂ product formula is the standard closed form of the book's exercise. Brute-force check for n ≤ 600. Fixtures: 21 not representable; 13 = (3 + 2i)(3 − 2i) |
| `sumsOfSquares` | Facts 14.2.1 (three squares), 14.2.2 (Lagrange) (p. 241) | 4ᵃ(8b + 7) obstruction; four squares always | The depth-first search for a representation is ours. Checked for every n ≤ 2000 |

### Chapter 15 — points on curves

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `pellEquation` | Proposition 15.6.1, Fact 15.6.2, Example 15.6.3, Fact 15.6.4 (pp. 266–269) | New solutions from (x₀ + y₀√d)ᵏ — the doubling/adding of points | Fixture: d = 2 ⇒ (3, 2), (17, 12), (99, 70). **The continued-fraction search for the fundamental solution is not from the book**, nor is the odd-period test for x² − dy² = −1 |
| `mordellPoints` | §15.3, Facts 15.3.3 and 15.3.5 (pp. 255–257) | y² = x³ + k; Bachet's y² = x³ − 2 has only (3, ±5); x³ = y² − 7 has no solution | Bounded search only; it proves nothing beyond the bound (the UI says so) |

### Chapters 18–19 and 23 — arithmetic functions

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `arithmeticProfile` | Definition 19.1.1 (σₖ), Theorem 19.2.5, Definitions 19.4.1, 19.4.4, 19.4.5, 19.4.7, 19.4.11; Definitions 23.3.3–23.3.4 (ω, Ω, λ) | σₖ by the prime-power formula; perfect / abundant / deficient / k-perfect; abundancy index; amicable pairs; aliquot sequence | Fixtures: 28 and 8128 perfect; 12 abundant with index 7/3; 220 ↔ 284; 120 is 3-perfect. Λ (von Mangoldt) is from §21.4 |
| `thabitRule` | Algorithm 19.4.14, Historical remark 19.4.13 (p. 337) | pₙ = 3·2ⁿ − 1, qₙ = 9·2²ⁿ⁻¹ − 1 | Fixtures: (220, 284), (17296, 18416), (9363584, 9437056) |
| `dirichletProduct`, `mobiusInversion` | Definition 19.2.9 (u, N), Definition 23.2.3, Fact 23.3.2, Theorem 23.2.1, Facts 23.4.8–23.4.9 | f ⋆ g and the identities u⋆u = τ, u⋆N = σ, μ⋆u = I, φ⋆u = N, μ⋆N = φ; inversion f = g⋆u ⇔ g = f⋆μ | Recognises the result among nine named functions |

## Tier 3 additions (analytic, floating point)

| Function | Book source | What was taken | Notes / deviations |
| --- | --- | --- | --- |
| `primeCounting`, `offsetLogIntegral` | Definition 21.0.1, Definitions 21.2.1–21.2.2 (Li), Theorem 21.3.1 (PNT) | π(x) against x/ln x and Li(x) = ∫₂ˣ dt/ln t | **Ramanujan's series for li is not from the book.** Fixture: π(10⁶) = 78498 |
| `primeRace` | §22.1, Fact 22.1.3, Fact 22.1.6 (pp. 388–390) | Race between 1 and 3 (mod 4) (and mod 3); lead changes | The 1-team first leads at 26861 (standard value, checked) |
| `twinPrimes` | Definition 22.3.4, §22.3.2 heuristics | Count pairs p, p + 2 | Uses the Hardy–Littlewood constant C₂ ≈ 0.6601 for the estimate (heuristic). Fixture: 35 pairs below 1000 |
| `averageOrders` | §20.1 (lattice points in a circle → π), §20.2–20.3 (average of τ ≈ ln x + 2γ − 1), §20.4 (σ ≈ π²x/12), §24.6.4 (φ ≈ 3x/π²) | The four averages and their predictions | Divisor-sum sieve is ours |
| `zetaApproximations` | §24.2 (ζ), §24.3.2 (Euler product) | Partial sum vs Euler product vs π²/6, π⁴/90, … | Tail bound N^(1−s)/(s − 1) is the standard integral test |

Chapter 25 (the Riemann explicit formula) is not implemented: it needs complex zeros of ζ,
which is beyond an exact, offline arithmetic engine.

## Not taken

The book's Sage code, interact cells, figures and exercises are not reproduced.
