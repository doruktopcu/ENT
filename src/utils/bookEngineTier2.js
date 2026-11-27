/**
 * Tier 2 and Tier 3 additions from Crisman, "Number Theory: In Context and
 * Interactive" (2024 ed., CC BY-ND 4.0). Section numbers (§) refer to that
 * book; docs/BOOK_SOURCES.md records what was taken and where we deviate.
 *
 * Same contract as numberTheoryEngine.js: no prose, only `{ ok, code, vars }`
 * records and language-neutral LaTeX. Exact work uses BigInt; the analytic
 * chapters (§20–24) are about real-valued approximations and use Number.
 */
import {
  gcd,
  integerSqrt,
  isPerfectSquare,
  isPrime,
  parseBigInt,
  primeFactorization,
  solveDiophantine,
} from './numberTheoryEngine.js';

/** Most rows any listing below returns; counts are always exact. */
export const LIST_LIMIT = 300;

export const PYTHAGOREAN_LIMIT = 100_000n;
export const SIEVE_LIST_LIMIT = 100_000;
export const GROUP_TABLE_LIMIT = 24n;
export const FERMAT_INDEX_LIMIT = 11n;
export const LUCAS_LEHMER_LIMIT = 5_000n;
export const TWO_SQUARE_SEARCH_LIMIT = 100_000_000_000n;
export const MORDELL_BOUND_LIMIT = 100_000n;
export const DIRICHLET_LIMIT = 120n;
export const COUNTING_LIMIT = 10_000_000;
export const AVERAGE_LIMIT = 1_000_000;

const abs = (n) => (n < 0n ? -n : n);

/** ⌊a / b⌋ for b > 0 (BigInt division truncates toward zero). */
function floorDiv(a, b) {
  const q = a / b;
  return a % b !== 0n && a < 0n ? q - 1n : q;
}
const ceilDiv = (a, b) => -floorDiv(-a, b);

const fail = (code, vars) => ({ ok: false, code, vars });

/* ==========================================================================
 * §3.3 Positive lattice points and §3.4 Pythagorean triples
 * ========================================================================== */

/**
 * Solutions of ax + by = c with x, y > 0 (a, b > 0). From the general
 * solution x = x₀ + (b/d)t, y = y₀ − (a/d)t, positivity cuts t down to an
 * interval, so the count is the number of integers in it (§3.3).
 */
export function positiveLatticePoints(aRaw, bRaw, cRaw, { limit = LIST_LIMIT } = {}) {
  const a = parseBigInt(aRaw);
  const b = parseBigInt(bRaw);
  const c = parseBigInt(cRaw);
  if (a === null || b === null || c === null) return fail('invalidInput');
  if (a <= 0n || b <= 0n) return fail('latticeNeedsPositive');

  const general = solveDiophantine(a, b, c);
  if (!general.hasSolution) return { ok: true, solvable: false, count: 0n, points: [] };

  const xStep = general.xStep; // b/d > 0
  const yStep = -general.yStep; // a/d > 0
  const tMin = floorDiv(-general.x0, xStep) + 1n;
  const tMax = ceilDiv(general.y0, yStep) - 1n;
  const count = tMax >= tMin ? tMax - tMin + 1n : 0n;

  const points = [];
  for (let t = tMin; t <= tMax && points.length < limit; t += 1n) {
    points.push({ t, x: general.x0 + xStep * t, y: general.y0 - yStep * t });
  }

  return {
    ok: true,
    solvable: true,
    count,
    tMin,
    tMax,
    points,
    truncated: BigInt(points.length) < count,
    latex:
      count > 0n
        ? `${tMin} \\le t \\le ${tMax}, \\quad \\#\\{(x, y)\\} = ${count}`
        : `\\{t : x(t) > 0,\\; y(t) > 0\\} = \\varnothing`,
  };
}

/** One triple from p < q via Theorem 3.4.6: (q² − p², 2pq, p² + q²). */
export function pythagoreanFromPQ(pRaw, qRaw) {
  const p = parseBigInt(pRaw);
  const q = parseBigInt(qRaw);
  if (p === null || q === null) return fail('invalidInput');
  if (p < 1n || q <= p) return fail('pythagoreanNeedsPQ');

  const x = q * q - p * p;
  const y = 2n * p * q;
  const z = p * p + q * q;
  const primitive = gcd(p, q).gcd === 1n && (p + q) % 2n === 1n;

  return {
    ok: true,
    p,
    q,
    x,
    y,
    z,
    primitive,
    area: p * q * (q * q - p * p), // Proposition 3.4.9
    latex: `${q}^2 - ${p}^2 = ${x}, \\quad 2 \\cdot ${p} \\cdot ${q} = ${y}, \\quad ${p}^2 + ${q}^2 = ${z}`,
  };
}

/**
 * Every Pythagorean triple with hypotenuse ≤ N (Algorithm 3.4.7): coprime
 * p < q of opposite parity give the primitive ones, multiples give the rest.
 */
export function pythagoreanTriples(limitRaw, { primitiveOnly = false, listLimit = LIST_LIMIT } = {}) {
  const N = parseBigInt(limitRaw);
  if (N === null) return fail('invalidInput');
  if (N < 5n || N > PYTHAGOREAN_LIMIT) return fail('tripleLimitRange', { max: PYTHAGOREAN_LIMIT });

  const triples = [];
  for (let q = 2n; q * q + 1n <= N; q += 1n) {
    for (let p = 1n; p < q && p * p + q * q <= N; p += 1n) {
      if ((p + q) % 2n === 0n || gcd(p, q).gcd !== 1n) continue;
      const x = q * q - p * p;
      const y = 2n * p * q;
      const z = p * p + q * q;
      const maxK = primitiveOnly ? 1n : N / z;
      for (let k = 1n; k <= maxK; k += 1n) {
        triples.push({ x: k * x, y: k * y, z: k * z, p, q, k, primitive: k === 1n });
      }
    }
  }

  triples.sort((s, t) => (s.z === t.z ? (s.x < t.x ? -1 : 1) : s.z < t.z ? -1 : 1));
  return {
    ok: true,
    N,
    count: BigInt(triples.length),
    primitiveCount: BigInt(triples.filter((t) => t.primitive).length),
    triples: triples.slice(0, listLimit),
    truncated: triples.length > listLimit,
  };
}

/* ==========================================================================
 * §6.2.2 Sieve of Eratosthenes — and a fast prime table for chapters 20–22
 * ========================================================================== */

/** Uint8Array with 1 at every prime ≤ n. */
export function primeFlags(n) {
  const flags = new Uint8Array(n + 1);
  if (n >= 2) flags.fill(1, 2);
  for (let p = 2; p * p <= n; p += 1) {
    if (!flags[p]) continue;
    for (let m = p * p; m <= n; m += p) flags[m] = 0;
  }
  return flags;
}

/**
 * Algorithm 6.2.3: cross out multiples of each prime p ≤ √n. For a small grid
 * we also report which prime crossed each number out first.
 */
export function sieveOfEratosthenes(nRaw, { gridLimit = 200 } = {}) {
  const parsed = parseBigInt(nRaw);
  if (parsed === null) return fail('invalidInput');
  if (parsed < 2n || parsed > BigInt(SIEVE_LIST_LIMIT)) return fail('sieveRange', { max: SIEVE_LIST_LIMIT });

  const n = Number(parsed);
  const smallestFactor = new Uint32Array(n + 1);
  for (let p = 2; p * p <= n; p += 1) {
    if (smallestFactor[p]) continue;
    for (let m = p * p; m <= n; m += p) if (!smallestFactor[m]) smallestFactor[m] = p;
  }

  const primes = [];
  for (let k = 2; k <= n; k += 1) if (!smallestFactor[k]) primes.push(k);

  const grid = [];
  for (let k = 1; k <= Math.min(n, gridLimit); k += 1) {
    grid.push({ k, crossedBy: k === 1 ? null : smallestFactor[k] || 0 });
  }

  return {
    ok: true,
    n,
    count: primes.length,
    primes: primes.slice(0, LIST_LIMIT),
    truncated: primes.length > LIST_LIMIT,
    sievingPrimes: primes.filter((p) => p * p <= n),
    grid,
  };
}

/* ==========================================================================
 * §8.1–8.2 The integers modulo n: addition, multiplication and power tables
 * ========================================================================== */

export function groupTables(nRaw) {
  const parsed = parseBigInt(nRaw);
  if (parsed === null) return fail('invalidInput');
  if (parsed < 2n || parsed > GROUP_TABLE_LIMIT) return fail('groupTableRange', { max: GROUP_TABLE_LIMIT });

  const n = Number(parsed);
  const range = [...Array(n).keys()];
  const gcdNum = (a, b) => (b === 0 ? a : gcdNum(b, a % b));

  const units = range.filter((a) => gcdNum(a, n) === 1);
  const powers = range.map((a) => {
    const row = [];
    let x = a % n;
    for (let k = 1; k <= n; k += 1) {
      row.push(x);
      x = (x * a) % n;
    }
    return row;
  });
  const orders = units.map((a) => ({ a, order: powers[a].indexOf(1 % n) + 1 }));

  return {
    ok: true,
    n,
    addition: range.map((a) => range.map((b) => (a + b) % n)),
    multiplication: range.map((a) => range.map((b) => (a * b) % n)),
    powers,
    units,
    orders,
  };
}

/* ==========================================================================
 * §12.1 Fermat and Mersenne numbers (Lucas–Lehmer), §19.4 perfect numbers,
 * §12.5.3 Fermat factorisation, §12.6.1 Pollard rho
 * ========================================================================== */

/** Show the full value only while it still fits on screen. */
const DIGIT_DISPLAY_LIMIT = 120;
const displayBig = (n) => {
  const s = n.toString();
  return s.length <= DIGIT_DISPLAY_LIMIT ? s : `${s.slice(0, 30)}…${s.slice(-30)}`;
};

/**
 * Fₖ = 2^(2ᵏ) + 1 (Definition 12.1.1). Every prime factor of Fₖ (k ≥ 2) has
 * the form j·2^(k+2) + 1 — a classical result, not proved in the book — so
 * the factor search only tries those candidates.
 */
export function fermatNumber(kRaw, { candidateLimit = 200_000 } = {}) {
  const k = parseBigInt(kRaw);
  if (k === null) return fail('invalidInput');
  if (k < 0n || k > FERMAT_INDEX_LIMIT) return fail('fermatIndexRange', { max: FERMAT_INDEX_LIMIT });

  const F = 2n ** (2n ** k) + 1n;
  const prime = isPrime(F);

  let factor = null;
  if (!prime && k >= 2n) {
    const step = 2n ** (k + 2n);
    for (let j = 1n; j <= BigInt(candidateLimit); j += 1n) {
      const d = j * step + 1n;
      if (d * d > F) break;
      if (F % d === 0n) {
        factor = { d, j, cofactor: F / d };
        break;
      }
    }
  }

  return {
    ok: true,
    k,
    value: displayBig(F),
    digits: F.toString().length,
    isPrime: prime,
    factor: factor && {
      d: factor.d,
      j: factor.j,
      cofactor: displayBig(factor.cofactor),
      cofactorIsPrime: isPrime(factor.cofactor),
    },
    latex: `F_{${k}} = 2^{2^{${k}}} + 1`,
  };
}

/**
 * Lucas–Lehmer (Algorithm 12.1.9): x₀ = 4, xᵢ₊₁ = xᵢ² − 2 mod 2ᵖ − 1;
 * 2ᵖ − 1 is prime iff x_{p−2} ≡ 0. A prime Mₚ gives the perfect number
 * 2^(p−1)·Mₚ (Theorem 19.4.2).
 */
export function lucasLehmer(pRaw, { stepLimit = 40 } = {}) {
  const p = parseBigInt(pRaw);
  if (p === null) return fail('invalidInput');
  if (p < 2n || p > LUCAS_LEHMER_LIMIT) return fail('lucasLehmerRange', { max: LUCAS_LEHMER_LIMIT });

  const M = 2n ** p - 1n;
  if (!isPrime(p)) {
    // 2^(ab) − 1 is divisible by 2^a − 1 (Example 12.1.3).
    const a = primeFactorization(p).factors[0].prime;
    return {
      ok: true,
      p,
      exponentPrime: false,
      isPrime: false,
      value: displayBig(M),
      divisor: 2n ** a - 1n,
      steps: [],
    };
  }

  if (p === 2n) {
    return { ok: true, p, exponentPrime: true, isPrime: true, value: '3', steps: [], perfect: '6' };
  }

  const steps = [];
  let x = 4n;
  for (let i = 1n; i <= p - 2n; i += 1n) {
    x = (x * x - 2n) % M;
    if (steps.length < stepLimit) steps.push({ i, residue: displayBig(x) });
  }
  const prime = x === 0n;

  return {
    ok: true,
    p,
    exponentPrime: true,
    isPrime: prime,
    value: displayBig(M),
    digits: M.toString().length,
    steps,
    stepsTruncated: p - 2n > BigInt(stepLimit),
    perfect: prime ? displayBig(2n ** (p - 1n) * M) : null,
  };
}

/**
 * Fermat factorisation (Algorithm 12.5.9): from s = ⌈√n⌉ upward, look for
 * s² − n = t²; then n = (s + t)(s − t).
 */
export function fermatFactor(nRaw, { maxSteps = 200_000, stepLimit = 25 } = {}) {
  const n = parseBigInt(nRaw);
  if (n === null) return fail('invalidInput');
  if (n < 3n || n % 2n === 0n) return fail('fermatFactorNeedsOdd');

  let s = integerSqrt(n);
  if (s * s < n) s += 1n;

  const steps = [];
  for (let count = 0; count < maxSteps; count += 1, s += 1n) {
    const r = s * s - n;
    const { isSquare, root } = isPerfectSquare(r);
    if (steps.length < stepLimit) steps.push({ s, r, isSquare });
    if (isSquare) {
      const a = s + root;
      const b = s - root;
      return {
        ok: true,
        found: true,
        trivial: b === 1n,
        s,
        t: root,
        a,
        b,
        tries: count + 1,
        steps,
        stepsTruncated: count + 1 > stepLimit,
        latex: `${s}^2 - ${root}^2 = ${n} \\implies ${n} = (${s} + ${root})(${s} - ${root}) = ${a} \\cdot ${b}`,
      };
    }
  }
  return { ok: true, found: false, tries: maxSteps, steps, stepsTruncated: true };
}

/**
 * Pollard rho (Algorithm 12.6.3) with x ↦ x² + c and Floyd's comparison of
 * xₖ with x₂ₖ — the differences x₂ − x₁, x₄ − x₂, x₆ − x₃, … of Example 12.6.4.
 */
export function pollardRho(nRaw, { seed: seedRaw = 2, c: cRaw = 1, maxRounds = 200_000, roundLimit = 30 } = {}) {
  const n = parseBigInt(nRaw);
  const seed = parseBigInt(seedRaw);
  const c = parseBigInt(cRaw);
  if (n === null || seed === null || c === null) return fail('invalidInput');
  if (n < 4n) return fail('requiresIntegerAboveOne');
  if (isPrime(n)) return fail('rhoNeedsComposite', { n });

  const f = (x) => (x * x + c) % n;
  const sequence = [];
  let walker = seed % n;
  for (let i = 0; i < 12; i += 1) {
    sequence.push(walker);
    walker = f(walker);
  }

  const rounds = [];
  let x = seed % n;
  let y = seed % n;
  for (let k = 1; k <= maxRounds; k += 1) {
    x = f(x);
    y = f(f(y));
    const diff = x - y;
    const d = gcd(abs(diff), n).gcd;
    if (rounds.length < roundLimit) rounds.push({ k, xk: x, x2k: y, diff: -diff, d });
    if (d === n) return { ok: true, found: false, failed: true, rounds, sequence, k };
    if (d !== 1n) {
      return {
        ok: true,
        found: true,
        factor: d,
        cofactor: n / d,
        k,
        rounds,
        sequence,
        roundsTruncated: k > roundLimit,
        latex: `\\gcd(${abs(diff)}, ${n}) = ${d} \\implies ${n} = ${d} \\cdot ${n / d}`,
      };
    }
  }
  return { ok: true, found: false, failed: false, rounds, sequence, k: maxRounds };
}

/* ==========================================================================
 * §13 Sums of two squares; §14.1–14.2 Gaussian norm, three and four squares
 * ========================================================================== */

/**
 * n = a² + b²: Theorem 13.5.5 says this happens iff every prime ≡ 3 (mod 4)
 * appears to an even power. r₂(n), the number of ordered signed
 * representations, is 4·∏(e + 1) over primes ≡ 1 (mod 4) (Exercise 13.7.7).
 */
export function sumOfTwoSquares(nRaw, { budget, listLimit = LIST_LIMIT } = {}) {
  const n = parseBigInt(nRaw);
  if (n === null) return fail('invalidInput');
  if (n < 1n) return fail('requiresPositiveInteger');

  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return fail(factorisation.code, { n });

  const rows = factorisation.factors.map(({ prime, power }) => {
    const residue = prime % 4n;
    return { prime, power, residue, ok: residue !== 3n || power % 2n === 0n };
  });
  const representable = rows.every((row) => row.ok);
  const r2 = representable
    ? 4n * rows.filter((row) => row.residue === 1n).reduce((acc, row) => acc * (row.power + 1n), 1n)
    : 0n;

  let representations = null;
  if (representable && n <= TWO_SQUARE_SEARCH_LIMIT) {
    representations = [];
    for (let a = 0n; 2n * a * a <= n && representations.length < listLimit; a += 1n) {
      const { isSquare, root } = isPerfectSquare(n - a * a);
      if (isSquare) representations.push({ a, b: root });
    }
  }

  // Gaussian factorisation of a prime p ≡ 1 (mod 4): p = (a + bi)(a − bi) (§14.1).
  const gaussian =
    factorisation.isPrime && n % 4n === 1n && representations?.length
      ? { a: representations[0].b, b: representations[0].a }
      : null;

  return { ok: true, n, rows, representable, r2, representations, gaussian, factorString: factorisation.factorString };
}

/** First a ≥ b ≥ … with Σ squares = m in exactly k squares, depth-first. */
function findSquares(m, k, budget) {
  if (k === 1) {
    const { isSquare, root } = isPerfectSquare(m);
    return isSquare ? [root] : null;
  }
  if (m === 0n) return Array(k).fill(0n);
  let a = integerSqrt(m);
  // The largest of k squares is at least m/k.
  while (a >= 0n && BigInt(k) * a * a >= m) {
    budget.left -= 1;
    if (budget.left < 0) return null;
    const rest = findSquares(m - a * a, k - 1, budget);
    if (rest) return [a, ...rest];
    a -= 1n;
  }
  return null;
}

/**
 * Lagrange: every n ≥ 0 is a sum of four squares (Fact 14.2.2); n is a sum of
 * three squares iff it is not 4ᵃ(8b + 7) (Fact 14.2.1, Legendre).
 */
export function sumsOfSquares(nRaw) {
  const n = parseBigInt(nRaw);
  if (n === null) return fail('invalidInput');
  if (n < 0n) return fail('requiresPositiveInteger');
  if (n > 1_000_000_000_000n) return fail('squaresTooLarge', { max: 1_000_000_000_000n });

  let m = n;
  let fours = 0n;
  while (m > 0n && m % 4n === 0n) {
    m /= 4n;
    fours += 1n;
  }
  const threeObstructed = n > 0n && m % 8n === 7n;

  const three = threeObstructed ? null : findSquares(n, 3, { left: 2_000_000 });
  const four = findSquares(n, 4, { left: 2_000_000 });

  return { ok: true, n, threeObstructed, obstruction: { a: fours, b: (m - 7n) / 8n }, three, four };
}

/* ==========================================================================
 * §15 Points on curves: Pell's equation and Mordell curves
 * ========================================================================== */

/**
 * x² − dy² = 1. The fundamental solution comes from the continued fraction of
 * √d (not in the book, which finds points by hand and by "doubling"); further
 * solutions come from composing with it, (x₁ + y₁√d)ᵏ, exactly the
 * product rule of Fact 15.6.2 / Example 15.6.3.
 */
export function pellEquation(dRaw, { count = 6, periodLimit = 50_000 } = {}) {
  const d = parseBigInt(dRaw);
  if (d === null) return fail('invalidInput');
  if (d < 2n) return fail('pellNeedsD');
  if (isPerfectSquare(d).isSquare) return fail('pellSquare', { d });

  const a0 = integerSqrt(d);
  const period = [];
  let m = 0n;
  let q = 1n;
  let a = a0;
  do {
    m = q * a - m;
    q = (d - m * m) / q;
    a = (a0 + m) / q;
    period.push(a);
    if (period.length > periodLimit) return fail('pellPeriodTooLong', { max: periodLimit });
  } while (a !== 2n * a0);

  const L = period.length;
  const termAt = (i) => (i === 0 ? a0 : period[(i - 1) % L]);

  // Convergents hᵢ/kᵢ of √d.
  const convergent = (index) => {
    let [h0, h1] = [1n, a0];
    let [k0, k1] = [0n, 1n];
    for (let i = 1; i <= index; i += 1) {
      const t = termAt(i);
      [h0, h1] = [h1, t * h1 + h0];
      [k0, k1] = [k1, t * k1 + k0];
    }
    return { x: h1, y: k1 };
  };

  const fundamental = convergent(L % 2 === 0 ? L - 1 : 2 * L - 1);
  const negative = L % 2 === 1 ? convergent(L - 1) : null;

  const solutions = [fundamental];
  while (solutions.length < count) {
    const last = solutions[solutions.length - 1];
    solutions.push({
      x: fundamental.x * last.x + d * fundamental.y * last.y,
      y: fundamental.x * last.y + fundamental.y * last.x,
    });
  }

  return {
    ok: true,
    d,
    a0,
    period,
    periodLength: L,
    fundamental,
    negative,
    solutions,
    cfLatex: `\\sqrt{${d}} = [${a0};\\, \\overline{${period.join(', ')}}]`,
    compositionLatex: `x_{k+1} + y_{k+1}\\sqrt{${d}} = (${fundamental.x} + ${fundamental.y}\\sqrt{${d}})(x_k + y_k\\sqrt{${d}})`,
  };
}

/** Integer points on the Mordell curve y² = x³ + k with |x| ≤ bound (§15.3). */
export function mordellPoints(kRaw, boundRaw) {
  const k = parseBigInt(kRaw);
  const bound = parseBigInt(boundRaw);
  if (k === null || bound === null) return fail('invalidInput');
  if (k === 0n) return fail('mordellZero');
  if (bound < 1n || bound > MORDELL_BOUND_LIMIT) return fail('mordellBoundRange', { max: MORDELL_BOUND_LIMIT });

  const points = [];
  for (let x = -bound; x <= bound; x += 1n) {
    const v = x * x * x + k;
    if (v < 0n) continue;
    const { isSquare, root } = isPerfectSquare(v);
    if (isSquare) {
      points.push({ x, y: root });
      if (root !== 0n) points.push({ x, y: -root });
    }
  }
  return { ok: true, k, bound, points };
}

/* ==========================================================================
 * §18–19 and §23 Arithmetic functions, perfect and amicable numbers,
 * Dirichlet products and Möbius inversion
 * ========================================================================== */

function sigmaFromFactors(factors, k = 1n) {
  return factors.reduce((acc, { prime, power }) => {
    const pk = prime ** k;
    return acc * ((pk ** (power + 1n) - 1n) / (pk - 1n));
  }, 1n);
}

function sigmaOf(n, budget) {
  if (n === 1n) return 1n;
  const f = primeFactorization(n, { budget });
  return f.ok ? sigmaFromFactors(f.factors) : null;
}

/**
 * Everything chapter 19 asks about one n: τ, σ, σₖ (Definition 19.1.1), ω, Ω,
 * μ, λ, φ, Λ, the abundancy index σ(n)/n (Definition 19.4.7), perfect /
 * abundant / deficient / k-perfect (Definitions 19.4.1, 19.4.4), and the
 * aliquot chain s(n) = σ(n) − n with its amicable partner (Definition 19.4.11).
 */
export function arithmeticProfile(nRaw, { budget, aliquotSteps = 12 } = {}) {
  const n = parseBigInt(nRaw);
  if (n === null) return fail('invalidInput');
  if (n < 1n) return fail('requiresPositiveInteger');

  const factorisation = n === 1n ? { ok: true, factors: [], factorString: '1' } : primeFactorization(n, { budget });
  if (!factorisation.ok) return fail(factorisation.code, { n });
  const { factors } = factorisation;

  const tau = factors.reduce((acc, f) => acc * (f.power + 1n), 1n);
  const sigma = sigmaFromFactors(factors, 1n);
  const sigma2 = sigmaFromFactors(factors, 2n);
  const sigma3 = sigmaFromFactors(factors, 3n);
  const omega = BigInt(factors.length);
  const bigOmega = factors.reduce((acc, f) => acc + f.power, 0n);
  const mu = factors.some((f) => f.power > 1n) ? 0n : omega % 2n === 0n ? 1n : -1n;
  const lambda = bigOmega % 2n === 0n ? 1n : -1n;
  const phi = factors.reduce((acc, f) => (acc / f.prime) * (f.prime - 1n), n);
  const vonMangoldtPrime = factors.length === 1 ? factors[0].prime : null;

  const g = gcd(sigma, n).gcd;
  const abundancy = { num: sigma / g, den: n / g };
  const kind = sigma === 2n * n ? 'perfect' : sigma > 2n * n ? 'abundant' : 'deficient';
  const multiplyPerfect = sigma % n === 0n ? sigma / n : null;

  const aliquot = sigma - n;
  const partnerSigma = aliquot > 0n ? sigmaOf(aliquot, budget) : null;
  const amicablePartner =
    aliquot !== n && aliquot > 0n && partnerSigma !== null && partnerSigma - aliquot === n ? aliquot : null;

  const chain = [n];
  let current = n;
  for (let i = 0; i < aliquotSteps; i += 1) {
    if (current <= 1n || current > 10n ** 18n) break;
    const s = sigmaOf(current, budget);
    if (s === null) break;
    current = s - current;
    chain.push(current);
    if (chain.indexOf(current) < chain.length - 1) break; // cycle
  }

  return {
    ok: true,
    n,
    factorString: factorisation.factorString,
    tau,
    sigma,
    sigma2,
    sigma3,
    omega,
    bigOmega,
    mu,
    lambda,
    phi,
    vonMangoldtPrime,
    vonMangoldt: vonMangoldtPrime === null ? 0 : Math.log(Number(vonMangoldtPrime)),
    abundancy,
    kind,
    multiplyPerfect,
    aliquot,
    amicablePartner,
    chain,
  };
}

/**
 * Thabit ibn Qurra's rule (Algorithm 19.4.14): with pₙ = 3·2ⁿ − 1 and
 * qₙ = 9·2²ⁿ⁻¹ − 1 all prime, 2ⁿpₙ₋₁pₙ and 2ⁿqₙ are amicable.
 */
export function thabitRule(nRaw) {
  const n = parseBigInt(nRaw);
  if (n === null) return fail('invalidInput');
  if (n < 2n || n > 64n) return fail('thabitRange');

  const p = (k) => 3n * 2n ** k - 1n;
  const pPrev = p(n - 1n);
  const pN = p(n);
  const qN = 9n * 2n ** (2n * n - 1n) - 1n;
  const checks = [
    { label: 'p_{n-1}', value: pPrev, prime: isPrime(pPrev) },
    { label: 'p_n', value: pN, prime: isPrime(pN) },
    { label: 'q_n', value: qN, prime: isPrime(qN) },
  ];
  const works = checks.every((c) => c.prime);

  return {
    ok: true,
    n,
    checks,
    works,
    pair: works ? [2n ** n * pPrev * pN, 2n ** n * qN] : null,
  };
}

/** Named arithmetic functions for the Dirichlet product (Definitions 19.2.9, 23.3.1). */
export const ARITHMETIC_FUNCTIONS = ['I', 'u', 'N', 'mu', 'phi', 'tau', 'sigma', 'lambda', 'mu2'];

function arithmeticTables(N) {
  const spf = new Uint32Array(N + 1);
  for (let p = 2; p <= N; p += 1) {
    if (spf[p]) continue;
    for (let m = p; m <= N; m += p) if (!spf[m]) spf[m] = p;
  }

  const tables = Object.fromEntries(ARITHMETIC_FUNCTIONS.map((name) => [name, new Array(N + 1).fill(0)]));
  for (let m = 1; m <= N; m += 1) {
    let rest = m;
    let tau = 1;
    let sigma = 1;
    let phi = 1;
    let omega = 0;
    let bigOmega = 0;
    let squarefree = true;
    while (rest > 1) {
      const p = spf[rest];
      let e = 0;
      let pe = 1;
      while (rest % p === 0) {
        rest /= p;
        e += 1;
        pe *= p;
      }
      tau *= e + 1;
      sigma *= (pe * p - 1) / (p - 1);
      phi *= pe - pe / p;
      omega += 1;
      bigOmega += e;
      if (e > 1) squarefree = false;
    }
    tables.I[m] = m === 1 ? 1 : 0;
    tables.u[m] = 1;
    tables.N[m] = m;
    tables.mu[m] = squarefree ? (omega % 2 === 0 ? 1 : -1) : 0;
    tables.phi[m] = phi;
    tables.tau[m] = tau;
    tables.sigma[m] = sigma;
    tables.lambda[m] = bigOmega % 2 === 0 ? 1 : -1;
    tables.mu2[m] = squarefree ? 1 : 0;
  }
  return tables;
}

const convolve = (f, g, N) => {
  const h = new Array(N + 1).fill(0);
  for (let d = 1; d <= N; d += 1) for (let m = d; m <= N; m += d) h[m] += f[d] * g[m / d];
  return h;
};

const identify = (h, tables, N) =>
  ARITHMETIC_FUNCTIONS.find((name) => {
    for (let m = 1; m <= N; m += 1) if (tables[name][m] !== h[m]) return false;
    return true;
  }) ?? null;

/**
 * (f ⋆ g)(n) = Σ_{d|n} f(d) g(n/d) (Definition 23.2.3), with the result
 * recognised against the named functions where possible (Fact 23.3.2).
 */
export function dirichletProduct(fName, gName, NRaw) {
  const N = parseBigInt(NRaw);
  if (N === null) return fail('invalidInput');
  if (N < 1n || N > DIRICHLET_LIMIT) return fail('dirichletRange', { max: DIRICHLET_LIMIT });
  if (!ARITHMETIC_FUNCTIONS.includes(fName) || !ARITHMETIC_FUNCTIONS.includes(gName)) return fail('invalidInput');

  const size = Number(N);
  const tables = arithmeticTables(size);
  const h = convolve(tables[fName], tables[gName], size);

  return {
    ok: true,
    N: size,
    rows: Array.from({ length: size }, (_, i) => ({
      n: i + 1,
      f: tables[fName][i + 1],
      g: tables[gName][i + 1],
      h: h[i + 1],
    })),
    matches: identify(h, tables, size),
  };
}

/**
 * Möbius inversion (Theorem 23.2.1): with f = g ⋆ u, f ⋆ μ gives g back.
 */
export function mobiusInversion(gName, NRaw) {
  const N = parseBigInt(NRaw);
  if (N === null) return fail('invalidInput');
  if (N < 1n || N > DIRICHLET_LIMIT) return fail('dirichletRange', { max: DIRICHLET_LIMIT });
  if (!ARITHMETIC_FUNCTIONS.includes(gName)) return fail('invalidInput');

  const size = Number(N);
  const tables = arithmeticTables(size);
  const f = convolve(tables[gName], tables.u, size);
  const back = convolve(f, tables.mu, size);

  return {
    ok: true,
    N: size,
    fMatches: identify(f, tables, size),
    recovered: back.every((value, i) => i === 0 || value === tables[gName][i]),
    rows: Array.from({ length: size }, (_, i) => ({
      n: i + 1,
      g: tables[gName][i + 1],
      f: f[i + 1],
      back: back[i + 1],
    })),
  };
}

/* ==========================================================================
 * Tier 3 — §20 average orders, §21 the prime counting function,
 * §22 prime races and twin primes, §24 the zeta function. Real-valued.
 * ========================================================================== */

const EULER_GAMMA = 0.5772156649015329;
const TWIN_PRIME_CONSTANT = 0.6601618158468696;
const LI_2 = 1.045163780117493; // li(2)

/** li(x) by Ramanujan's series; Li(x) = li(x) − li(2) = ∫₂ˣ dt / ln t (Definition 21.2.2). */
export function offsetLogIntegral(x) {
  if (x <= 2) return 0;
  const L = Math.log(x);
  let sum = 0;
  let factorial = 1;
  let inner = 0;
  for (let n = 1; n < 200; n += 1) {
    factorial *= n;
    if ((n - 1) % 2 === 0) inner += 1 / n; // Σ 1/(2k+1) for k ≤ (n−1)/2
    const term = ((n % 2 === 1 ? 1 : -1) * L ** n) / (factorial * 2 ** (n - 1)) * inner;
    sum += term;
    if (Math.abs(term) < 1e-17 * Math.abs(sum)) break;
  }
  return EULER_GAMMA + Math.log(L) + Math.sqrt(x) * sum - LI_2;
}

function readLimit(xRaw, max, min = 10) {
  const x = parseBigInt(xRaw);
  if (x === null) return { error: fail('invalidInput') };
  if (x < BigInt(min) || x > BigInt(max)) return { error: fail('countingRange', { min, max }) };
  return { x: Number(x) };
}

/** Evenly spaced sample points 1 … x for the charts. */
const samplePoints = (x, count) =>
  Array.from({ length: count }, (_, i) => Math.max(2, Math.round(((i + 1) * x) / count)));

/**
 * π(x) against x/ln x and Li(x) — the Prime Number Theorem (Theorem 21.3.1)
 * and Gauss's estimate (§21.2).
 */
export function primeCounting(xRaw, { samples = 60 } = {}) {
  const { x, error } = readLimit(xRaw, COUNTING_LIMIT);
  if (error) return error;

  const flags = primeFlags(x);
  const marks = samplePoints(x, samples);
  const series = [];
  let pi = 0;
  let next = 0;
  for (let k = 2; k <= x; k += 1) {
    pi += flags[k];
    while (next < marks.length && marks[next] === k) {
      series.push({ x: k, pi, li: offsetLogIntegral(k), xOverLog: k / Math.log(k) });
      next += 1;
    }
  }

  return {
    ok: true,
    x,
    pi,
    xOverLog: x / Math.log(x),
    li: offsetLogIntegral(x),
    series,
  };
}

/**
 * The race between primes ≡ 1 and ≡ 3 (mod 4), or ≡ 1 and ≡ 2 (mod 3)
 * (§22.1). Chebyshev's bias: the non-residue team usually leads.
 */
export function primeRace(xRaw, modulusRaw = 4, { samples = 60, changeLimit = 20 } = {}) {
  const { x, error } = readLimit(xRaw, COUNTING_LIMIT);
  if (error) return error;
  const modulus = Number(modulusRaw);
  if (modulus !== 3 && modulus !== 4) return fail('invalidInput');

  const other = modulus - 1;
  const flags = primeFlags(x);
  const marks = samplePoints(x, samples);
  let ones = 0;
  let others = 0;
  let leader = 0; // −1 for "1", +1 for "other", 0 tied
  const changes = [];
  const series = [];
  let next = 0;
  let oneLeadsFirst = null;

  for (let k = 2; k <= x; k += 1) {
    if (flags[k]) {
      if (k % modulus === 1) ones += 1;
      else if (k % modulus === other) others += 1;
      const now = Math.sign(others - ones);
      if (now !== 0 && now !== leader) {
        if (changes.length < changeLimit) changes.push({ x: k, leader: now < 0 ? 1 : other });
        if (now < 0 && oneLeadsFirst === null) oneLeadsFirst = k;
        leader = now;
      }
    }
    while (next < marks.length && marks[next] === k) {
      series.push({ x: k, gap: others - ones });
      next += 1;
    }
  }

  return { ok: true, x, modulus, ones, others, other, oneLeadsFirst, changes, series };
}

/** ∫₂ˣ dt / (ln t)² by Simpson's rule. */
function integrateInverseLogSquared(x) {
  const steps = 2000;
  const h = (x - 2) / steps;
  const f = (t) => 1 / Math.log(t) ** 2;
  let sum = f(2) + f(x);
  for (let i = 1; i < steps; i += 1) sum += (i % 2 === 1 ? 4 : 2) * f(2 + i * h);
  return (sum * h) / 3;
}

/**
 * Twin primes p, p + 2 (Definition 22.3.4), against the Hardy–Littlewood
 * heuristic 2C₂ ∫ dt/(ln t)² (§22.3.2).
 */
export function twinPrimes(xRaw, { listLimit = 40 } = {}) {
  const { x, error } = readLimit(xRaw, COUNTING_LIMIT);
  if (error) return error;

  const flags = primeFlags(x);
  const pairs = [];
  let count = 0;
  for (let p = 3; p + 2 <= x; p += 2) {
    if (flags[p] && flags[p + 2]) {
      count += 1;
      if (pairs.length < listLimit) pairs.push([p, p + 2]);
    }
  }

  return {
    ok: true,
    x,
    count,
    pairs,
    estimate: 2 * TWIN_PRIME_CONSTANT * integrateInverseLogSquared(x),
  };
}

/**
 * Averages of arithmetic functions (§20): (1/x)Στ(n) ≈ ln x + 2γ − 1
 * (§20.3), (1/x)Σσ(n) ≈ π²x/12 (§20.4), (1/x)Σφ(n) ≈ 3x/π² (§24.6.4) and
 * (1/x)·#{(a, b) : a² + b² ≤ x} → π (§20.1).
 */
export function averageOrders(xRaw) {
  const { x, error } = readLimit(xRaw, AVERAGE_LIMIT);
  if (error) return error;

  const tau = new Uint32Array(x + 1);
  const sigma = new Float64Array(x + 1);
  for (let d = 1; d <= x; d += 1) {
    for (let m = d; m <= x; m += d) {
      tau[m] += 1;
      sigma[m] += d;
    }
  }
  const phi = new Float64Array(x + 1);
  for (let i = 0; i <= x; i += 1) phi[i] = i;
  for (let p = 2; p <= x; p += 1) {
    if (phi[p] !== p) continue; // p is composite: already reduced
    for (let m = p; m <= x; m += p) phi[m] -= phi[m] / p;
  }

  let sumTau = 0;
  let sumSigma = 0;
  let sumPhi = 0;
  for (let n = 1; n <= x; n += 1) {
    sumTau += tau[n];
    sumSigma += sigma[n];
    sumPhi += phi[n];
  }

  let lattice = 0;
  const r = Math.floor(Math.sqrt(x));
  for (let a = -r; a <= r; a += 1) lattice += 2 * Math.floor(Math.sqrt(x - a * a)) + 1;

  return {
    ok: true,
    x,
    tau: { average: sumTau / x, prediction: Math.log(x) + 2 * EULER_GAMMA - 1 },
    sigma: { average: sumSigma / x, prediction: (Math.PI ** 2 * x) / 12 },
    phi: { average: sumPhi / x, prediction: (3 * x) / Math.PI ** 2 },
    circle: { average: lattice / x, prediction: Math.PI },
  };
}

const ZETA_EXACT = { 2: Math.PI ** 2 / 6, 4: Math.PI ** 4 / 90, 6: Math.PI ** 6 / 945, 8: Math.PI ** 8 / 9450 };

/**
 * ζ(s) for real s > 1 (§24.2): the partial sum Σ n⁻ˢ, the Euler product
 * ∏ (1 − p⁻ˢ)⁻¹ over p ≤ N (§24.3.2), and the closed form for even s ≤ 8.
 */
export function zetaApproximations(sRaw, NRaw) {
  const s = Number(sRaw);
  const N = parseBigInt(NRaw);
  if (!Number.isFinite(s) || N === null) return fail('invalidInput');
  if (s <= 1 || s > 64) return fail('zetaNeedsS');
  if (N < 2n || N > 1_000_000n) return fail('countingRange', { min: 2, max: 1_000_000 });

  const n = Number(N);
  let partial = 0;
  for (let k = n; k >= 1; k -= 1) partial += k ** -s; // small terms first
  const flags = primeFlags(n);
  let product = 1;
  for (let p = 2; p <= n; p += 1) if (flags[p]) product /= 1 - p ** -s;

  return {
    ok: true,
    s,
    N: n,
    partial,
    product,
    tailBound: n ** (1 - s) / (s - 1),
    exact: ZETA_EXACT[s] ?? null,
  };
}
