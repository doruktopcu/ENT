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

## Tier 2 backlog (not implemented yet)

| Chapter | Planned |
| --- | --- |
| 3 | Positive lattice points on ax + by = c (§3.3); Pythagorean triple generator (§3.4) |
| 6 | Sieve of Eratosthenes (§6.2.2) |
| 8 | Addition, multiplication and power tables of ℤₙ (§8.1–8.2) |
| 12 | Fermat and Mersenne numbers, Lucas–Lehmer (§12.1); Fermat factoring (§12.5.3); Pollard ρ (§12.6.1) |
| 13–14 | Sums of two squares and r₂(n) (§13); four squares, Gaussian norm (§14.1–14.2) |
| 15 | Pell's equation (§15.4–15.6); integer points on Mordell curves (§15.3) |
| 18–19, 23 | σₖ, perfect/abundant/deficient, abundancy index, amicable pairs (§19.4); Dirichlet convolution and Möbius inversion (§23.2–23.4) |
| 20–22 (Tier 3) | Averages of τ and σ, π(x) against Li(x), prime races, twin primes |
