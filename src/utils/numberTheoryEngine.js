/**
 * Elementary Number Theory engine.
 *
 * Pure BigInt routines with step-by-step educational derivations.
 *
 * Localisation contract: this module never returns human prose. Explanations
 * come back as `{ key, vars, latex }` records so the UI can render them in the
 * active language; only language-neutral LaTeX is produced here.
 */

/** Trial division gives up after this many candidate divisors. */
const FACTORISATION_BUDGET = 2_000_000n;

/** Upper bound on how many residues the UI is willing to enumerate. */
export const RESIDUE_PREVIEW_LIMIT = 200n;

/** Upper bound on the modular-polynomial brute-force scan. */
export const POLYNOMIAL_SCAN_LIMIT = 5000n;

/**
 * Parse user input into a BigInt.
 * Returns `null` for anything that is not a valid integer, so callers can tell
 * "the user has not finished typing" apart from a legitimate zero.
 */
export function parseBigInt(val) {
  if (typeof val === 'bigint') return val;
  if (typeof val === 'number') return Number.isFinite(val) ? BigInt(Math.trunc(val)) : null;

  const str = String(val ?? '').trim();
  if (!/^[+-]?\d+$/.test(str)) return null;

  try {
    return BigInt(str);
  } catch {
    return null;
  }
}

/** Lenient parse used where a missing value should behave as 0. */
export function toBigInt(val) {
  return parseBigInt(val) ?? 0n;
}

export function abs(n) {
  return n < 0n ? -n : n;
}

/** Sign of a BigInt as a BigInt. */
export function sign(n) {
  if (n > 0n) return 1n;
  if (n < 0n) return -1n;
  return 0n;
}

/** Least non-negative residue of a modulo m (m > 0). */
export function mod(a, m) {
  return ((a % m) + m) % m;
}

/**
 * Floor of sqrt(n) via Newton's method — O(log n) BigInt operations.
 * Replaces the O(sqrt n) scan that used to freeze the UI on large inputs.
 */
export function integerSqrt(n) {
  if (n < 0n) throw new RangeError('integerSqrt of a negative number');
  if (n < 2n) return n;

  // Seed from the bit length so Newton converges in a handful of steps.
  let x = 1n << (BigInt(n.toString(2).length) / 2n + 1n);
  let y = (x + n / x) >> 1n;
  while (y < x) {
    x = y;
    y = (x + n / x) >> 1n;
  }
  return x;
}

export function isPerfectSquare(n) {
  if (n < 0n) return { isSquare: false, root: 0n };
  const r = integerSqrt(n);
  return { isSquare: r * r === n, root: r };
}

/**
 * Greatest Common Divisor via the Euclidean Algorithm, with the division
 * chain recorded for display.
 */
export function gcd(a, b) {
  let x = abs(toBigInt(a));
  let y = abs(toBigInt(b));
  const steps = [];

  while (y !== 0n) {
    const quotient = x / y;
    const remainder = x % y;
    steps.push({
      a: x,
      b: y,
      quotient,
      remainder,
      latex: `${x} = ${quotient} \\cdot ${y} + ${remainder}`,
    });
    x = y;
    y = remainder;
  }

  return { gcd: x, steps };
}

/**
 * Extended Euclidean Algorithm.
 *
 * Guarantees `a*u + b*v == gcd` with `gcd >= 0`. The previous implementation
 * returned `abs(old_r)` as the gcd but left `u`/`v` attached to the *signed*
 * remainder, so for inputs such as (-4, -6) the Bezout identity came back
 * negated — which silently flipped the sign of every Diophantine solution.
 */
export function extGCD(a, b) {
  const origA = toBigInt(a);
  const origB = toBigInt(b);

  let oldR = origA;
  let r = origB;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;

  const steps = [];

  while (r !== 0n) {
    const quotient = oldR / r;

    steps.push({
      r_prev: oldR,
      r_curr: r,
      q: quotient,
      r_next: oldR - quotient * r,
      s_prev: oldS,
      s_curr: s,
      t_prev: oldT,
      t_curr: t,
    });

    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }

  // Normalise so the reported gcd is non-negative and u, v still satisfy it.
  if (oldR < 0n) {
    oldR = -oldR;
    oldS = -oldS;
    oldT = -oldT;
  }

  return {
    gcd: oldR,
    u: oldS,
    v: oldT,
    steps,
    verification: `${origA} \\cdot (${oldS}) + ${origB} \\cdot (${oldT}) = ${oldR}`,
  };
}

/** Least Common Multiple. */
export function lcm(a, b) {
  const x = abs(toBigInt(a));
  const y = abs(toBigInt(b));

  if (x === 0n || y === 0n) {
    return { lcm: 0n, gcd: gcd(x, y).gcd, gcdSteps: [], formula: `\\text{lcm}(${x}, ${y}) = 0` };
  }

  const { gcd: d, steps: gcdSteps } = gcd(x, y);
  const result = (x / d) * y;

  return {
    lcm: result,
    gcd: d,
    gcdSteps,
    formula: `\\operatorname{lcm}(${x}, ${y}) = \\frac{${x} \\cdot ${y}}{\\gcd(${x}, ${y})} = \\frac{${x * y}}{${d}} = ${result}`,
  };
}

/**
 * Modular exponentiation by repeated squaring.
 * Negative exponents are resolved through the modular inverse when it exists,
 * instead of the old behaviour of silently returning 0.
 */
export function modularExponentiation(base, exp, modulus) {
  const m = parseBigInt(modulus);
  const e0 = parseBigInt(exp);
  const b0 = parseBigInt(base);

  if (m === null || e0 === null || b0 === null) return { ok: false, code: 'invalidInput' };
  if (m <= 0n) return { ok: false, code: 'modulusMustBePositive' };
  if (m === 1n) return { ok: true, value: 0n };

  let b = mod(b0, m);
  let e = e0;

  if (e < 0n) {
    const inverse = modInverse(b, m);
    if (!inverse.ok) return { ok: false, code: 'noInverseForNegativeExponent', vars: { a: b0, m } };
    b = inverse.value;
    e = -e;
  }

  let result = 1n;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }

  return { ok: true, value: result };
}

/** Convenience wrapper returning just the residue (0n on error). */
export function modPow(base, exp, modulus) {
  const res = modularExponentiation(base, exp, modulus);
  return res.ok ? res.value : 0n;
}

/** Modular inverse of a modulo m, when gcd(a, m) = 1. */
export function modInverse(a, m) {
  const modulus = toBigInt(m);
  if (modulus <= 0n) return { ok: false, code: 'modulusMustBePositive' };
  if (modulus === 1n) return { ok: true, value: 0n };

  const { gcd: d, u } = extGCD(mod(toBigInt(a), modulus), modulus);
  if (d !== 1n) return { ok: false, code: 'notCoprime', vars: { gcd: d } };

  return { ok: true, value: mod(u, modulus) };
}

/**
 * Miller-Rabin primality test.
 * The first thirteen primes (2 … 41) make it deterministic for
 * n < 3,317,044,064,679,887,385,961,981 ≈ 3.3 · 10^24 (Sorenson & Webster,
 * 2015); beyond that it is a strong probabilistic test. Stopping at 37 only
 * covers n < 3.18 · 10^23, which the old comment overstated.
 */
const MILLER_RABIN_WITNESSES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n];

export function isPrime(value) {
  const n = parseBigInt(value);
  if (n === null || n < 2n) return false;

  for (const p of MILLER_RABIN_WITNESSES) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  let d = n - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r += 1n;
  }

  witness: for (const a of MILLER_RABIN_WITNESSES) {
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    for (let i = 1n; i < r; i += 1n) {
      x = (x * x) % n;
      if (x === n - 1n) continue witness;
    }
    return false;
  }

  return true;
}

/**
 * Canonical prime factorisation plus the classic divisor functions.
 *
 * Trial division is capped by FACTORISATION_BUDGET so pasting a 20-digit
 * semiprime degrades to "could not finish" instead of hanging the popup.
 */
export function primeFactorization(value, { budget = FACTORISATION_BUDGET } = {}) {
  const parsed = parseBigInt(value);
  if (parsed === null) return { ok: false, code: 'invalidInput' };

  const n = abs(parsed);

  if (n === 0n) return { ok: false, code: 'factorizationUndefinedForZero' };
  if (n === 1n) {
    return {
      ok: true,
      n,
      factors: [],
      factorString: '1',
      tau: 1n,
      sigma: 1n,
      mobius: 1n,
      isPrime: false,
      isUnit: true,
      complete: true,
    };
  }

  let temp = n;
  const factors = [];

  const addFactor = (prime, power) => factors.push({ prime, power });

  let twos = 0n;
  while (temp % 2n === 0n) {
    twos += 1n;
    temp /= 2n;
  }
  if (twos > 0n) addFactor(2n, twos);

  let complete = true;

  // Miller-Rabin settles a prime cofactor instantly. Without this the loop
  // grinds all the way to FACTORISATION_BUDGET and then reports "too large"
  // for an ordinary large prime whose factorisation is simply itself.
  if (temp > 1n && isPrime(temp)) {
    addFactor(temp, 1n);
    temp = 1n;
  }

  for (let d = 3n; temp > 1n && d * d <= temp; d += 2n) {
    if (d > budget) {
      complete = false;
      break;
    }
    if (temp % d === 0n) {
      let power = 0n;
      while (temp % d === 0n) {
        power += 1n;
        temp /= d;
      }
      addFactor(d, power);

      // The remaining cofactor is larger than every factor found so far, so
      // appending it here keeps `factors` in ascending order.
      if (temp > 1n && isPrime(temp)) {
        addFactor(temp, 1n);
        temp = 1n;
      }
    }
  }

  if (complete && temp > 1n) {
    addFactor(temp, 1n);
    temp = 1n;
  }

  if (!complete) {
    return {
      ok: false,
      code: 'factorizationTooLarge',
      n,
      partialFactors: factors,
      remainingCofactor: temp,
    };
  }

  let tau = 1n;
  let sigma = 1n;
  let mobiusValue = 1n;

  for (const { prime: p, power: k } of factors) {
    tau *= k + 1n;
    sigma *= (p ** (k + 1n) - 1n) / (p - 1n);
    mobiusValue = k > 1n ? 0n : -mobiusValue;
  }

  const factorString = factors
    .map((f) => (f.power === 1n ? `${f.prime}` : `${f.prime}^{${f.power}}`))
    .join(' \\cdot ');

  return {
    ok: true,
    n,
    factors,
    factorString,
    tau,
    sigma,
    mobius: mobiusValue,
    isPrime: factors.length === 1 && factors[0].power === 1n,
    isUnit: false,
    complete: true,
  };
}

/** Möbius function μ(n): 0 if n is not squarefree, else (-1)^(number of primes). */
export function mobius(value, options) {
  const factorisation = primeFactorization(value, options);
  if (!factorisation.ok) return { ok: false, code: factorisation.code };
  return { ok: true, value: factorisation.mobius, isSquarefree: factorisation.mobius !== 0n };
}

/** All positive divisors of n, ascending. Capped for display sanity. */
export function divisorsOf(value, limit = 512, options) {
  const factorisation = primeFactorization(value, options);
  if (!factorisation.ok) return { ok: false, code: factorisation.code };

  let divisors = [1n];
  for (const { prime: p, power: k } of factorisation.factors) {
    const next = [];
    let pPow = 1n;
    for (let i = 0n; i <= k; i += 1n) {
      for (const d of divisors) next.push(d * pPow);
      pPow *= p;
    }
    divisors = next;
  }

  divisors.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));

  return {
    ok: true,
    divisors: divisors.slice(0, limit),
    total: BigInt(divisors.length),
    truncated: divisors.length > limit,
  };
}

/** Solves the linear Diophantine equation a·x + b·y = c. */
export function solveDiophantine(aRaw, bRaw, cRaw) {
  const a = parseBigInt(aRaw);
  const b = parseBigInt(bRaw);
  const c = parseBigInt(cRaw);

  if (a === null || b === null || c === null) return { hasSolution: false, code: 'invalidInput' };

  if (a === 0n && b === 0n) {
    return c === 0n
      ? { hasSolution: true, isDegenerate: true, code: 'everyPairIsASolution' }
      : { hasSolution: false, code: 'zeroCoefficientsNoSolution' };
  }

  const { gcd: d, u, v, steps: extSteps } = extGCD(a, b);

  if (c % d !== 0n) {
    return {
      hasSolution: false,
      gcd: d,
      code: 'gcdDoesNotDivideC',
      vars: { a, b, c, d },
      latex: `\\gcd(${a}, ${b}) = ${d} \\nmid ${c}`,
    };
  }

  const k = c / d;
  const x0 = u * k;
  const y0 = v * k;
  const xStep = b / d;
  const yStep = -a / d;

  // "+ -3t" reads badly; fold the sign into the term.
  const signedTerm = (coefficient) =>
    `${coefficient < 0n ? '-' : '+'} ${abs(coefficient)}t`;

  const steps = [
    { key: 'diophantine.step1', vars: { a, b, d }, latex: `d = \\gcd(${a}, ${b}) = ${d}` },
    { key: 'diophantine.step2', vars: { d, c }, latex: `${d} \\mid ${c}, \\quad ${c} = ${d} \\cdot ${k}` },
    { key: 'diophantine.step3', vars: {}, latex: `${a}(${u}) + ${b}(${v}) = ${d}` },
    { key: 'diophantine.step4', vars: { k }, latex: `${a}(${x0}) + ${b}(${y0}) = ${c}` },
    { key: 'diophantine.step5', vars: {}, latex: `x_0 = ${x0}, \\quad y_0 = ${y0}` },
    { key: 'diophantine.step6', vars: {}, latex: null },
  ];

  const sampleSolutions = [];
  for (let t = -2n; t <= 2n; t += 1n) {
    sampleSolutions.push({ t, x: x0 + xStep * t, y: y0 + yStep * t });
  }

  return {
    hasSolution: true,
    gcd: d,
    x0,
    y0,
    xStep,
    yStep,
    steps,
    generalX: `x(t) = ${x0} ${signedTerm(xStep)}`,
    generalY: `y(t) = ${y0} ${signedTerm(yStep)}`,
    sampleSolutions,
    extSteps,
  };
}

/** Solves the linear congruence a·x ≡ b (mod m). */
export function solveLinearCongruence(aRaw, bRaw, mRaw) {
  const aIn = parseBigInt(aRaw);
  const bIn = parseBigInt(bRaw);
  const m = parseBigInt(mRaw);

  if (aIn === null || bIn === null || m === null) return { hasSolution: false, code: 'invalidInput' };
  if (m <= 0n) return { hasSolution: false, code: 'modulusMustBePositive' };
  if (m === 1n) {
    return {
      hasSolution: true,
      gcd: 1n,
      numSolutions: 1n,
      baseSolution: 0n,
      incongruentSolutions: [0n],
      reducedEquation: 'x \\equiv 0 \\pmod{1}',
      explanation: [{ key: 'congruence.trivialModulus', vars: {}, latex: null }],
    };
  }

  const a = mod(aIn, m);
  const b = mod(bIn, m);

  const { gcd: d } = extGCD(a, m);

  if (b % d !== 0n) {
    return {
      hasSolution: false,
      gcd: d,
      code: 'gcdDoesNotDivideB',
      vars: { a, m, d, b },
      latex: `\\gcd(${a}, ${m}) = ${d} \\nmid ${b}`,
    };
  }

  const a1 = a / d;
  const b1 = b / d;
  const m1 = m / d;

  const inverse = modInverse(a1, m1);
  if (!inverse.ok) return { hasSolution: false, code: 'invalidInput' };

  const baseSolution = mod(inverse.value * b1, m1);

  const incongruentSolutions = [];
  for (let j = 0n; j < d; j += 1n) {
    incongruentSolutions.push(mod(baseSolution + j * m1, m));
  }

  return {
    hasSolution: true,
    gcd: d,
    numSolutions: d,
    reducedEquation: `${a1}x \\equiv ${b1} \\pmod{${m1}}`,
    baseSolution,
    modulusOfBase: m1,
    incongruentSolutions,
    explanation: [
      { key: 'congruence.step1', vars: { a, m, d }, latex: `d = \\gcd(${a}, ${m}) = ${d}` },
      { key: 'congruence.step2', vars: { d, b }, latex: `${d} \\mid ${b}` },
      { key: 'congruence.step3', vars: { d }, latex: `${a1}x \\equiv ${b1} \\pmod{${m1}}` },
      {
        key: 'congruence.step4',
        vars: { a: a1, m: m1 },
        latex: `${a1}^{-1} \\equiv ${mod(inverse.value, m1)} \\pmod{${m1}}`,
      },
      { key: 'congruence.step5', vars: {}, latex: `x \\equiv ${baseSolution} \\pmod{${m1}}` },
      {
        key: 'congruence.step6',
        vars: { count: d, m },
        latex: `x \\in \\{${incongruentSolutions.join(', ')}\\} \\pmod{${m}}`,
      },
    ],
  };
}

/** Euler's totient φ(n), with complete and reduced residue systems. */
export function computeEulerPhi(
  value,
  { previewLimit = RESIDUE_PREVIEW_LIMIT, budget } = {}
) {
  const parsed = parseBigInt(value);
  if (parsed === null) return { ok: false, code: 'invalidInput' };

  const n = parsed;
  if (n <= 0n) return { ok: false, code: 'requiresPositiveInteger' };

  if (n === 1n) {
    return {
      ok: true,
      n,
      phi: 1n,
      factors: [],
      crs: [0n],
      rrs: [0n],
      truncated: false,
      previewLimit: 1n,
      formula: '\\varphi(1) = 1',
    };
  }

  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code };

  let phi = n;
  for (const { prime: p } of factorisation.factors) {
    phi = (phi / p) * (p - 1n);
  }

  // Enumerating residues is O(n); only preview a prefix for large n.
  const previewWindow = previewLimit > 0n ? previewLimit : RESIDUE_PREVIEW_LIMIT;
  const truncated = n > previewWindow;
  const shownLimit = truncated ? previewWindow : n;

  const crs = [];
  const rrs = [];
  for (let i = 0n; i < shownLimit; i += 1n) {
    crs.push(i);
    if (gcd(i, n).gcd === 1n) rrs.push(i);
  }

  const productTerms = factorisation.factors
    .map(({ prime: p }) => `\\left(1 - \\frac{1}{${p}}\\right)`)
    .join('');

  return {
    ok: true,
    n,
    phi,
    factors: factorisation.factors,
    crs,
    rrs,
    truncated,
    previewLimit: shownLimit,
    formula: `\\varphi(${n}) = ${n} ${productTerms} = ${phi}`,
  };
}

/** Roots of a₅x⁵ + … + a₀ ≡ b (mod m); `coeffs[i]` is the coefficient of xⁱ. */
export function solveModularPolynomial(
  coeffs,
  bRaw,
  mRaw,
  { scanLimit: requestedScan = POLYNOMIAL_SCAN_LIMIT } = {}
) {
  const m = parseBigInt(mRaw);
  const b = parseBigInt(bRaw);

  if (m === null || b === null) return { ok: false, code: 'invalidInput' };
  if (m <= 0n) return { ok: false, code: 'modulusMustBePositive' };

  const parsedCoeffs = coeffs.map((c) => parseBigInt(c));
  if (parsedCoeffs.some((c) => c === null)) return { ok: false, code: 'invalidInput' };

  const reduced = parsedCoeffs.map((c) => mod(c, m));
  const target = mod(b, m);

  const scanWindow = requestedScan > 0n ? requestedScan : POLYNOMIAL_SCAN_LIMIT;
  const truncated = m > scanWindow;
  const scanLimit = truncated ? scanWindow : m;

  const roots = [];
  const evaluations = [];

  for (let x = 0n; x < scanLimit; x += 1n) {
    // Horner's rule: one multiply-add per coefficient instead of a nested loop.
    let val = 0n;
    for (let i = reduced.length - 1; i >= 0; i -= 1) {
      val = (val * x + reduced[i]) % m;
    }

    const isRoot = val === target;
    if (isRoot) roots.push(x);
    evaluations.push({ x, val, isRoot });
  }

  return {
    ok: true,
    roots,
    evaluations,
    scanned: scanLimit,
    modulus: m,
    target,
    truncated,
  };
}

/**
 * Chinese Remainder Theorem for systems cᵢx ≡ aᵢ (mod mᵢ).
 *
 * - A row with a coefficient cᵢ ≠ 1 is first solved on its own and replaced by
 *   x ≡ aᵢ' (mod mᵢ'), then combined (NTIC §5.5.2, Example 5.5.1).
 * - Pairwise coprime moduli use the classical Mᵢyᵢ construction (NTIC §5.3–5.4).
 * - Otherwise congruences are merged two at a time. A pair is compatible
 *   exactly when gcd(mᵢ, mⱼ) | aⱼ − aᵢ, and the answer is unique modulo the
 *   lcm (NTIC §5.5.1, the Qin / Lebesgue condition).
 */
export function solveCRT(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { hasSolution: false, code: 'noCongruences' };
  }

  const parsed = [];
  const reductions = [];

  for (const [index, item] of items.entries()) {
    const a = parseBigInt(item.a);
    const m = parseBigInt(item.m);
    // Older history entries have no coefficient field; treat it as 1.
    const c = item.c === undefined || item.c === '' ? 1n : parseBigInt(item.c);
    if (a === null || m === null || c === null) return { hasSolution: false, code: 'invalidInput' };
    if (m <= 0n) return { hasSolution: false, code: 'modulusMustBePositive' };

    if (mod(c, m) === mod(1n, m)) {
      parsed.push({ a, m });
      continue;
    }

    const single = solveLinearCongruence(c, a, m);
    if (!single.hasSolution) {
      return {
        hasSolution: false,
        code: 'crtRowUnsolvable',
        vars: { row: index + 1, c, a, m, d: single.gcd ?? 0n },
        latex: `\\gcd(${c}, ${m}) = ${single.gcd} \\nmid ${a}`,
      };
    }

    const reducedModulus = single.modulusOfBase ?? 1n;
    reductions.push({
      row: index + 1,
      c,
      a,
      m,
      reducedA: single.baseSolution,
      reducedM: reducedModulus,
      latex: `${c}x \\equiv ${a} \\pmod{${m}} \\iff x \\equiv ${single.baseSolution} \\pmod{${reducedModulus}}`,
    });
    parsed.push({ a: single.baseSolution, m: reducedModulus });
  }

  let pairwiseCoprime = true;
  for (let i = 0; i < parsed.length && pairwiseCoprime; i += 1) {
    for (let j = i + 1; j < parsed.length; j += 1) {
      if (gcd(parsed[i].m, parsed[j].m).gcd !== 1n) {
        pairwiseCoprime = false;
        break;
      }
    }
  }

  if (!pairwiseCoprime) return mergeCongruences(parsed, reductions);

  const M = parsed.reduce((acc, item) => acc * item.m, 1n);

  let x = 0n;
  const terms = [];

  for (const item of parsed) {
    const Mi = M / item.m;
    const inverse = modInverse(Mi, item.m);
    if (!inverse.ok) return { hasSolution: false, code: 'invalidInput' };

    const yi = inverse.value;
    x = mod(x + item.a * Mi * yi, M);

    terms.push({
      ai: item.a,
      mi: item.m,
      Mi,
      yi,
      term: `${item.a} \\cdot ${Mi} \\cdot ${yi}`,
    });
  }

  return {
    hasSolution: true,
    method: 'classical',
    x,
    M,
    terms,
    reductions,
    mergeSteps: [],
    solutionString: `x \\equiv ${x} \\pmod{${M}}`,
  };
}

/** Fold x ≡ aᵢ (mod mᵢ) together pairwise when the moduli share factors. */
function mergeCongruences(parsed, reductions) {
  let r = mod(parsed[0].a, parsed[0].m);
  let M = parsed[0].m;
  const mergeSteps = [];

  for (const { a, m } of parsed.slice(1)) {
    const g = gcd(M, m).gcd;
    const difference = a - r;

    if (difference % g !== 0n) {
      return {
        hasSolution: false,
        code: 'crtIncompatible',
        vars: { m1: M, m2: m, gcd: g, a1: r, a2: mod(a, m) },
        latex: `\\gcd(${M}, ${m}) = ${g} \\nmid ${mod(a, m)} - ${r}`,
        reductions,
      };
    }

    // r + M·t ≡ a (mod m)  ⇔  (M/g)·t ≡ (a − r)/g (mod m/g)
    const reducedModulus = m / g;
    const inverse = modInverse(M / g, reducedModulus);
    const t = reducedModulus === 1n ? 0n : mod((difference / g) * inverse.value, reducedModulus);
    const nextM = (M / g) * m;
    const nextR = mod(r + M * t, nextM);

    mergeSteps.push({
      r,
      M,
      a: mod(a, m),
      m,
      gcd: g,
      t,
      result: nextR,
      modulus: nextM,
      latex: `x = ${r} + ${M}t,\\; ${M}t \\equiv ${mod(a, m)} - ${r} \\pmod{${m}} \\implies t \\equiv ${t} \\implies x \\equiv ${nextR} \\pmod{${nextM}}`,
    });

    r = nextR;
    M = nextM;
  }

  return {
    hasSolution: true,
    method: 'merged',
    x: r,
    M,
    terms: [],
    reductions,
    mergeSteps,
    solutionString: `x \\equiv ${r} \\pmod{${M}}`,
  };
}

/**
 * Multiplicative order ord_m(a).
 *
 * Walks the divisors of φ(m) rather than multiplying up one step at a time:
 * the old linear loop needed φ(m) iterations (hanging the UI for large m) and
 * returned φ(m)+1 for m = 1, where every element is already the identity.
 */
export function findOrder(aRaw, mRaw, { budget } = {}) {
  const a = parseBigInt(aRaw);
  const m = parseBigInt(mRaw);

  if (a === null || m === null) return { exists: false, code: 'invalidInput' };
  if (m <= 0n) return { exists: false, code: 'modulusMustBePositive' };
  if (m === 1n) return { exists: true, order: 1n, phi: 1n, isPrimitiveRoot: true, isTrivial: true };

  const d = gcd(a, m).gcd;
  if (d !== 1n) {
    return { exists: false, code: 'orderRequiresCoprime', vars: { a, m, gcd: d } };
  }

  const phiResult = computeEulerPhi(m, { budget });
  if (!phiResult.ok) return { exists: false, code: phiResult.code };

  const phi = phiResult.phi;
  const divisorResult = divisorsOf(phi, Number.MAX_SAFE_INTEGER, { budget });
  if (!divisorResult.ok) return { exists: false, code: divisorResult.code };

  const base = mod(a, m);
  for (const candidate of divisorResult.divisors) {
    if (modPow(base, candidate, m) === 1n) {
      return {
        exists: true,
        order: candidate,
        phi,
        isPrimitiveRoot: candidate === phi,
        isTrivial: false,
      };
    }
  }

  // Unreachable for coprime a: ord always divides φ(m).
  return { exists: false, code: 'orderNotFound' };
}

/**
 * Jacobi symbol (a/n) for odd n > 0, by quadratic reciprocity.
 * Equals the Legendre symbol when n is prime.
 */
export function jacobiSymbol(aRaw, nRaw) {
  let a = parseBigInt(aRaw);
  let n = parseBigInt(nRaw);

  if (a === null || n === null) return { ok: false, code: 'invalidInput' };
  if (n <= 0n || n % 2n === 0n) return { ok: false, code: 'jacobiRequiresOddPositive' };

  a = mod(a, n);
  let result = 1;

  while (a !== 0n) {
    while (a % 2n === 0n) {
      a /= 2n;
      const r = n % 8n;
      // (2/n) = -1 when n ≡ 3 or 5 (mod 8)
      if (r === 3n || r === 5n) result = -result;
    }

    [a, n] = [n, a];

    // Reciprocity flips the sign when both are ≡ 3 (mod 4)
    if (a % 4n === 3n && n % 4n === 3n) result = -result;

    a = mod(a, n);
  }

  return { ok: true, value: n === 1n ? result : 0 };
}

/**
 * Legendre symbol (a/p) for an odd prime p, via Euler's criterion.
 *
 * The modulus is now verified prime first. Previously any odd p was accepted
 * and a^((p-1)/2) mod p was reported as ±1, so a composite modulus produced a
 * confidently wrong "quadratic non-residue" verdict.
 */
export function legendreSymbol(aRaw, pRaw) {
  const a = parseBigInt(aRaw);
  const p = parseBigInt(pRaw);

  if (a === null || p === null) return { ok: false, code: 'invalidInput' };
  if (p < 3n) return { ok: false, code: 'legendreRequiresOddPrime', vars: { p } };
  if (p % 2n === 0n) return { ok: false, code: 'legendreRequiresOddPrime', vars: { p } };
  if (!isPrime(p)) return { ok: false, code: 'legendreModulusNotPrime', vars: { p } };

  const aReduced = mod(a, p);

  if (aReduced === 0n) {
    return {
      ok: true,
      value: 0,
      status: 'divisible',
      symbol: `\\left(\\frac{${a}}{${p}}\\right) = 0`,
      criterion: `${p} \\mid ${a}`,
    };
  }

  const criterionValue = modPow(aReduced, (p - 1n) / 2n, p);
  const value = criterionValue === 1n ? 1 : -1;

  // Enumerating a square root makes the verdict tangible for small p.
  let squareRoot = null;
  if (value === 1 && p <= 100_000n) {
    for (let x = 1n; x <= (p - 1n) / 2n; x += 1n) {
      if ((x * x) % p === aReduced) {
        squareRoot = x;
        break;
      }
    }
  }

  return {
    ok: true,
    value,
    status: value === 1 ? 'residue' : 'nonResidue',
    symbol: `\\left(\\frac{${a}}{${p}}\\right) = ${value === 1 ? '+1' : '-1'}`,
    criterion: `${aReduced}^{\\frac{${p} - 1}{2}} = ${aReduced}^{${(p - 1n) / 2n}} \\equiv ${criterionValue} \\pmod{${p}}`,
    squareRoot,
    reducedA: aReduced,
  };
}

/**
 * Fermat probable-prime test to base a.
 * Passing is *not* a proof of primality — Carmichael numbers pass for every
 * coprime base — so the outcome is reported as one of three distinct states.
 */
export function fermatTest(aRaw, nRaw) {
  const a = parseBigInt(aRaw);
  const n = parseBigInt(nRaw);

  if (a === null || n === null) return { ok: false, code: 'invalidInput' };
  if (n < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };

  const base = mod(a, n);
  const d = gcd(base, n).gcd;

  if (d !== 1n) {
    return { ok: true, outcome: 'notCoprime', residue: null, gcd: d, isActuallyPrime: isPrime(n) };
  }

  const residue = modPow(base, n - 1n, n);
  const passes = residue === 1n;
  const actuallyPrime = isPrime(n);

  return {
    ok: true,
    outcome: passes ? (actuallyPrime ? 'probablePrime' : 'pseudoprime') : 'composite',
    residue,
    gcd: d,
    isActuallyPrime: actuallyPrime,
  };
}

/* ==========================================================================
 * Additions mapped to Crisman, "Number Theory: In Context and Interactive"
 * (2024 ed., CC BY-ND 4.0). Section numbers (§) refer to that book; the full
 * provenance log is docs/BOOK_SOURCES.md. Algorithms are re-implemented from
 * the mathematics — no text or code from the book is copied.
 * ========================================================================== */

/** Most roots/elements any enumeration below will list. Counts stay exact. */
export const ROOT_LIST_LIMIT = 512;

/** (n − 1)! mod n costs n multiplications, so Wilson's test is capped. */
export const WILSON_LIMIT = 200_000n;

/** Baby-step giant-step stores √order residues; keep that table small. */
export const INDEX_ORDER_LIMIT = 10_000_000_000n;

/** Primitive roots are enumerated in full only when φ(n) is this small. */
export const PRIMITIVE_ROOT_ENUMERATION_LIMIT = 100_000n;

/** Exhaustive strong-liar counts (Theorem 12.4.6) only for small n. */
export const STRONG_LIAR_LIMIT = 10_000n;

const compareBigInt = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
const sortBigInts = (list) => [...list].sort(compareBigInt);

/** φ(n) and the factorisation of n, without enumerating any residues. */
function totientOf(n, budget) {
  if (n === 1n) return { ok: true, phi: 1n, factors: [] };
  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code, vars: { n: factorisation.n } };

  let phi = n;
  for (const { prime: p } of factorisation.factors) phi = (phi / p) * (p - 1n);
  return { ok: true, phi, factors: factorisation.factors };
}

/** Distinct prime divisors of n (n ≥ 1). */
function primeDivisorsOf(n, budget) {
  if (n === 1n) return { ok: true, primes: [] };
  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code, vars: { n: factorisation.n } };
  return { ok: true, primes: factorisation.factors.map((f) => f.prime) };
}

/** Combine x ≡ r (mod M) and x ≡ s (mod m) for coprime M, m. */
function crtPair(r, M, s, m) {
  if (M === 1n) return mod(s, m);
  const inverse = modInverse(mod(M, m), m).value;
  return mod(r + M * mod((s - r) * inverse, m), M * m);
}

/** Every combination of per-modulus residues, merged by CRT (coprime moduli). */
function combineResidues(components) {
  let roots = [0n];
  let M = 1n;
  for (const { modulus, roots: local } of components) {
    const next = [];
    for (const r of roots) for (const s of local) next.push(crtPair(r, M, s, modulus));
    roots = next;
    M *= modulus;
  }
  return sortBigInts(roots);
}

/** Horner evaluation of Σ coeffs[i]·xⁱ, reduced mod m when m is given. */
function evaluatePolynomial(coeffs, x, m) {
  let value = 0n;
  for (let i = coeffs.length - 1; i >= 0; i -= 1) {
    value = value * x + coeffs[i];
    if (m) value %= m;
  }
  return m ? mod(value, m) : value;
}

const derivativeOf = (coeffs) => coeffs.slice(1).map((c, i) => c * BigInt(i + 1));

/* --------------------------------------------------------------------------
 * §7.2 Prime power congruences — Hensel's Lemma (Theorem 7.2.3, Remark 7.2.7)
 * and solving modulo composite n by prime powers + CRT (Fact 7.2.2,
 * Algorithm 16.1.5).
 * ------------------------------------------------------------------------ */

/**
 * Roots of f(x) ≡ b (mod pᵉ), lifted one power of p at a time.
 *
 * From a root r mod pᵏ⁻¹, a lift r + t·pᵏ⁻¹ needs
 *   f(r)/pᵏ⁻¹ + t·f′(r) ≡ 0 (mod p).
 * If p ∤ f′(r) there is exactly one t. If p | f′(r), either every t works
 * (when pᵏ | f(r)) or none does.
 */
export function henselLift(
  coeffsRaw,
  bRaw,
  pRaw,
  eRaw,
  { scanLimit = POLYNOMIAL_SCAN_LIMIT, rootLimit = ROOT_LIST_LIMIT } = {}
) {
  const p = parseBigInt(pRaw);
  const e = parseBigInt(eRaw);
  const b = parseBigInt(bRaw);
  const coeffs = (coeffsRaw ?? []).map((c) => parseBigInt(c));

  if (p === null || e === null || b === null || coeffs.some((c) => c === null)) {
    return { ok: false, code: 'invalidInput' };
  }
  if (!isPrime(p)) return { ok: false, code: 'henselRequiresPrime', vars: { p } };
  if (e < 1n) return { ok: false, code: 'henselRequiresPositiveExponent' };
  if (p > scanLimit) return { ok: false, code: 'henselPrimeTooLarge', vars: { p, limit: scanLimit } };

  // Work with g(x) = f(x) − b so every congruence reads g(x) ≡ 0.
  const g = coeffs.length > 0 ? [coeffs[0] - b, ...coeffs.slice(1)] : [-b];
  const dg = derivativeOf(g);

  let roots = [];
  for (let x = 0n; x < p; x += 1n) {
    if (evaluatePolynomial(g, x, p) === 0n) roots.push(x);
  }

  const levels = [{ exponent: 1n, modulus: p, roots: [...roots] }];
  const steps = [];
  let previousModulus = p;

  for (let k = 2n; k <= e; k += 1n) {
    const modulus = previousModulus * p;
    const next = [];

    for (const r of roots) {
      const quotient = evaluatePolynomial(g, r, modulus) / previousModulus; // in [0, p)
      const slope = evaluatePolynomial(dg, r, p);

      if (slope !== 0n) {
        const t = mod(-quotient * modInverse(slope, p).value, p);
        const lifted = r + t * previousModulus;
        next.push(lifted);
        steps.push({
          exponent: k,
          from: r,
          kind: 'unique',
          t,
          to: [lifted],
          latex: `\\tfrac{f(${r})}{${p}^{${k - 1n}}} + t\\,f'(${r}) \\equiv ${quotient} + ${slope}t \\equiv 0 \\pmod{${p}} \\implies t = ${t},\\; x = ${r} + ${t} \\cdot ${previousModulus} = ${lifted}`,
        });
      } else if (quotient === 0n) {
        const lifts = [];
        for (let t = 0n; t < p; t += 1n) lifts.push(r + t * previousModulus);
        next.push(...lifts);
        steps.push({
          exponent: k,
          from: r,
          kind: 'all',
          to: lifts,
          latex: `${p} \\mid f'(${r}) \\text{ and } ${p}^{${k}} \\mid f(${r}) \\implies x = ${r} + t \\cdot ${previousModulus},\\; t = 0, \\dots, ${p - 1n}`,
        });
      } else {
        steps.push({
          exponent: k,
          from: r,
          kind: 'none',
          to: [],
          latex: `${p} \\mid f'(${r}) \\text{ but } ${p}^{${k}} \\nmid f(${r}) \\implies \\text{no lift}`,
        });
      }

      if (next.length > rootLimit) {
        return { ok: false, code: 'tooManyRoots', vars: { limit: rootLimit, m: modulus } };
      }
    }

    roots = sortBigInts(next);
    levels.push({ exponent: k, modulus, roots: [...roots] });
    previousModulus = modulus;
  }

  return { ok: true, prime: p, exponent: e, modulus: previousModulus, roots, levels, steps };
}

/**
 * f(x) ≡ b (mod m) through the factorisation of m: Hensel on each prime power,
 * then the Chinese Remainder Theorem. The number of roots is the product of
 * the per-prime-power counts (Fact 7.2.2).
 */
export function solvePolynomialByPrimePowers(
  coeffsRaw,
  bRaw,
  mRaw,
  { scanLimit = POLYNOMIAL_SCAN_LIMIT, rootLimit = ROOT_LIST_LIMIT, budget } = {}
) {
  const m = parseBigInt(mRaw);
  if (m === null) return { ok: false, code: 'invalidInput' };
  if (m < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };

  const factorisation = primeFactorization(m, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code, vars: { n: factorisation.n } };

  const components = [];
  for (const { prime, power } of factorisation.factors) {
    const lift = henselLift(coeffsRaw, bRaw, prime, power, { scanLimit, rootLimit });
    if (!lift.ok) return { ok: false, code: lift.code, vars: lift.vars };
    components.push({
      prime,
      power,
      modulus: lift.modulus,
      roots: lift.roots,
      levels: lift.levels,
      steps: lift.steps,
    });
  }

  const count = components.reduce((acc, c) => acc * BigInt(c.roots.length), 1n);
  const roots = count <= BigInt(rootLimit) ? combineResidues(components) : null;

  return {
    ok: true,
    modulus: m,
    factorString: factorisation.factorString,
    components,
    count,
    roots,
    truncated: roots === null,
  };
}

/* --------------------------------------------------------------------------
 * §7.5.1 Wilson's Theorem (Theorem 7.5.1)
 * ------------------------------------------------------------------------ */

/**
 * (n − 1)! mod n. It is ≡ −1 exactly when n is prime (Wilson, with the
 * converse from Exercise 7.7.7). For small primes the inverse pairs a·a⁻¹ ≡ 1
 * that make the proof work are listed too.
 */
export function wilsonTest(nRaw, { pairLimit = 60n } = {}) {
  const n = parseBigInt(nRaw);
  if (n === null) return { ok: false, code: 'invalidInput' };
  if (n < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };
  if (n > WILSON_LIMIT) return { ok: false, code: 'wilsonTooLarge', vars: { limit: WILSON_LIMIT } };

  let residue = 1n % n;
  for (let k = 2n; k < n && residue !== 0n; k += 1n) residue = (residue * k) % n;

  const isMinusOne = residue === n - 1n;

  const pairs = [];
  if (isMinusOne && n <= pairLimit) {
    for (let a = 2n; a < n - 1n; a += 1n) {
      const inverse = modInverse(a, n).value;
      if (a < inverse) pairs.push([a, inverse]);
    }
  }

  return {
    ok: true,
    n,
    residue,
    isMinusOne,
    isPrime: isMinusOne,
    pairs,
    latex: `(${n} - 1)! = ${n - 1n}! \\equiv ${isMinusOne && n > 2n ? '-1' : residue} \\pmod{${n}}`,
  };
}

/* --------------------------------------------------------------------------
 * §12.2–12.4 Pseudoprimes, Korselt's criterion, Miller's test and strong
 * pseudoprimes (Algorithm 12.3.3, Definition 12.4.1, Theorem 12.4.6).
 * ------------------------------------------------------------------------ */

/**
 * Korselt: a composite n is a Carmichael number exactly when it is squarefree
 * and p − 1 | n − 1 for every prime p | n (Proposition 12.2.10).
 */
export function korseltTest(nRaw, { budget } = {}) {
  const n = parseBigInt(nRaw);
  if (n === null) return { ok: false, code: 'invalidInput' };
  if (n < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };

  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code, vars: { n: factorisation.n } };

  const rows = factorisation.factors.map(({ prime, power }) => ({
    prime,
    power,
    pMinusOne: prime - 1n,
    divides: (n - 1n) % (prime - 1n) === 0n,
  }));

  const squarefree = rows.every((row) => row.power === 1n);
  const allDivide = rows.every((row) => row.divides);

  let verdict;
  if (factorisation.isPrime) verdict = 'prime';
  else if (!squarefree) verdict = 'notSquarefree';
  else if (!allDivide) verdict = 'divisibilityFails';
  else verdict = 'carmichael';

  return {
    ok: true,
    n,
    factorString: factorisation.factorString,
    rows,
    squarefree,
    isCarmichael: verdict === 'carmichael',
    verdict,
  };
}

/** Miller's test without the step log, for counting bases. */
function passesMiller(base, n) {
  let exponent = (n - 1n) / 2n;
  for (;;) {
    const residue = modPow(base, exponent, n);
    if (residue === n - 1n) return true;
    if (residue !== 1n) return false;
    if (exponent % 2n === 1n) return true;
    exponent /= 2n;
  }
}

/**
 * Miller's test base a, in the book's top-down order: start at a^((n−1)/2),
 * stop on −1 (pass) or anything other than ±1 (fail), and keep halving the
 * exponent while the power is +1 and the exponent is even (Algorithm 12.3.3).
 * A composite that passes is a strong pseudoprime base a (Definition 12.4.1).
 */
export function millerTest(aRaw, nRaw) {
  const a = parseBigInt(aRaw);
  const n = parseBigInt(nRaw);

  if (a === null || n === null) return { ok: false, code: 'invalidInput' };
  if (n < 3n || n % 2n === 0n) return { ok: false, code: 'millerRequiresOdd' };

  const base = mod(a, n);
  if (base === 0n || base === 1n || base === n - 1n) {
    return { ok: false, code: 'millerTrivialBase', vars: { a, n } };
  }

  const steps = [];
  let exponent = (n - 1n) / 2n;
  let passes;

  for (;;) {
    const residue = modPow(base, exponent, n);
    const isMinusOne = residue === n - 1n;

    let verdict;
    if (isMinusOne) verdict = 'pass';
    else if (residue !== 1n) verdict = 'fail';
    else if (exponent % 2n === 1n) verdict = 'pass';
    else verdict = 'continue';

    steps.push({
      exponent,
      residue,
      verdict,
      latex: `${base}^{${exponent}} \\equiv ${isMinusOne ? '-1' : residue} \\pmod{${n}}`,
    });

    if (verdict !== 'continue') {
      passes = verdict === 'pass';
      break;
    }
    exponent /= 2n;
  }

  const actuallyPrime = isPrime(n);

  return {
    ok: true,
    n,
    base,
    passes,
    steps,
    gcd: gcd(base, n).gcd,
    isActuallyPrime: actuallyPrime,
    outcome: passes ? (actuallyPrime ? 'probablePrime' : 'strongPseudoprime') : 'composite',
  };
}

/**
 * How many bases 1 ≤ a ≤ n − 1 let an odd composite n pass Miller's test.
 * Theorem 12.4.6 bounds this by (n − 1)/4, which is what makes repeated
 * random bases (Miller–Rabin, Algorithm 12.4.7) trustworthy.
 */
export function countStrongLiars(nRaw) {
  const n = parseBigInt(nRaw);
  if (n === null) return { ok: false, code: 'invalidInput' };
  if (n < 3n || n % 2n === 0n) return { ok: false, code: 'millerRequiresOdd' };
  if (n > STRONG_LIAR_LIMIT) return { ok: false, code: 'liarCountTooLarge', vars: { limit: STRONG_LIAR_LIMIT } };
  if (isPrime(n)) return { ok: true, n, isPrime: true, liars: [], count: n - 1n, bound: (n - 1n) / 4n };

  const liars = [];
  for (let a = 1n; a < n; a += 1n) {
    if (a === 1n || a === n - 1n || passesMiller(a, n)) liars.push(a);
  }

  return { ok: true, n, isPrime: false, liars, count: BigInt(liars.length), bound: (n - 1n) / 4n };
}

/* --------------------------------------------------------------------------
 * §10 Primitive roots: existence (§10.3, §10.7), the test lemma
 * (Lemma 10.2.3), counting them (Fact 10.3.6), and indices / discrete
 * logarithms for solving xᵏ ≡ a and bˣ ≡ a (§10.5).
 * ------------------------------------------------------------------------ */

/**
 * Uₙ is cyclic exactly for n = 1, 2, 4, pᵏ and 2pᵏ with p an odd prime
 * (§10.3 for powers of two, §10.7 for the full statement).
 */
export function primitiveRootExistence(nRaw, { budget } = {}) {
  const n = parseBigInt(nRaw);
  if (n === null) return { ok: false, code: 'invalidInput' };
  if (n < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };

  if (n === 2n || n === 4n) return { ok: true, n, exists: true, form: 'small' };

  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code, vars: { n: factorisation.n } };

  const twos = factorisation.factors.find((f) => f.prime === 2n)?.power ?? 0n;
  const oddFactors = factorisation.factors.filter((f) => f.prime !== 2n);

  let form;
  if (oddFactors.length === 1 && twos === 0n) form = 'oddPrimePower';
  else if (oddFactors.length === 1 && twos === 1n) form = 'twiceOddPrimePower';
  else if (oddFactors.length === 0) form = 'highPowerOfTwo';
  else if (oddFactors.length >= 2) form = 'severalOddPrimes';
  else form = 'fourDividesN';

  return {
    ok: true,
    n,
    exists: form === 'oddPrimePower' || form === 'twiceOddPrimePower',
    form,
    factorString: factorisation.factorString,
  };
}

/**
 * Lemma 10.2.3: a unit a is a primitive root of n iff a^(φ(n)/q) ≢ 1 for every
 * prime q | φ(n). Only one power per prime divisor of φ(n) is needed.
 */
export function primitiveRootTest(aRaw, nRaw, { budget } = {}) {
  const a = parseBigInt(aRaw);
  const n = parseBigInt(nRaw);
  if (a === null || n === null) return { ok: false, code: 'invalidInput' };
  if (n < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };

  const d = gcd(a, n).gcd;
  if (d !== 1n) return { ok: false, code: 'orderRequiresCoprime', vars: { a, m: n, gcd: d } };

  const totient = totientOf(n, budget);
  if (!totient.ok) return totient;
  const { phi } = totient;

  const divisors = primeDivisorsOf(phi, budget);
  if (!divisors.ok) return divisors;

  const base = mod(a, n);
  const rows = divisors.primes.map((q) => {
    const exponent = phi / q;
    const residue = modPow(base, exponent, n);
    return {
      q,
      exponent,
      residue,
      isOne: residue === 1n,
      latex: `${base}^{${phi}/${q}} = ${base}^{${exponent}} \\equiv ${residue} \\pmod{${n}}`,
    };
  });

  return { ok: true, a: base, n, phi, rows, isPrimitiveRoot: rows.every((row) => !row.isOne) };
}

/**
 * The smallest primitive root, how many there are (φ(φ(n)), Fact 10.3.6) and,
 * when φ(n) is small enough, all of them as gᵏ with gcd(k, φ(n)) = 1.
 */
export function primitiveRoots(
  nRaw,
  {
    budget,
    listLimit = ROOT_LIST_LIMIT,
    enumerationLimit = PRIMITIVE_ROOT_ENUMERATION_LIMIT,
    searchLimit = 1_000_000n,
  } = {}
) {
  const existence = primitiveRootExistence(nRaw, { budget });
  if (!existence.ok) return existence;

  const { n } = existence;
  if (!existence.exists && existence.form !== 'small') {
    return { ok: true, n, exists: false, form: existence.form, factorString: existence.factorString };
  }

  const totient = totientOf(n, budget);
  if (!totient.ok) return totient;
  const { phi } = totient;

  const divisors = primeDivisorsOf(phi, budget);
  if (!divisors.ok) return divisors;

  const isGenerator = (a) =>
    gcd(a, n).gcd === 1n && divisors.primes.every((q) => modPow(a, phi / q, n) !== 1n);

  let smallest = null;
  for (let a = 1n; a < n && a <= searchLimit; a += 1n) {
    if (isGenerator(a)) {
      smallest = a;
      break;
    }
  }
  if (smallest === null) return { ok: false, code: 'primitiveRootSearchExhausted' };

  const countResult = totientOf(phi, budget);
  const count = countResult.ok ? countResult.phi : null;

  let roots = null;
  if (phi <= enumerationLimit) {
    const all = [];
    let power = 1n;
    for (let k = 1n; k <= phi; k += 1n) {
      power = (power * smallest) % n;
      if (gcd(k, phi).gcd === 1n) all.push(power);
    }
    roots = sortBigInts(all);
  }

  return {
    ok: true,
    n,
    exists: true,
    form: existence.form,
    phi,
    phiPrimes: divisors.primes,
    smallest,
    count,
    roots: roots ? roots.slice(0, listLimit) : null,
    rootsTruncated: roots ? roots.length > listLimit : false,
    rootsComplete: roots !== null,
  };
}

/** Least x ≥ 0 with gˣ ≡ h (mod n), for g of the given order; null if none. */
function babyStepGiantStep(g, h, n, order) {
  const m = integerSqrt(order - 1n) + 1n; // ⌈√order⌉
  const table = new Map();

  let power = 1n;
  for (let j = 0n; j < m; j += 1n) {
    const key = power.toString();
    if (!table.has(key)) table.set(key, j);
    power = (power * g) % n;
  }

  const giant = modPow(modInverse(g, n).value, m, n);
  let gamma = mod(h, n);
  for (let i = 0n; i < m; i += 1n) {
    const j = table.get(gamma.toString());
    if (j !== undefined) return mod(i * m + j, order);
    gamma = (gamma * giant) % n;
  }
  return null;
}

/** Shared set-up for the index method: n, a primitive root g and φ(n). */
function indexContext(nRaw, budget) {
  const n = parseBigInt(nRaw);
  if (n === null) return { ok: false, code: 'invalidInput' };
  if (n < 3n) return { ok: false, code: 'indexModulusTooSmall' };

  const roots = primitiveRoots(n, { budget, enumerationLimit: 0n });
  if (!roots.ok) return roots;
  if (!roots.exists) return { ok: false, code: 'indexNeedsPrimitiveRoot', vars: { n } };
  if (roots.phi > INDEX_ORDER_LIMIT) return { ok: false, code: 'indexTooLarge', vars: { limit: INDEX_ORDER_LIMIT } };

  return { ok: true, n, g: roots.smallest, phi: roots.phi };
}

/** ind_g(a): the exponent with g^ind ≡ a (mod n), for a unit a. */
export function discreteIndex(aRaw, nRaw, { budget } = {}) {
  const context = indexContext(nRaw, budget);
  if (!context.ok) return context;

  const a = parseBigInt(aRaw);
  if (a === null) return { ok: false, code: 'invalidInput' };
  const { n, g, phi } = context;
  if (gcd(a, n).gcd !== 1n) return { ok: false, code: 'indexRequiresUnits', vars: { n } };

  const index = babyStepGiantStep(g, mod(a, n), n, phi);
  return { ok: true, n, g, phi, a: mod(a, n), index };
}

/** g⁰ … gᵏ mod n, the classic printed "table of indices". */
export function indexTable(g, n, phi, limit = 200n) {
  const rows = [];
  let power = 1n;
  for (let i = 0n; i < phi && i < limit; i += 1n) {
    rows.push({ exponent: i, residue: power });
    power = (power * g) % n;
  }
  return { rows, truncated: phi > limit };
}

/**
 * xᵏ ≡ a (mod n). Writing x = gⁱ and a = gʲ turns it into the linear
 * congruence k·i ≡ j (mod φ(n)) (§10.5.1, Examples 10.5.1–10.5.3).
 */
export function solvePowerCongruence(kRaw, aRaw, nRaw, { budget } = {}) {
  const k = parseBigInt(kRaw);
  const a = parseBigInt(aRaw);
  if (k === null || a === null) return { ok: false, code: 'invalidInput' };
  if (k < 1n) return { ok: false, code: 'exponentMustBePositive' };

  const context = indexContext(nRaw, budget);
  if (!context.ok) return context;
  const { n, g, phi } = context;
  if (gcd(a, n).gcd !== 1n) return { ok: false, code: 'indexRequiresUnits', vars: { n } };

  const j = babyStepGiantStep(g, mod(a, n), n, phi);
  const linear = solveLinearCongruence(k, j, phi);

  const steps = [
    { key: 'index.primitiveRoot', vars: { g, n }, latex: `g = ${g}, \\quad \\varphi(${n}) = ${phi}` },
    { key: 'index.writeTarget', vars: {}, latex: `${mod(a, n)} \\equiv ${g}^{${j}} \\pmod{${n}}` },
    {
      key: 'index.substitutePower',
      vars: {},
      latex: `x = ${g}^{i} \\implies ${g}^{${k}i} \\equiv ${g}^{${j}} \\implies ${k}i \\equiv ${j} \\pmod{${phi}}`,
    },
  ];

  if (!linear.hasSolution) {
    return {
      ok: true,
      hasSolution: false,
      n,
      g,
      phi,
      indexA: j,
      gcd: linear.gcd,
      steps,
      latex: `\\gcd(${k}, ${phi}) = ${linear.gcd} \\nmid ${j}`,
    };
  }

  const exponents = linear.incongruentSolutions;
  const solutions = sortBigInts(exponents.map((i) => modPow(g, i, n)));
  steps.push({
    key: 'index.backSubstitute',
    vars: { count: exponents.length },
    latex: `i \\in \\{${exponents.join(', ')}\\} \\implies x \\in \\{${exponents.map((i) => `${g}^{${i}}`).join(', ')}\\}`,
  });

  return {
    ok: true,
    hasSolution: true,
    n,
    g,
    phi,
    indexA: j,
    exponents,
    solutions,
    steps,
    solutionString: `x \\in \\{${solutions.join(', ')}\\} \\pmod{${n}}`,
  };
}

/**
 * bˣ ≡ a (mod n), a discrete logarithm. With b = gⁱ and a = gʲ the exponents
 * satisfy i·x ≡ j (mod φ(n)) (§10.5.2, Examples 10.5.4 and 10.5.6). Answers
 * are reported modulo φ(n), as in the book.
 */
export function solveExponentialCongruence(bRaw, aRaw, nRaw, { budget } = {}) {
  const b = parseBigInt(bRaw);
  const a = parseBigInt(aRaw);
  if (b === null || a === null) return { ok: false, code: 'invalidInput' };

  const context = indexContext(nRaw, budget);
  if (!context.ok) return context;
  const { n, g, phi } = context;
  if (gcd(a, n).gcd !== 1n || gcd(b, n).gcd !== 1n) {
    return { ok: false, code: 'indexRequiresUnits', vars: { n } };
  }

  const i = babyStepGiantStep(g, mod(b, n), n, phi);
  const j = babyStepGiantStep(g, mod(a, n), n, phi);
  const linear = solveLinearCongruence(i, j, phi);

  const steps = [
    { key: 'index.primitiveRoot', vars: { g, n }, latex: `g = ${g}, \\quad \\varphi(${n}) = ${phi}` },
    {
      key: 'index.writeBoth',
      vars: {},
      latex: `${mod(b, n)} \\equiv ${g}^{${i}}, \\quad ${mod(a, n)} \\equiv ${g}^{${j}} \\pmod{${n}}`,
    },
    {
      key: 'index.substituteExponent',
      vars: {},
      latex: `${g}^{${i}x} \\equiv ${g}^{${j}} \\implies ${i}x \\equiv ${j} \\pmod{${phi}}`,
    },
  ];

  if (!linear.hasSolution) {
    return {
      ok: true,
      hasSolution: false,
      n,
      g,
      phi,
      indexB: i,
      indexA: j,
      gcd: linear.gcd,
      steps,
      latex: `\\gcd(${i}, ${phi}) = ${linear.gcd} \\nmid ${j}`,
    };
  }

  return {
    ok: true,
    hasSolution: true,
    n,
    g,
    phi,
    indexB: i,
    indexA: j,
    solutions: linear.incongruentSolutions,
    steps,
    solutionString: `x \\in \\{${linear.incongruentSolutions.join(', ')}\\} \\pmod{${phi}}`,
  };
}

/* --------------------------------------------------------------------------
 * §16.1–16.3 Square roots modulo n, completing the square (Algorithm 16.2.4,
 * Fact 16.2.5) and the list of quadratic residues (Definition 16.3.1).
 * Square roots modulo a prime use Tonelli–Shanks, which is NOT from the book
 * (the book finds them by search); lifting and combining follow §7.2 / §16.1.
 * ------------------------------------------------------------------------ */

/** A square root of a unit a modulo an odd prime p, or null (Tonelli–Shanks). */
function sqrtModOddPrime(aIn, p) {
  const a = mod(aIn, p);
  if (modPow(a, (p - 1n) / 2n, p) !== 1n) return null;
  if (p % 4n === 3n) return modPow(a, (p + 1n) / 4n, p);

  let q = p - 1n;
  let s = 0n;
  while (q % 2n === 0n) {
    q /= 2n;
    s += 1n;
  }

  let z = 2n;
  while (modPow(z, (p - 1n) / 2n, p) !== p - 1n) z += 1n;

  let m = s;
  let c = modPow(z, q, p);
  let t = modPow(a, q, p);
  let r = modPow(a, (q + 1n) / 2n, p);

  while (t !== 1n) {
    let i = 0n;
    let square = t;
    while (square !== 1n) {
      square = (square * square) % p;
      i += 1n;
    }
    const b = modPow(c, 1n << (m - i - 1n), p);
    m = i;
    c = (b * b) % p;
    t = (t * c) % p;
    r = (r * b) % p;
  }
  return r;
}

/** All y with y² ≡ u (mod pᶠ) for a unit u, f ≥ 1. */
function unitSquareRoots(u, p, f) {
  const modulus = p ** f;

  if (p === 2n) {
    if (f === 1n) return [1n];
    if (f === 2n) return mod(u, 4n) === 1n ? [1n, 3n] : [];
    if (mod(u, 8n) !== 1n) return [];

    // r² ≡ u (mod 2ⁱ) ⇒ r or r + 2ⁱ⁻¹ squares to u modulo 2ⁱ⁺¹.
    let r = 1n;
    for (let i = 3n; i < f; i += 1n) {
      if (mod(r * r - u, 1n << (i + 1n)) !== 0n) r += 1n << (i - 1n);
    }
    const half = modulus / 2n;
    return sortBigInts([...new Set([r, modulus - r, mod(r + half, modulus), mod(-r + half, modulus)])]);
  }

  let r = sqrtModOddPrime(u, p);
  if (r === null) return [];

  // Newton / Hensel step for x² − u: the derivative 2r is a unit.
  let power = p;
  for (let k = 2n; k <= f; k += 1n) {
    power *= p;
    r = mod(r - (r * r - u) * modInverse(mod(2n * r, power), power).value, power);
  }
  return sortBigInts([r, modulus - r]);
}

/** All x with x² ≡ a (mod pᵉ); count is exact, the list may be capped. */
function squareRootsModPrimePower(aIn, p, e, limit) {
  const modulus = p ** e;
  const a = mod(aIn, modulus);

  if (a === 0n) {
    // x² ≡ 0 ⇔ p^⌈e/2⌉ | x.
    const step = p ** ((e + 1n) / 2n);
    const count = modulus / step;
    const roots = [];
    for (let t = 0n; t < count && roots.length < limit; t += 1n) roots.push(t * step);
    return { count, roots, complete: BigInt(roots.length) === count };
  }

  let k = 0n;
  let u = a;
  while (u % p === 0n) {
    u /= p;
    k += 1n;
  }
  if (k % 2n === 1n) return { count: 0n, roots: [], complete: true };

  // x = pʰ·y with y² ≡ u (mod p^(e−k)); y is then free modulo p^(e−h).
  const h = k / 2n;
  const f = e - k;
  const units = unitSquareRoots(u, p, f);
  const ph = p ** h;
  const pf = p ** f;
  const count = BigInt(units.length) * ph;

  const roots = [];
  outer: for (const y of units) {
    for (let s = 0n; s < ph; s += 1n) {
      if (roots.length >= limit) break outer;
      roots.push(mod(ph * (y + s * pf), modulus));
    }
  }

  return { count, roots: sortBigInts(roots), complete: BigInt(roots.length) === count };
}

/**
 * Every square root of a modulo n: solve modulo each prime power, then glue
 * the pieces with the CRT (Algorithm 16.1.5).
 */
export function squareRootsMod(aRaw, nRaw, { budget, limit = ROOT_LIST_LIMIT } = {}) {
  const a = parseBigInt(aRaw);
  const n = parseBigInt(nRaw);
  if (a === null || n === null) return { ok: false, code: 'invalidInput' };
  if (n <= 0n) return { ok: false, code: 'modulusMustBePositive' };
  if (n === 1n) return { ok: true, n, a: 0n, count: 1n, roots: [0n], truncated: false, components: [] };

  const factorisation = primeFactorization(n, { budget });
  if (!factorisation.ok) return { ok: false, code: factorisation.code, vars: { n: factorisation.n } };

  const components = factorisation.factors.map(({ prime, power }) => ({
    prime,
    power,
    modulus: prime ** power,
    ...squareRootsModPrimePower(a, prime, power, limit),
  }));

  const count = components.reduce((acc, c) => acc * c.count, 1n);
  const canCombine = count <= BigInt(limit) && components.every((c) => c.complete);

  return {
    ok: true,
    n,
    a: mod(a, n),
    count,
    roots: canCombine ? combineResidues(components) : null,
    truncated: !canCombine,
    components,
    factorString: factorisation.factorString,
  };
}

/**
 * ax² + bx + c ≡ 0 (mod n). When gcd(2a, n) = 1 it completes the square:
 * (2ax + b)² ≡ b² − 4ac, so x ≡ (2a)⁻¹(s − b) for each square root s
 * (Algorithm 16.2.4, Fact 16.2.5). Otherwise it falls back to a bounded scan.
 */
export function solveQuadraticCongruence(
  aRaw,
  bRaw,
  cRaw,
  nRaw,
  { budget, scanLimit = POLYNOMIAL_SCAN_LIMIT, limit = ROOT_LIST_LIMIT } = {}
) {
  const a = parseBigInt(aRaw);
  const b = parseBigInt(bRaw);
  const c = parseBigInt(cRaw);
  const n = parseBigInt(nRaw);
  if ([a, b, c, n].some((v) => v === null)) return { ok: false, code: 'invalidInput' };
  if (n <= 0n) return { ok: false, code: 'modulusMustBePositive' };

  const A = mod(a, n);
  const B = mod(b, n);
  const C = mod(c, n);
  if (A === 0n) return { ok: false, code: 'quadraticLeadingZero', vars: { n } };

  if (gcd(2n * A, n).gcd === 1n) {
    const discriminant = mod(B * B - 4n * A * C, n);
    const sq = squareRootsMod(discriminant, n, { budget, limit });
    if (!sq.ok) return sq;

    const inverse = modInverse(2n * A, n).value;
    const roots = sq.roots ? sortBigInts(sq.roots.map((s) => mod(inverse * (s - B), n))) : null;

    const steps = [
      {
        key: 'quadratic.multiply',
        vars: { factor: 4n * A },
        latex: `4 \\cdot ${A} \\cdot (${A}x^2 + ${B}x + ${C}) \\equiv 0 \\pmod{${n}}`,
      },
      {
        key: 'quadratic.isolate',
        vars: {},
        latex: `(${2n * A}x + ${B})^2 \\equiv ${B}^2 - 4 \\cdot ${A} \\cdot ${C} \\equiv ${discriminant} \\pmod{${n}}`,
      },
      {
        key: 'quadratic.squareRoots',
        vars: { count: sq.count, d: discriminant, n },
        latex: sq.roots
          ? `s^2 \\equiv ${discriminant} \\pmod{${n}} \\implies s \\in \\{${sq.roots.join(', ') || '\\,'}\\}`
          : `s^2 \\equiv ${discriminant} \\pmod{${n}}`,
      },
      {
        key: 'quadratic.solveLinear',
        vars: {},
        latex: `x \\equiv (2 \\cdot ${A})^{-1}(s - ${B}) \\equiv ${inverse}(s - ${B}) \\pmod{${n}}`,
      },
    ];

    return {
      ok: true,
      method: 'completeSquare',
      n,
      a: A,
      b: B,
      c: C,
      discriminant,
      inverse2a: inverse,
      squareRoots: sq.roots,
      roots,
      count: sq.count,
      truncated: sq.truncated,
      steps,
    };
  }

  if (n > scanLimit) {
    return { ok: false, code: 'quadraticNeedsUnitLeading', vars: { a: A, n, limit: scanLimit } };
  }

  const roots = [];
  for (let x = 0n; x < n; x += 1n) {
    if (mod(A * x * x + B * x + C, n) === 0n) roots.push(x);
  }

  return {
    ok: true,
    method: 'scan',
    n,
    a: A,
    b: B,
    c: C,
    roots: roots.slice(0, limit),
    count: BigInt(roots.length),
    truncated: roots.length > limit,
    steps: [],
  };
}

/**
 * Non-zero quadratic residues and non-residues modulo an odd prime p
 * (Definition 16.3.1). There are (p − 1)/2 of each.
 */
export function quadraticResidueList(pRaw, { limit = 2000n } = {}) {
  const p = parseBigInt(pRaw);
  if (p === null) return { ok: false, code: 'invalidInput' };
  if (p < 3n || !isPrime(p)) return { ok: false, code: 'legendreRequiresOddPrime', vars: { p } };
  if (p > limit) return { ok: false, code: 'residueListTooLarge', vars: { limit } };

  const residues = new Set();
  for (let x = 1n; x <= (p - 1n) / 2n; x += 1n) residues.add((x * x) % p);

  const sortedResidues = sortBigInts([...residues]);
  const nonResidues = [];
  for (let a = 1n; a < p; a += 1n) if (!residues.has(a)) nonResidues.push(a);

  return { ok: true, p, residues: sortedResidues, nonResidues };
}

/* --------------------------------------------------------------------------
 * §11 Cryptography: letter encoding (§11.1.1), affine / Caesar ciphers
 * (§11.2, Fact 11.2.2), the exponentiation cipher (Algorithm 11.3.3),
 * Diffie–Hellman key exchange (Algorithm 11.4.2), RSA (Algorithm 11.5.5)
 * and CRT secret sharing (Algorithm 11.7.1).
 * ------------------------------------------------------------------------ */

/**
 * Letters A–Z become 1–26 (case-insensitive; everything else is dropped). A
 * block of k letters is read in base 26 with the first letter as the units
 * digit, so "TH" = 20 + 8·26 = 228. Block size 0 encodes the whole message as
 * a single number.
 */
export function encodeMessage(text, blockSizeRaw = 1) {
  const letters = [...String(text ?? '').toUpperCase()].filter((ch) => ch >= 'A' && ch <= 'Z');
  if (letters.length === 0) return { ok: false, code: 'messageHasNoLetters' };

  const requested = parseBigInt(blockSizeRaw);
  if (requested === null || requested < 0n) return { ok: false, code: 'invalidBlockSize' };
  const size = requested === 0n ? letters.length : Number(requested);

  const digits = letters.map((ch) => BigInt(ch.charCodeAt(0) - 64));
  const blocks = [];
  for (let i = 0; i < digits.length; i += size) {
    let value = 0n;
    let place = 1n;
    for (const digit of digits.slice(i, i + size)) {
      value += digit * place;
      place *= 26n;
    }
    blocks.push(value);
  }

  return { ok: true, letters: letters.join(''), blockSize: size, blocks };
}

/** Inverse of encodeMessage for one block (bijective base 26, digits 1–26). */
export function decodeNumber(valueRaw) {
  let value = parseBigInt(valueRaw);
  if (value === null || value <= 0n) return '';

  let out = '';
  while (value > 0n) {
    let digit = value % 26n;
    if (digit === 0n) digit = 26n;
    out += String.fromCharCode(64 + Number(digit));
    value = (value - digit) / 26n;
  }
  return out;
}

/** Decode a list of blocks back to text. */
export function decodeBlocks(blocks) {
  return blocks.map((block) => decodeNumber(block)).join('');
}

/**
 * Text or a comma/space separated list of integers, as cipher input. Numbers
 * pass straight through; text is encoded with encodeMessage.
 */
function readMessage(message, mode, blockSize) {
  if (mode === 'numbers') {
    const parts = String(message ?? '')
      .split(/[\s,;]+/)
      .filter(Boolean);
    const blocks = parts.map((part) => parseBigInt(part));
    if (blocks.length === 0 || blocks.some((value) => value === null || value < 0n)) {
      return { ok: false, code: 'invalidNumberList' };
    }
    return { ok: true, letters: null, blocks, blockSize: null };
  }
  return encodeMessage(message, blockSize);
}

/** Representative in 1 … n rather than 0 … n − 1, since every block is ≥ 1. */
const positiveResidue = (x, n) => {
  const r = mod(x, n);
  return r === 0n ? n : r;
};

/**
 * Affine cipher x ↦ ax + b (mod n); Caesar is a = 1, b = 3, n = 26.
 * Decryption is m ↦ a′(m − b) with a·a′ ≡ 1, so gcd(a, n) = 1 is required
 * (Fact 11.2.2).
 */
export function affineCipher({ message, mode = 'text', blockSize = 1, a: aRaw, b: bRaw, n: nRaw }) {
  const a = parseBigInt(aRaw);
  const b = parseBigInt(bRaw);
  const n = parseBigInt(nRaw);
  if (a === null || b === null || n === null) return { ok: false, code: 'invalidInput' };
  if (n < 2n) return { ok: false, code: 'requiresIntegerAboveOne' };

  const d = gcd(a, n).gcd;
  if (d !== 1n) return { ok: false, code: 'affineNeedsUnit', vars: { a, n, gcd: d } };

  const input = readMessage(message, mode, blockSize);
  if (!input.ok) return input;

  const oversized = input.blocks.find((x) => x > n);
  const aInverse = modInverse(a, n).value;
  const cipher = input.blocks.map((x) => mod(a * x + b, n));
  // Letter blocks are ≥ 1, so 0 ≡ n must read back as n (Z when n = 26);
  // a raw number list keeps the ordinary residue 0 … n − 1.
  const decrypted = cipher.map((m) =>
    input.letters === null ? mod(aInverse * (m - b), n) : positiveResidue(aInverse * (m - b), n)
  );

  return {
    ok: true,
    n,
    a: mod(a, n),
    b: mod(b, n),
    aInverse,
    letters: input.letters,
    blocks: input.blocks,
    cipher,
    cipherText: input.letters === null ? null : cipher.map((m) => decodeNumber(positiveResidue(m, n))).join(''),
    decrypted,
    recovered: input.letters === null ? null : decodeBlocks(decrypted),
    oversizedBlock: oversized ?? null,
    encryptLatex: `m \\equiv ${mod(a, n)}x + ${mod(b, n)} \\pmod{${n}}`,
    decryptLatex: `x \\equiv ${aInverse}(m - ${mod(b, n)}) \\pmod{${n}}`,
  };
}

/** Shared block check: every plaintext block must be smaller than the modulus. */
const blockTooLarge = (blocks, modulus) => blocks.find((x) => x >= modulus) ?? null;

/**
 * The exponentiation cipher of Algorithm 11.3.3 (the book calls it
 * Diffie–Hellman encryption; it is also known as Pohlig–Hellman):
 * c ≡ xᵉ (mod p) with gcd(e, p − 1) = 1, undone by f ≡ e⁻¹ (mod p − 1).
 */
export function exponentCipher({ message, mode = 'text', blockSize = 0, p: pRaw, e: eRaw }) {
  const p = parseBigInt(pRaw);
  const e = parseBigInt(eRaw);
  if (p === null || e === null) return { ok: false, code: 'invalidInput' };
  if (!isPrime(p)) return { ok: false, code: 'requiresPrimeModulus', vars: { p } };
  if (e < 1n) return { ok: false, code: 'exponentMustBePositive' };

  const d = gcd(e, p - 1n).gcd;
  if (d !== 1n) return { ok: false, code: 'exponentNotCoprime', vars: { e, m: p - 1n, gcd: d } };

  const input = readMessage(message, mode, blockSize);
  if (!input.ok) return input;

  const tooLarge = blockTooLarge(input.blocks, p);
  if (tooLarge !== null) return { ok: false, code: 'blockExceedsModulus', vars: { block: tooLarge, n: p } };

  const f = modInverse(e, p - 1n).value;
  const cipher = input.blocks.map((x) => modPow(x, e, p));
  const decrypted = cipher.map((c) => modPow(c, f, p));

  return {
    ok: true,
    p,
    e,
    f,
    letters: input.letters,
    blocks: input.blocks,
    cipher,
    decrypted,
    recovered: input.letters === null ? null : decodeBlocks(decrypted),
    keyLatex: `f \\equiv ${e}^{-1} \\equiv ${f} \\pmod{${p - 1n}}`,
  };
}

/**
 * Diffie–Hellman key exchange (Algorithm 11.4.2): publish p and g, keep m and
 * n secret, swap gᵐ and gⁿ, and both sides reach g^(mn).
 */
export function diffieHellman(pRaw, gRaw, mRaw, nRaw) {
  const p = parseBigInt(pRaw);
  const g = parseBigInt(gRaw);
  const m = parseBigInt(mRaw);
  const n = parseBigInt(nRaw);
  if ([p, g, m, n].some((v) => v === null)) return { ok: false, code: 'invalidInput' };
  if (!isPrime(p)) return { ok: false, code: 'requiresPrimeModulus', vars: { p } };
  if (g <= 1n || g >= p) return { ok: false, code: 'dhBaseOutOfRange', vars: { p } };
  if (m < 1n || n < 1n) return { ok: false, code: 'exponentMustBePositive' };

  const alicePublic = modPow(g, m, p);
  const bobPublic = modPow(g, n, p);
  const aliceKey = modPow(bobPublic, m, p);
  const bobKey = modPow(alicePublic, n, p);
  const generator = primitiveRootTest(g, p);

  return {
    ok: true,
    p,
    g,
    alicePublic,
    bobPublic,
    aliceKey,
    bobKey,
    agree: aliceKey === bobKey,
    isPrimitiveRoot: generator.ok ? generator.isPrimitiveRoot : false,
    steps: [
      { key: 'dh.alicePublic', vars: {}, latex: `A = ${g}^{${m}} \\equiv ${alicePublic} \\pmod{${p}}` },
      { key: 'dh.bobPublic', vars: {}, latex: `B = ${g}^{${n}} \\equiv ${bobPublic} \\pmod{${p}}` },
      { key: 'dh.aliceKey', vars: {}, latex: `B^{${m}} = ${bobPublic}^{${m}} \\equiv ${aliceKey} \\pmod{${p}}` },
      { key: 'dh.bobKey', vars: {}, latex: `A^{${n}} = ${alicePublic}^{${n}} \\equiv ${bobKey} \\pmod{${p}}` },
    ],
  };
}

/**
 * RSA (Algorithm 11.5.5): n = pq, φ(n) = (p − 1)(q − 1), public (n, e) with
 * gcd(e, φ(n)) = 1, private d ≡ e⁻¹ (mod φ(n)); encrypt xᵉ, decrypt cᵈ.
 */
export function rsaCipher({ message, mode = 'text', blockSize = 2, p: pRaw, q: qRaw, e: eRaw }) {
  const p = parseBigInt(pRaw);
  const q = parseBigInt(qRaw);
  const e = parseBigInt(eRaw);
  if (p === null || q === null || e === null) return { ok: false, code: 'invalidInput' };
  if (!isPrime(p) || !isPrime(q)) return { ok: false, code: 'rsaRequiresPrimes' };
  if (p === q) return { ok: false, code: 'rsaPrimesMustDiffer' };
  if (e < 2n) return { ok: false, code: 'exponentMustBePositive' };

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const d = gcd(e, phi).gcd;
  if (d !== 1n) return { ok: false, code: 'exponentNotCoprime', vars: { e, m: phi, gcd: d } };

  const input = readMessage(message, mode, blockSize);
  if (!input.ok) return input;

  const tooLarge = blockTooLarge(input.blocks, n);
  if (tooLarge !== null) return { ok: false, code: 'blockExceedsModulus', vars: { block: tooLarge, n } };

  const privateExponent = modInverse(e, phi).value;
  const cipher = input.blocks.map((x) => modPow(x, e, n));
  const decrypted = cipher.map((c) => modPow(c, privateExponent, n));

  return {
    ok: true,
    p,
    q,
    n,
    phi,
    e,
    d: privateExponent,
    letters: input.letters,
    blocks: input.blocks,
    cipher,
    decrypted,
    recovered: input.letters === null ? null : decodeBlocks(decrypted),
    steps: [
      { key: 'rsa.modulus', vars: {}, latex: `n = ${p} \\cdot ${q} = ${n}` },
      { key: 'rsa.totient', vars: {}, latex: `\\varphi(n) = (${p} - 1)(${q} - 1) = ${phi}` },
      { key: 'rsa.coprime', vars: {}, latex: `\\gcd(${e}, ${phi}) = 1` },
      { key: 'rsa.private', vars: {}, latex: `d \\equiv ${e}^{-1} \\equiv ${privateExponent} \\pmod{${phi}}` },
    ],
  };
}

/**
 * Two-of-three secret sharing with the CRT (Algorithm 11.7.1). Moduli are
 * taken in ascending order so m₁m₂ is the smallest pairwise product; with
 * K₀ = K + tp < m₁m₂, any two keys rebuild K₀ uniquely and K = K₀ mod p.
 */
export function secretSharing({ K: KRaw, p: pRaw, moduli: moduliRaw, t: tRaw }) {
  const K = parseBigInt(KRaw);
  const p = parseBigInt(pRaw);
  const t = parseBigInt(tRaw);
  const moduli = (moduliRaw ?? []).map((m) => parseBigInt(m));
  if ([K, p, t].some((v) => v === null) || moduli.length !== 3 || moduli.some((m) => m === null)) {
    return { ok: false, code: 'invalidInput' };
  }
  if (!isPrime(p)) return { ok: false, code: 'requiresPrimeModulus', vars: { p } };
  if (K < 0n || K >= p) return { ok: false, code: 'secretMustBeBelowP', vars: { p } };
  if (moduli.some((m) => m < 2n)) return { ok: false, code: 'requiresIntegerAboveOne' };
  if (t < 0n) return { ok: false, code: 'invalidInput' };

  const everything = [...moduli, p];
  for (let i = 0; i < everything.length; i += 1) {
    for (let j = i + 1; j < everything.length; j += 1) {
      const d = gcd(everything[i], everything[j]).gcd;
      if (d !== 1n) {
        return { ok: false, code: 'sharingModuliNotCoprime', vars: { x: everything[i], y: everything[j], gcd: d } };
      }
    }
  }

  const [s1, s2, s3] = sortBigInts(moduli);
  const M = s1 * s2;
  if (M <= p * s3) return { ok: false, code: 'sharingThresholdFails', vars: { M, pm: p * s3 } };

  const K0 = K + t * p;
  if (K0 >= M) return { ok: false, code: 'sharingTTooLarge', vars: { max: (M - 1n - K) / p } };

  const keys = moduli.map((m) => ({ m, key: K0 % m }));
  const reconstructions = [];
  for (let i = 0; i < 3; i += 1) {
    for (let j = i + 1; j < 3; j += 1) {
      const rebuilt = crtPair(keys[i].key, keys[i].m, keys[j].key, keys[j].m);
      reconstructions.push({
        i: i + 1,
        j: j + 1,
        K0: rebuilt,
        K: rebuilt % p,
        latex: `x \\equiv ${keys[i].key} \\!\\!\\pmod{${keys[i].m}},\\; x \\equiv ${keys[j].key} \\!\\!\\pmod{${keys[j].m}} \\implies x = ${rebuilt},\\; ${rebuilt} \\bmod ${p} = ${rebuilt % p}`,
      });
    }
  }

  return {
    ok: true,
    K,
    p,
    t,
    M,
    K0,
    keys,
    reconstructions,
    thresholdLatex: `m_1 m_2 = ${s1} \\cdot ${s2} = ${M} > p\\,m_3 = ${p} \\cdot ${s3} = ${p * s3}`,
    secretLatex: `K_0 = K + tp = ${K} + ${t} \\cdot ${p} = ${K0}`,
  };
}
