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
 * Deterministic for n < 3.3 * 10^24 with this witness set; a strong
 * probabilistic test beyond that.
 */
const MILLER_RABIN_WITNESSES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

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

/** Chinese Remainder Theorem for pairwise coprime moduli. */
export function solveCRT(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { hasSolution: false, code: 'noCongruences' };
  }

  const parsed = [];
  for (const item of items) {
    const a = parseBigInt(item.a);
    const m = parseBigInt(item.m);
    if (a === null || m === null) return { hasSolution: false, code: 'invalidInput' };
    if (m <= 0n) return { hasSolution: false, code: 'modulusMustBePositive' };
    parsed.push({ a, m });
  }

  for (let i = 0; i < parsed.length; i += 1) {
    for (let j = i + 1; j < parsed.length; j += 1) {
      const d = gcd(parsed[i].m, parsed[j].m).gcd;
      if (d !== 1n) {
        return {
          hasSolution: false,
          code: 'moduliNotCoprime',
          vars: { m1: parsed[i].m, m2: parsed[j].m, gcd: d },
          latex: `\\gcd(${parsed[i].m}, ${parsed[j].m}) = ${d} \\neq 1`,
        };
      }
    }
  }

  const M = parsed.reduce((acc, item) => acc * item.m, 1n);

  let x = 0n;
  const terms = [];

  for (const item of parsed) {
    const Mi = M / item.m;
    const inverse = modInverse(Mi, item.m);
    if (!inverse.ok) return { hasSolution: false, code: 'moduliNotCoprime', vars: {} };

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
    x,
    M,
    terms,
    solutionString: `x \\equiv ${x} \\pmod{${M}}`,
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
