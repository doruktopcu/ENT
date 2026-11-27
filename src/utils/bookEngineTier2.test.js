/**
 * Tests for the Tier 2 / Tier 3 functions taken from Crisman's NTIC (see
 * docs/BOOK_SOURCES.md). Brute-force cross-checks plus the book's own worked
 * examples, cited by number.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  arithmeticProfile,
  averageOrders,
  dirichletProduct,
  fermatFactor,
  fermatNumber,
  groupTables,
  lucasLehmer,
  mobiusInversion,
  mordellPoints,
  offsetLogIntegral,
  pellEquation,
  pollardRho,
  positiveLatticePoints,
  primeCounting,
  primeRace,
  pythagoreanFromPQ,
  pythagoreanTriples,
  sieveOfEratosthenes,
  sumOfTwoSquares,
  sumsOfSquares,
  thabitRule,
  twinPrimes,
  zetaApproximations,
} from './bookEngineTier2.js';

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
const isPrimeNum = (n) => n >= 2 && range(2, Math.floor(Math.sqrt(n))).every((d) => n % d !== 0);

/* §3 */

test('positiveLatticePoints counts x, y > 0 exactly (§3.3)', () => {
  for (const a of [2, 3, 5, 6]) {
    for (const b of [3, 4, 7, 10]) {
      for (let c = -5; c <= 80; c += 1) {
        const brute = range(1, 80).flatMap((x) =>
          (c - a * x) % b === 0 && (c - a * x) / b > 0 ? [[x, (c - a * x) / b]] : []
        );
        const r = positiveLatticePoints(a, b, c);
        assert.equal(r.count, BigInt(brute.length), `${a}x + ${b}y = ${c}`);
        assert.deepEqual(
          r.points.map((p) => [Number(p.x), Number(p.y)]),
          brute
        );
      }
    }
  }
});

test('pythagoreanTriples finds every triple with z ≤ N (Algorithm 3.4.7)', () => {
  const N = 150;
  const r = pythagoreanTriples(N);
  for (const t of r.triples) assert.equal(t.x * t.x + t.y * t.y, t.z * t.z);
  // Each unordered triple once.
  const unordered = new Set();
  for (let z = 1; z <= N; z += 1)
    for (let x = 1; x < z; x += 1)
      for (let y = x; y < z; y += 1) if (x * x + y * y === z * z) unordered.add(`${x},${y},${z}`);
  assert.equal(r.count, BigInt(unordered.size));
  assert.equal(pythagoreanFromPQ(1, 2).z, 5n);
  const t = pythagoreanFromPQ(2, 3);
  assert.deepEqual([t.x, t.y, t.z, t.primitive], [5n, 12n, 13n, true]);
  assert.equal(pythagoreanFromPQ(1, 3).primitive, false, 'same parity');
});

/* §6, §8 */

test('sieveOfEratosthenes: 25 primes below 100, sieving by 2, 3, 5, 7 (Example 6.2.4)', () => {
  const r = sieveOfEratosthenes(100);
  assert.equal(r.count, 25);
  assert.deepEqual(r.sievingPrimes, [2, 3, 5, 7]);
  assert.equal(r.grid.find((g) => g.k === 91).crossedBy, 7);
  assert.equal(r.grid.find((g) => g.k === 97).crossedBy, 0);
});

test('groupTables: units, orders and tables of ℤₙ (§8.1–8.2)', () => {
  const r = groupTables(10);
  assert.deepEqual(r.units, [1, 3, 7, 9]);
  assert.equal(r.multiplication[3][7], 1);
  assert.equal(r.addition[7][5], 2);
  assert.deepEqual(
    r.orders.map((o) => o.order),
    [1, 4, 4, 2]
  );
});

/* §12 */

test('fermatNumber: F₀–F₄ prime, F₅ = 641 · 6700417 (Definition 12.1.1, §11.5.1)', () => {
  for (let k = 0; k <= 4; k += 1) assert.equal(fermatNumber(k).isPrime, true);
  const f5 = fermatNumber(5);
  assert.equal(f5.isPrime, false);
  assert.equal(f5.factor.d, 641n);
  assert.equal(f5.factor.cofactor, '6700417');
});

test('lucasLehmer: Example 12.1.10 and the Mersenne primes below 130', () => {
  assert.deepEqual(
    lucasLehmer(5).steps.map((s) => s.residue),
    ['14', '8', '0']
  );
  const exponents = range(2, 130).filter((p) => lucasLehmer(p).isPrime);
  assert.deepEqual(exponents, [2, 3, 5, 7, 13, 17, 19, 31, 61, 89, 107, 127]);
  assert.equal(lucasLehmer(7).perfect, '8128', 'Theorem 19.4.2');
  assert.equal(lucasLehmer(11).divisor, undefined);
  assert.equal(lucasLehmer(12).divisor, 3n, '2² − 1 divides 2¹² − 1');
});

test('fermatFactor: Example 12.5.10 (143 and 93)', () => {
  const a = fermatFactor(143);
  assert.deepEqual([a.s, a.t, a.a, a.b, a.tries], [12n, 1n, 13n, 11n, 1]);
  const b = fermatFactor(93);
  assert.deepEqual([b.s, b.t, b.a, b.b], [17n, 14n, 31n, 3n]);
  assert.equal(fermatFactor(97).trivial, true, 'primes only factor trivially');
});

test('pollardRho: Example 12.6.4 finds 97 | 9991 in round 3', () => {
  const r = pollardRho(9991);
  assert.deepEqual(r.sequence.slice(0, 6), [2n, 5n, 26n, 677n, 8735n, 8950n]);
  assert.deepEqual(
    r.rounds.map((x) => x.diff),
    [21n, 8709n, 3977n]
  );
  assert.equal(r.factor, 97n);
  assert.equal(r.k, 3);
  for (const n of [8051, 10403, 1234567]) {
    const s = pollardRho(n);
    if (s.found) assert.equal(BigInt(n) % s.factor, 0n);
  }
});

/* §13–14 */

test('sumOfTwoSquares matches brute force and Theorem 13.5.5', () => {
  for (let n = 1; n <= 600; n += 1) {
    const reps = [];
    let r2 = 0;
    for (let a = -25; a <= 25; a += 1)
      for (let b = -25; b <= 25; b += 1) if (a * a + b * b === n) r2 += 1;
    for (let a = 0; 2 * a * a <= n; a += 1) {
      const b = Math.round(Math.sqrt(n - a * a));
      if (b * b === n - a * a) reps.push([a, b]);
    }
    const r = sumOfTwoSquares(n);
    assert.equal(r.r2, BigInt(r2), `r₂(${n})`);
    assert.equal(r.representable, reps.length > 0);
    assert.deepEqual(
      (r.representations ?? []).map((x) => [Number(x.a), Number(x.b)]),
      reps
    );
  }
  assert.equal(sumOfTwoSquares(21).representable, false, 'Example 13.5.6');
  assert.deepEqual(sumOfTwoSquares(13).gaussian, { a: 3n, b: 2n }, 'Example 14.1.1');
});

test('sumsOfSquares: four squares always, three unless 4ᵃ(8b + 7) (Facts 14.2.1–14.2.2)', () => {
  for (let n = 0; n <= 2000; n += 1) {
    const r = sumsOfSquares(n);
    assert.ok(r.four, `four squares for ${n}`);
    assert.equal(r.four.reduce((s, x) => s + x * x, 0n), BigInt(n));
    let m = n;
    while (m > 0 && m % 4 === 0) m /= 4;
    assert.equal(r.threeObstructed, n > 0 && m % 8 === 7);
    if (r.three) assert.equal(r.three.reduce((s, x) => s + x * x, 0n), BigInt(n));
    else assert.ok(r.threeObstructed, `three squares for ${n}`);
  }
  assert.ok(sumsOfSquares(999_999_999_999).four);
});

/* §15 */

test('pellEquation: x² − 2y² = 1 gives (3, 2), (17, 12), … (Fact 15.6.2)', () => {
  const r = pellEquation(2);
  assert.deepEqual(
    r.solutions.slice(0, 3).map((s) => [s.x, s.y]),
    [
      [3n, 2n],
      [17n, 12n],
      [99n, 70n],
    ]
  );
  for (let d = 2n; d <= 200n; d += 1n) {
    const p = pellEquation(d);
    if (!p.ok) continue;
    for (const { x, y } of p.solutions) assert.equal(x * x - d * y * y, 1n, `d = ${d}`);
    if (p.negative) assert.equal(p.negative.x ** 2n - d * p.negative.y ** 2n, -1n);
  }
  assert.deepEqual([pellEquation(61).fundamental.x, pellEquation(61).fundamental.y], [1766319049n, 226153980n]);
  assert.equal(pellEquation(16).code, 'pellSquare');
});

test('mordellPoints: Bachet y² = x³ − 2 only (3, ±5); x³ = y² − 7 has none (Facts 15.3.3, 15.3.5)', () => {
  assert.deepEqual(
    mordellPoints(-2, 10000).points.map((p) => [p.x, p.y]),
    [
      [3n, 5n],
      [3n, -5n],
    ]
  );
  assert.deepEqual(mordellPoints(7, 10000).points, []);
});

/* §19, §23 */

test('arithmeticProfile: perfect, abundant, amicable and multiply perfect numbers (§19.4)', () => {
  assert.equal(arithmeticProfile(28).kind, 'perfect');
  assert.equal(arithmeticProfile(8128).kind, 'perfect');
  const twelve = arithmeticProfile(12);
  assert.equal(twelve.kind, 'abundant');
  assert.deepEqual(twelve.abundancy, { num: 7n, den: 3n });
  assert.equal(arithmeticProfile(220).amicablePartner, 284n);
  assert.equal(arithmeticProfile(120).multiplyPerfect, 3n, '120 is 3-perfect');
  const p = arithmeticProfile(360);
  assert.deepEqual([p.tau, p.sigma, p.omega, p.bigOmega, p.mu, p.lambda, p.phi], [24n, 1170n, 3n, 6n, 0n, 1n, 96n]);
  assert.equal(arithmeticProfile(27).vonMangoldtPrime, 3n);
  assert.deepEqual(arithmeticProfile(12).chain.slice(0, 4), [12n, 16n, 15n, 9n]);
});

test('thabitRule gives the amicable pairs for n = 2, 4, 7 (Algorithm 19.4.14)', () => {
  assert.deepEqual(thabitRule(2).pair, [220n, 284n]);
  assert.deepEqual(thabitRule(4).pair, [17296n, 18416n]);
  assert.deepEqual(thabitRule(7).pair, [9363584n, 9437056n]);
  assert.equal(thabitRule(3).works, false);
});

test('dirichletProduct recognises the identities of Fact 23.3.2', () => {
  assert.equal(dirichletProduct('u', 'u', 60).matches, 'tau');
  assert.equal(dirichletProduct('u', 'N', 60).matches, 'sigma');
  assert.equal(dirichletProduct('mu', 'u', 60).matches, 'I');
  assert.equal(dirichletProduct('phi', 'u', 60).matches, 'N');
  assert.equal(dirichletProduct('mu', 'N', 60).matches, 'phi');
  assert.equal(dirichletProduct('lambda', 'mu2', 60).matches, 'I');
  for (const g of ['N', 'phi', 'tau', 'lambda']) assert.ok(mobiusInversion(g, 100).recovered, `invert ${g}`);
  assert.equal(mobiusInversion('phi', 50).fMatches, 'N');
});

/* §20–24 */

test('primeCounting: π(10⁶) = 78498 and Li is the closer estimate (§21)', () => {
  const r = primeCounting(1_000_000);
  assert.equal(r.pi, 78498);
  assert.ok(Math.abs(r.li - 78627.5) < 1);
  assert.ok(Math.abs(r.li - r.pi) < Math.abs(r.xOverLog - r.pi));
  assert.ok(Math.abs(offsetLogIntegral(100) - 29.081) < 0.01);
});

test('primeRace: the 1 (mod 4) team first leads at 26861 (§22.1)', () => {
  const r = primeRace(100_000, 4);
  assert.equal(r.oneLeadsFirst, 26861);
  const small = primeRace(100, 4);
  assert.deepEqual([small.ones, small.others], [11, 13]);
});

test('twinPrimes: 35 pairs below 1000 (Definition 22.3.4)', () => {
  const r = twinPrimes(1000);
  assert.equal(r.count, 35);
  assert.deepEqual(r.pairs.slice(0, 3), [
    [3, 5],
    [5, 7],
    [11, 13],
  ]);
  const brute = range(3, 997).filter((p) => isPrimeNum(p) && isPrimeNum(p + 2)).length;
  assert.equal(r.count, brute);
});

test('averageOrders approach their predicted values (§20, §24.6.4)', () => {
  const r = averageOrders(100_000);
  assert.ok(Math.abs(r.tau.average - r.tau.prediction) < 0.02);
  assert.ok(Math.abs(r.sigma.average / r.sigma.prediction - 1) < 0.001);
  assert.ok(Math.abs(r.phi.average / r.phi.prediction - 1) < 0.001);
  assert.ok(Math.abs(r.circle.average - Math.PI) < 0.01);
});

test('zetaApproximations converge to π²/6 (§24.2)', () => {
  const r = zetaApproximations(2, 100_000);
  assert.ok(Math.abs(r.partial - r.exact) < 2e-5);
  assert.ok(Math.abs(r.product - r.exact) < 1e-4);
  assert.equal(zetaApproximations(1, 10).code, 'zetaNeedsS');
});
