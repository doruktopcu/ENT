/**
 * Tests for the functions added from Crisman, "Number Theory: In Context and
 * Interactive" (see docs/BOOK_SOURCES.md).
 *
 * Two kinds of check, as in numberTheoryEngine.test.js:
 *  - brute-force cross-checks over small ranges, which catch algebra mistakes;
 *  - the book's own worked examples (cited by number), which pin the
 *    conventions — encoding, the order of Miller's test, and so on — to the
 *    text students will be reading.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  affineCipher,
  countStrongLiars,
  decodeNumber,
  diffieHellman,
  discreteIndex,
  encodeMessage,
  exponentCipher,
  henselLift,
  isPrime,
  korseltTest,
  millerTest,
  primitiveRootExistence,
  primitiveRoots,
  primitiveRootTest,
  quadraticResidueList,
  rsaCipher,
  secretSharing,
  solveCRT,
  solveExponentialCongruence,
  solvePolynomialByPrimePowers,
  solvePowerCongruence,
  solveQuadraticCongruence,
  squareRootsMod,
  wilsonTest,
} from './numberTheoryEngine.js';

const naiveGcd = (a, b) => {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) [x, y] = [y, x % y];
  return x;
};
const mod = (a, m) => ((a % m) + m) % m;
const powMod = (b, e, m) => {
  let r = 1n % m;
  for (let i = 0n; i < e; i += 1n) r = (r * b) % m;
  return r;
};
const range = (lo, hi) => {
  const out = [];
  for (let i = lo; i <= hi; i += 1n) out.push(i);
  return out;
};
const sieve = (limit) => {
  const flags = new Array(limit + 1).fill(true);
  flags[0] = flags[1] = false;
  for (let i = 2; i * i <= limit; i += 1) if (flags[i]) for (let j = i * i; j <= limit; j += i) flags[j] = false;
  return flags;
};

/* --------------------------- §5.5 general CRT --------------------------- */

test('solveCRT handles shared moduli exactly when gcd(mᵢ, mⱼ) | aⱼ − aᵢ (§5.5.1)', () => {
  for (const m1 of [4n, 6n, 9n, 10n]) {
    for (const m2 of [6n, 8n, 12n, 15n]) {
      for (let a1 = 0n; a1 < m1; a1 += 1n) {
        for (let a2 = 0n; a2 < m2; a2 += 1n) {
          const result = solveCRT([
            { a: a1, m: m1 },
            { a: a2, m: m2 },
          ]);

          const brute = range(0n, m1 * m2 - 1n).filter((x) => x % m1 === a1 && x % m2 === a2);
          assert.equal(result.hasSolution, brute.length > 0, `x≡${a1} (${m1}), x≡${a2} (${m2})`);
          if (!result.hasSolution) continue;

          const lcm = (m1 * m2) / naiveGcd(m1, m2);
          assert.equal(result.M, lcm, 'solutions are unique modulo the lcm');
          assert.equal(result.x, brute[0] % lcm);
        }
      }
    }
  }
});

test('solveCRT reduces rows with coefficients first — Example 5.5.1', () => {
  const r = solveCRT([
    { c: 2, a: 2, m: 5 },
    { c: 5, a: 4, m: 6 },
    { c: 3, a: 2, m: 7 },
  ]);
  assert.ok(r.hasSolution);
  assert.equal(r.x, 206n);
  assert.equal(r.M, 210n);
  assert.equal(r.reductions.length, 3);

  assert.equal(solveCRT([{ c: 2, a: 1, m: 4 }]).code, 'crtRowUnsolvable');
  // Rows saved before coefficients existed still load.
  assert.equal(solveCRT([{ a: 2, m: 3 }, { a: 3, m: 5 }]).x, 8n);
});

/* --------------------------- §7.2 Hensel + CRT --------------------------- */

const POLYNOMIALS = [
  [1n, 0n, 1n], // x² + 1
  [-1n, 0n, 1n], // x² − 1
  [0n, 0n, 1n], // x²
  [1n, 2n, 0n, 1n], // x³ + 2x + 1
  [-2n, 0n, 0n, 1n], // x³ − 2
  [3n, -1n, 0n, 0n, 1n], // x⁴ − x + 3
  [0n, 0n, 0n, 0n, 0n, 1n], // x⁵
];

test('henselLift matches brute force on prime powers, including p | f′(r)', () => {
  for (const coeffs of POLYNOMIALS) {
    for (const [p, e] of [
      [2n, 5n],
      [3n, 4n],
      [5n, 3n],
      [7n, 2n],
    ]) {
      const modulus = p ** e;
      const brute = range(0n, modulus - 1n).filter(
        (x) => mod(coeffs.reduce((acc, c, i) => acc + c * x ** BigInt(i), 0n), modulus) === 0n
      );
      const lifted = henselLift(coeffs, 0n, p, e);
      assert.ok(lifted.ok, `lift ${coeffs} mod ${p}^${e}`);
      assert.deepEqual(lifted.roots, brute, `roots of ${coeffs} mod ${p}^${e}`);
    }
  }
});

test('henselLift reproduces Examples 7.2.5 and 7.2.6 (x² + 1 mod 5, 25, 125)', () => {
  const r = henselLift([1n, 0n, 1n], 0n, 5n, 3n);
  assert.deepEqual(
    r.levels.map((level) => level.roots),
    [
      [2n, 3n],
      [7n, 18n],
      [57n, 68n],
    ]
  );
});

test('solvePolynomialByPrimePowers agrees with a full scan and multiplies counts (Fact 7.2.2)', () => {
  for (const coeffs of POLYNOMIALS) {
    for (let m = 2n; m <= 180n; m += 1n) {
      const brute = range(0n, m - 1n).filter(
        (x) => mod(coeffs.reduce((acc, c, i) => acc + c * x ** BigInt(i), 0n), m) === 0n
      );
      const r = solvePolynomialByPrimePowers(coeffs, 0n, m);
      assert.ok(r.ok);
      assert.equal(r.count, BigInt(brute.length), `count for ${coeffs} mod ${m}`);
      assert.deepEqual(r.roots, brute, `roots for ${coeffs} mod ${m}`);
    }
  }
  // Fact 7.3.1-style blow-up: x² ≡ 1 (mod 8·3·5) has 4·2·2 = 16 solutions.
  assert.equal(solvePolynomialByPrimePowers([-1n, 0n, 1n], 0n, 120n).count, 16n);
});

/* ------------------------------ §7.5 Wilson ------------------------------ */

test('wilsonTest gives −1 exactly for primes (Theorem 7.5.1)', () => {
  const primes = sieve(400);
  for (let n = 2; n <= 400; n += 1) {
    const r = wilsonTest(n);
    assert.equal(r.isMinusOne, primes[n], `(n−1)! mod ${n}`);
  }
  // The pairing in the proof, for p = 11.
  assert.deepEqual(wilsonTest(11).pairs, [
    [2n, 6n],
    [3n, 4n],
    [5n, 9n],
    [7n, 8n],
  ]);
  assert.equal(wilsonTest(4).residue, 2n);
  assert.equal(wilsonTest(300_000).code, 'wilsonTooLarge');
});

/* -------------------- §12.2–12.4 pseudoprimes & Miller -------------------- */

const strongProbablePrime = (a, n) => {
  let d = n - 1n;
  let s = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1n;
  }
  let x = powMod(a, d, n);
  if (x === 1n || x === n - 1n) return true;
  for (let r = 1n; r < s; r += 1n) {
    x = (x * x) % n;
    if (x === n - 1n) return true;
  }
  return false;
};

test("millerTest's top-down order agrees with the textbook strong-probable-prime test", () => {
  for (let n = 5n; n < 700n; n += 2n) {
    for (let a = 2n; a < n - 1n; a += 1n) {
      assert.equal(millerTest(a, n).passes, strongProbablePrime(a, n), `base ${a}, n = ${n}`);
    }
  }
});

test('millerTest reproduces Example 12.3.4 (1387, 2047, 1009)', () => {
  const r1387 = millerTest(2, 1387);
  assert.equal(r1387.passes, false, '1387 is a base-2 pseudoprime that fails Miller');
  assert.equal(r1387.steps.length, 1);

  const r2047 = millerTest(2, 2047);
  assert.equal(r2047.outcome, 'strongPseudoprime', '2047 = 23 · 89 passes base 2');

  const r1009 = millerTest(2, 1009);
  assert.deepEqual(
    r1009.steps.map((step) => step.verdict),
    ['continue', 'pass']
  );
  assert.equal(r1009.outcome, 'probablePrime');

  assert.equal(millerTest(1, 15).code, 'millerTrivialBase');
  assert.equal(millerTest(2, 16).code, 'millerRequiresOdd');
});

test('countStrongLiars never exceeds (n − 1)/4 for odd composites (Theorem 12.4.6)', () => {
  for (let n = 9n; n < 1500n; n += 2n) {
    if (isPrime(n)) continue;
    const r = countStrongLiars(n);
    assert.ok(r.count <= r.bound, `n = ${n}: ${r.count} liars`);
  }
});

test("korseltTest matches 'composite and aⁿ ≡ a for every a' (Proposition 12.2.10)", () => {
  for (let n = 2n; n <= 3000n; n += 1n) {
    const brute = !isPrime(n) && range(0n, n - 1n).every((a) => powMod(a, n, n) === a);
    assert.equal(korseltTest(n).isCarmichael, brute, `n = ${n}`);
  }
  assert.equal(korseltTest(561).verdict, 'carmichael', 'Fact 12.2.8');
  assert.equal(korseltTest(29341).verdict, 'carmichael', 'Example 12.2.11');
  assert.equal(korseltTest(341).verdict, 'divisibilityFails');
  assert.equal(korseltTest(45).verdict, 'notSquarefree');
});

/* ---------------------------- §10 primitive roots ---------------------------- */

const bruteOrder = (a, n) => {
  let x = a % n;
  for (let k = 1n; k <= n; k += 1n) {
    if (x === 1n % n) return k;
    x = (x * a) % n;
  }
  return null;
};
const bruteTotient = (n) => range(1n, n).filter((k) => naiveGcd(k, n) === 1n).length;

test('primitiveRoots lists exactly the elements of order φ(n)', () => {
  for (let n = 2n; n <= 200n; n += 1n) {
    const phi = BigInt(bruteTotient(n));
    const brute = range(1n, n - 1n).filter((a) => naiveGcd(a, n) === 1n && bruteOrder(a, n) === phi);

    const r = primitiveRoots(n);
    assert.ok(r.ok, `n = ${n}`);
    assert.equal(r.exists, brute.length > 0, `existence for n = ${n}`);
    if (!r.exists) continue;

    assert.deepEqual(r.roots, brute, `primitive roots of ${n}`);
    assert.equal(r.smallest, brute[0]);
    assert.equal(r.count, BigInt(brute.length), 'there are φ(φ(n)) of them (Fact 10.3.6)');
  }
});

test('primitiveRootExistence classifies n = 1, 2, 4, pᵏ, 2pᵏ (§10.3, §10.7)', () => {
  assert.equal(primitiveRootExistence(8).form, 'highPowerOfTwo');
  assert.equal(primitiveRootExistence(12).form, 'fourDividesN', 'Fact 10.3.1');
  assert.equal(primitiveRootExistence(15).form, 'severalOddPrimes');
  assert.equal(primitiveRootExistence(54).form, 'twiceOddPrimePower');
  assert.equal(primitiveRootExistence(81).form, 'oddPrimePower');
});

test('primitiveRootTest applies Lemma 10.2.3 (one power per prime q | φ(n))', () => {
  const r = primitiveRootTest(3, 17);
  assert.equal(r.isPrimitiveRoot, true, '3 is a primitive root of 17');
  assert.deepEqual(
    r.rows.map((row) => row.q),
    [2n]
  );
  assert.equal(primitiveRootTest(14, 17).isPrimitiveRoot, true, 'Example 10.2.6: 3 and 14 pair up');
  assert.equal(primitiveRootTest(2, 17).isPrimitiveRoot, false);
  assert.equal(primitiveRootTest(6, 9).code, 'orderRequiresCoprime');
});

test('solvePowerCongruence matches brute force and the §10.5.1 examples', () => {
  for (const n of [7n, 11n, 17n, 19n, 23n, 25n, 27n, 29n, 49n, 50n, 54n]) {
    for (const k of [2n, 3n, 4n, 6n]) {
      for (let a = 1n; a < n; a += 1n) {
        if (naiveGcd(a, n) !== 1n) continue;
        const brute = range(0n, n - 1n).filter((x) => powMod(x, k, n) === a);
        const r = solvePowerCongruence(k, a, n);
        assert.ok(r.ok);
        assert.deepEqual(r.hasSolution ? r.solutions : [], brute, `x^${k} ≡ ${a} (mod ${n})`);
      }
    }
  }

  assert.deepEqual(solvePowerCongruence(3, 5, 17).solutions, [11n], 'x³ ≡ 5 (mod 17)');
  assert.equal(solvePowerCongruence(4, 5, 17).hasSolution, false, 'Example 10.5.1');
  assert.deepEqual(solvePowerCongruence(3, 7, 19).solutions, [4n, 6n, 9n], 'Example 10.5.2');
  assert.deepEqual(
    solvePowerCongruence(6, 8, 49).solutions,
    [6n, 10n, 16n, 33n, 39n, 43n],
    'Example 10.5.3'
  );
  assert.equal(solvePowerCongruence(2, 3, 15).code, 'indexNeedsPrimitiveRoot');
});

test('solveExponentialCongruence matches brute force and Examples 10.5.4 / 10.5.6', () => {
  for (const n of [11n, 13n, 19n, 23n, 27n, 50n]) {
    const phi = BigInt(bruteTotient(n));
    for (let b = 2n; b < n; b += 1n) {
      if (naiveGcd(b, n) !== 1n) continue;
      for (let a = 1n; a < n; a += 1n) {
        if (naiveGcd(a, n) !== 1n) continue;
        const brute = range(0n, phi - 1n).filter((x) => powMod(b, x, n) === a);
        const r = solveExponentialCongruence(b, a, n);
        assert.deepEqual(r.hasSolution ? r.solutions : [], brute, `${b}^x ≡ ${a} (mod ${n})`);
      }
    }
  }

  assert.deepEqual(solveExponentialCongruence(5, 17, 19).solutions, [4n, 13n]);
  assert.equal(solveExponentialCongruence(16, 13, 19).hasSolution, false);
});

test('discreteIndex inverts powers of the smallest primitive root', () => {
  for (const n of [17n, 101n, 1009n, 1_000_003n]) {
    const { g } = discreteIndex(1, n);
    for (const exponent of [0n, 1n, 5n, 77n]) {
      const target = powMod(g, exponent, n);
      const r = discreteIndex(target, n);
      assert.equal(powMod(g, r.index, n), target);
    }
  }
});

/* ------------------------ §16 square roots & quadratics ------------------------ */

test('squareRootsMod finds every square root modulo n ≤ 250, prime powers of 2 included', () => {
  for (let n = 1n; n <= 250n; n += 1n) {
    for (let a = 0n; a < n; a += 1n) {
      const brute = range(0n, n - 1n).filter((x) => (x * x) % n === a);
      const r = squareRootsMod(a, n);
      assert.equal(r.count, BigInt(brute.length), `count of √${a} mod ${n}`);
      assert.deepEqual(r.roots, brute, `√${a} mod ${n}`);
    }
  }
});

test('squareRootsMod handles large primes (Tonelli–Shanks) and lifts them', () => {
  const p = 1_000_000_009n; // ≡ 1 (mod 8), the hard case for Tonelli–Shanks
  for (const a of [2n, 3n, 5n, 10n, 123456789n]) {
    const r = squareRootsMod(a, p);
    for (const x of r.roots) assert.equal((x * x) % p, a);
  }
  const big = squareRootsMod(-1, 5n ** 12n);
  assert.equal(big.count, 2n);
  for (const x of big.roots) assert.equal(mod(x * x + 1n, 5n ** 12n), 0n);
  assert.deepEqual(squareRootsMod(-1, 14).roots, [], 'Example 16.1.4');
});

test('solveQuadraticCongruence completes the square (Algorithm 16.2.4) and agrees with a scan', () => {
  for (const n of [9n, 15n, 21n, 25n, 35n, 45n, 49n, 77n, 105n, 8n, 12n, 20n]) {
    for (const [a, b, c] of [
      [1n, -2n, 3n],
      [1n, 3n, 5n],
      [2n, 1n, -3n],
      [3n, 0n, -12n],
      [4n, 4n, 1n],
    ]) {
      const brute = range(0n, n - 1n).filter((x) => mod(a * x * x + b * x + c, n) === 0n);
      const r = solveQuadraticCongruence(a, b, c, n);
      if (r.ok) assert.deepEqual(r.roots, brute, `${a}x²+${b}x+${c} mod ${n}`);
      else assert.equal(r.code, 'quadraticLeadingZero');
    }
  }
  const book = solveQuadraticCongruence(1, -2, 3, 9);
  assert.equal(book.method, 'completeSquare');
  assert.deepEqual(book.roots, [5n, 6n], '§16.2: x² − 2x + 3 ≡ 0 (mod 9)');
  assert.equal(solveQuadraticCongruence(1, 1, 1, 8).method, 'scan', 'even modulus falls back');
});

test('quadraticResidueList has (p − 1)/2 residues, matching Sage note 16.3.3 for p = 17', () => {
  assert.deepEqual(quadraticResidueList(17).residues, [1n, 2n, 4n, 8n, 9n, 13n, 15n, 16n]);
  for (const p of [3n, 5n, 7n, 11n, 13n, 101n, 997n]) {
    const r = quadraticResidueList(p);
    assert.equal(BigInt(r.residues.length), (p - 1n) / 2n);
    assert.equal(BigInt(r.nonResidues.length), (p - 1n) / 2n);
  }
  assert.equal(quadraticResidueList(15).code, 'legendreRequiresOddPrime');
});

/* -------------------------------- §11 crypto -------------------------------- */

test('encodeMessage / decodeNumber use the book encoding (§11.1.1)', () => {
  assert.deepEqual(encodeMessage('q').blocks, [17n]);
  assert.equal(decodeNumber(17), 'Q');
  assert.deepEqual(
    encodeMessage('Thebestdayofthisyear').blocks.slice(0, 5),
    [20n, 8n, 5n, 2n, 5n]
  );
  assert.deepEqual(
    encodeMessage('thebestdayofthisyear', 2).blocks,
    [228n, 57n, 499n, 124n, 651n, 171n, 228n, 503n, 155n, 469n]
  );
  for (const word of ['A', 'Z', 'AZ', 'ZZ', 'MATH', 'ZEBRA', 'NUMBERTHEORY']) {
    for (const size of [1, 2, 3, 0]) {
      const { blocks } = encodeMessage(word, size);
      assert.equal(blocks.map(decodeNumber).join(''), word, `${word} in blocks of ${size}`);
    }
  }
  assert.equal(encodeMessage('123').code, 'messageHasNoLetters');
});

test('affineCipher: Caesar shift and the (5, 18, 709) example of §11.2', () => {
  const caesar = affineCipher({ message: 'MathIsCool', a: 1, b: 3, n: 26 });
  assert.equal(caesar.cipherText, 'PDWKLVFRRO');
  assert.equal(caesar.recovered, 'MATHISCOOL');

  // W + 3 wraps to 0 ≡ 26, which must still decode as Z.
  assert.equal(affineCipher({ message: 'WXYZ', a: 1, b: 3, n: 26 }).cipherText, 'ZABC');
  assert.equal(affineCipher({ message: 'ZABC', a: 1, b: -3, n: 26 }).recovered, 'ZABC');

  const affine = affineCipher({ message: 'Mathiscool', blockSize: 2, a: 5, b: 18, n: 709 });
  assert.equal(affine.aInverse, 142n, 'Fact 11.2.2: 5⁻¹ ≡ 142 (mod 709)');
  assert.equal(affine.cipher[0], 213n);
  assert.equal(affine.recovered, 'MATHISCOOL');

  assert.equal(affineCipher({ message: 'hi', a: 13, b: 1, n: 26 }).code, 'affineNeedsUnit');
});

test('exponentCipher round-trips (Algorithm 11.3.3)', () => {
  // 2⁶¹ − 1 is a Mersenne prime (§12.1.3); 17 does not divide 2⁶¹ − 2.
  const r = exponentCipher({ message: 'MATHISCOOL', blockSize: 0, p: 2n ** 61n - 1n, e: 17 });
  assert.ok(r.ok, r.code);
  assert.equal((r.e * r.f) % (r.p - 1n), 1n);
  assert.equal(r.recovered, 'MATHISCOOL');
  assert.equal(exponentCipher({ message: 'A', p: 13, e: 4 }).code, 'exponentNotCoprime');
  assert.equal(exponentCipher({ message: 'ZZZZ', blockSize: 0, p: 13, e: 5 }).code, 'blockExceedsModulus');
});

test('diffieHellman: both parties reach the same key (Example 11.4.3)', () => {
  const r = diffieHellman(991, 55, 130, 123);
  assert.ok(r.agree);
  assert.equal(r.aliceKey, powMod(55n, 130n * 123n, 991n));
  assert.equal(diffieHellman(990, 5, 1, 1).code, 'requiresPrimeModulus');
  assert.equal(diffieHellman(991, 1, 1, 1).code, 'dhBaseOutOfRange');
});

test('rsaCipher: p = 89, q = 97, e = 71 gives d = 119 (Example 11.5.4)', () => {
  const r = rsaCipher({ message: 'Mathiscool', blockSize: 2, p: 89, q: 97, e: 71 });
  assert.equal(r.n, 8633n);
  assert.equal(r.phi, 8448n);
  assert.equal(r.d, 119n);
  assert.equal(r.recovered, 'MATHISCOOL');
  assert.equal(rsaCipher({ message: 'A', p: 89, q: 97, e: 2 }).code, 'exponentNotCoprime');
  assert.equal(rsaCipher({ message: 'ZZZ', blockSize: 3, p: 89, q: 97, e: 71 }).code, 'blockExceedsModulus');
  assert.equal(rsaCipher({ message: 'A', p: 91, q: 97, e: 5 }).code, 'rsaRequiresPrimes');
});

test('secretSharing gives keys 8, 9, 1 and any two recover K (Example 11.7.2)', () => {
  const r = secretSharing({ K: 5, p: 13, moduli: [17, 19, 16], t: 12 });
  assert.ok(r.ok, r.code);
  assert.equal(r.K0, 161n);
  assert.deepEqual(
    r.keys.map((k) => k.key),
    [8n, 9n, 1n]
  );
  assert.deepEqual(
    r.reconstructions.map((x) => x.K),
    [5n, 5n, 5n]
  );
  assert.equal(secretSharing({ K: 5, p: 13, moduli: [4, 6, 9], t: 1 }).code, 'sharingModuliNotCoprime');
  assert.equal(secretSharing({ K: 5, p: 13, moduli: [17, 19, 16], t: 30 }).code, 'sharingTTooLarge');
  assert.equal(secretSharing({ K: 5, p: 101, moduli: [17, 19, 16], t: 0 }).code, 'sharingThresholdFails');
});
