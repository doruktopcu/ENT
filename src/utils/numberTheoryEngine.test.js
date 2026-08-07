/**
 * Engine regression tests. Run with `npm test` (Node's built-in runner).
 *
 * Every classical function is cross-checked against a naive brute-force
 * implementation rather than against hand-written constants, so the tests
 * catch algebra mistakes instead of encoding them.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  computeEulerPhi,
  divisorsOf,
  extGCD,
  fermatTest,
  findOrder,
  integerSqrt,
  isPrime,
  jacobiSymbol,
  lcm,
  legendreSymbol,
  modularExponentiation,
  primeFactorization,
  solveCRT,
  solveDiophantine,
  solveLinearCongruence,
  solveModularPolynomial,
} from './numberTheoryEngine.js';

const naiveGcd = (a, b) => {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) [x, y] = [y, x % y];
  return x;
};

test('extGCD returns a non-negative gcd with a matching Bezout identity', () => {
  for (let a = -30n; a <= 30n; a += 1n) {
    for (let b = -30n; b <= 30n; b += 1n) {
      const { gcd, u, v } = extGCD(a, b);
      assert.equal(gcd, naiveGcd(a, b), `gcd(${a}, ${b})`);
      assert.ok(gcd >= 0n, `gcd(${a}, ${b}) must be non-negative`);
      assert.equal(a * u + b * v, gcd, `Bezout identity for (${a}, ${b})`);
    }
  }
});

test('lcm(a, b) * gcd(a, b) === |a * b|', () => {
  for (let a = 1n; a <= 40n; a += 1n) {
    for (let b = 1n; b <= 40n; b += 1n) {
      assert.equal(lcm(a, b).lcm * naiveGcd(a, b), a * b);
    }
  }
});

test('solveDiophantine produces solutions that satisfy the equation', () => {
  for (const [a, b, c] of [
    [21n, -35n, 14n],
    [-4n, -6n, 10n],
    [-153n, 803n, 44n],
    [6n, 9n, 21n],
    [0n, 5n, 15n],
    [1n, 0n, -7n],
  ]) {
    const r = solveDiophantine(a, b, c);
    assert.ok(r.hasSolution, `${a}x + ${b}y = ${c} should be solvable`);
    assert.equal(a * r.x0 + b * r.y0, c, 'particular solution');
    for (const s of r.sampleSolutions) {
      assert.equal(a * s.x + b * s.y, c, `parametric solution at t = ${s.t}`);
    }
  }

  assert.equal(solveDiophantine(6n, 9n, 20n).hasSolution, false);
  assert.equal(solveDiophantine(0n, 0n, 3n).hasSolution, false);
});

test('solveLinearCongruence finds exactly the incongruent solutions', () => {
  for (let m = 1n; m <= 30n; m += 1n) {
    for (let a = 0n; a < m; a += 1n) {
      for (let b = 0n; b < m; b += 1n) {
        const expected = [];
        for (let x = 0n; x < m; x += 1n) {
          if ((a * x - b) % m === 0n) expected.push(x);
        }

        const r = solveLinearCongruence(a, b, m);
        if (expected.length === 0) {
          assert.equal(r.hasSolution, false, `${a}x = ${b} (mod ${m})`);
        } else {
          assert.ok(r.hasSolution, `${a}x = ${b} (mod ${m})`);
          const got = [...r.incongruentSolutions].sort((p, q) => (p < q ? -1 : 1));
          assert.deepEqual(got, expected, `${a}x = ${b} (mod ${m})`);
        }
      }
    }
  }
});

test('primeFactorization agrees with divisor enumeration', () => {
  for (let n = 1; n <= 500; n += 1) {
    let tau = 0n;
    let sigma = 0n;
    for (let d = 1; d <= n; d += 1) {
      if (n % d === 0) {
        tau += 1n;
        sigma += BigInt(d);
      }
    }

    const f = primeFactorization(n);
    assert.ok(f.ok);
    assert.equal(f.tau, tau, `tau(${n})`);
    assert.equal(f.sigma, sigma, `sigma(${n})`);
    assert.equal(
      f.factors.reduce((acc, { prime, power }) => acc * prime ** power, 1n),
      BigInt(n),
      `factors of ${n} multiply back`
    );
  }

  assert.equal(primeFactorization(0).ok, false, 'zero has no factorisation');
  assert.equal(primeFactorization('not a number').ok, false);
});

test('primeFactorization resolves large primes instead of exhausting its budget', () => {
  // Trial division alone would run to FACTORISATION_BUDGET and report
  // "too large" for these, even though the answer is just the number itself.
  for (const n of ['9999999999971', '999999999999989', '99999999999999997']) {
    const f = primeFactorization(n);
    assert.ok(f.ok, `${n} should factorise`);
    assert.equal(f.isPrime, true, `${n} is prime`);
    assert.deepEqual(f.factors, [{ prime: BigInt(n), power: 1n }]);
    assert.equal(f.tau, 2n);
    assert.equal(f.sigma, BigInt(n) + 1n);
  }

  // A small factor followed by a large prime cofactor, still ascending.
  const mixed = primeFactorization(2n * 3n * 999999999999989n);
  assert.ok(mixed.ok);
  assert.deepEqual(mixed.factors, [
    { prime: 2n, power: 1n },
    { prime: 3n, power: 1n },
    { prime: 999999999999989n, power: 1n },
  ]);
  assert.equal(mixed.mobius, -1n, 'three distinct primes');
});

test('solveDiophantine flags the degenerate 0x + 0y = 0 case explicitly', () => {
  const degenerate = solveDiophantine(0, 0, 0);
  assert.equal(degenerate.hasSolution, true);
  assert.equal(degenerate.isDegenerate, true);
  assert.equal(degenerate.code, 'everyPairIsASolution');
  // Callers must not interpolate x0/y0 for this shape.
  assert.equal(degenerate.x0, undefined);
  assert.equal(degenerate.y0, undefined);

  const impossible = solveDiophantine(0, 0, 5);
  assert.equal(impossible.hasSolution, false);
  assert.equal(impossible.code, 'zeroCoefficientsNoSolution');
});

test('mobius is 0 on non-squarefree n and (-1)^omega otherwise', () => {
  for (let n = 1; n <= 200; n += 1) {
    const f = primeFactorization(n);
    const squarefree = f.factors.every(({ power }) => power === 1n);
    const expected = squarefree ? (f.factors.length % 2 === 0 ? 1n : -1n) : 0n;
    assert.equal(f.mobius, expected, `mu(${n})`);
  }
});

test('divisorsOf lists every divisor in ascending order', () => {
  for (let n = 1; n <= 200; n += 1) {
    const expected = [];
    for (let d = 1; d <= n; d += 1) if (n % d === 0) expected.push(BigInt(d));
    assert.deepEqual(divisorsOf(n).divisors, expected, `divisors of ${n}`);
  }
});

test('computeEulerPhi agrees with counting coprime residues', () => {
  for (let n = 1; n <= 400; n += 1) {
    let count = 0;
    for (let k = 1; k <= n; k += 1) if (naiveGcd(BigInt(k), BigInt(n)) === 1n) count += 1;
    assert.equal(computeEulerPhi(n).phi, BigInt(count), `phi(${n})`);
  }

  assert.equal(computeEulerPhi(0).ok, false);
  assert.equal(computeEulerPhi(-5).ok, false);
});

test('solveCRT reconstructs a solution satisfying every congruence', () => {
  const systems = [
    [{ a: 2, m: 3 }, { a: 3, m: 5 }, { a: 2, m: 7 }],
    [{ a: 1, m: 4 }, { a: 2, m: 9 }, { a: 3, m: 25 }],
    [{ a: -6, m: 11 }, { a: 4, m: 13 }],
  ];

  for (const system of systems) {
    const r = solveCRT(system);
    assert.ok(r.hasSolution);
    for (const { a, m } of system) {
      assert.equal((r.x - BigInt(a)) % BigInt(m), 0n, `x = ${a} (mod ${m})`);
    }
  }

  assert.equal(solveCRT([{ a: 1, m: 4 }, { a: 2, m: 6 }]).code, 'moduliNotCoprime');
  assert.equal(solveCRT([{ a: 1, m: 0 }]).hasSolution, false, 'zero modulus must not throw');
  assert.equal(solveCRT([]).hasSolution, false);
});

test('modularExponentiation matches naive repeated multiplication', () => {
  for (let m = 1n; m <= 20n; m += 1n) {
    for (let b = -5n; b <= 10n; b += 1n) {
      for (let e = 0n; e <= 12n; e += 1n) {
        let expected = 1n % m;
        for (let i = 0n; i < e; i += 1n) expected = (expected * (((b % m) + m) % m)) % m;
        assert.equal(modularExponentiation(b, e, m).value, expected, `${b}^${e} mod ${m}`);
      }
    }
  }

  assert.equal(modularExponentiation(3, -1, 7).value, 5n, 'negative exponent uses the inverse');
  assert.equal(modularExponentiation(2, -1, 8).ok, false, 'no inverse when not coprime');
  assert.equal(modularExponentiation(3, 4, 0).ok, false, 'modulus must be positive');
});

test('findOrder returns the least k with a^k = 1, and divides phi(m)', () => {
  for (let m = 2n; m <= 40n; m += 1n) {
    const phi = computeEulerPhi(m).phi;
    for (let a = 1n; a < m; a += 1n) {
      if (naiveGcd(a, m) !== 1n) {
        assert.equal(findOrder(a, m).exists, false, `ord_${m}(${a}) must not exist`);
        continue;
      }

      let expected = 1n;
      let cur = a % m;
      while (cur !== 1n % m) {
        cur = (cur * a) % m;
        expected += 1n;
      }

      const r = findOrder(a, m);
      assert.equal(r.order, expected, `ord_${m}(${a})`);
      assert.equal(phi % r.order, 0n, 'order must divide phi(m)');
    }
  }

  assert.equal(findOrder(5, 1).order, 1n, 'modulus 1 is the trivial group');
});

test('isPrime agrees with a sieve, including known pseudoprimes', () => {
  const limit = 2000;
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= limit; i += 1) {
    if (sieve[i]) for (let j = i * i; j <= limit; j += i) sieve[j] = false;
  }
  for (let n = 0; n <= limit; n += 1) assert.equal(isPrime(n), sieve[n], `isPrime(${n})`);

  // Carmichael numbers and strong pseudoprimes must not fool Miller-Rabin.
  for (const n of [561n, 1105n, 1729n, 2465n, 2821n, 6601n, 8911n, 3215031751n]) {
    assert.equal(isPrime(n), false, `${n} is composite`);
  }
  assert.equal(isPrime(2n ** 61n - 1n), true, 'Mersenne prime 2^61 - 1');
});

test('legendreSymbol rejects non-prime moduli and matches x^2 enumeration', () => {
  for (const p of [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 97n]) {
    const squares = new Set();
    for (let x = 1n; x < p; x += 1n) squares.add(((x * x) % p).toString());

    for (let a = 0n; a < p; a += 1n) {
      const r = legendreSymbol(a, p);
      assert.ok(r.ok);
      const expected = a === 0n ? 0 : squares.has(a.toString()) ? 1 : -1;
      assert.equal(r.value, expected, `(${a}/${p})`);
      if (r.squareRoot !== null && r.squareRoot !== undefined) {
        assert.equal((r.squareRoot * r.squareRoot) % p, a % p, 'reported square root');
      }
    }
  }

  // The old implementation happily accepted composite moduli here.
  assert.equal(legendreSymbol(2, 9).ok, false);
  assert.equal(legendreSymbol(2, 9).code, 'legendreModulusNotPrime');
  assert.equal(legendreSymbol(2, 2).ok, false);
  assert.equal(legendreSymbol(2, 15).ok, false);
});

test('jacobiSymbol equals legendreSymbol on primes and is multiplicative', () => {
  for (const p of [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n]) {
    for (let a = 0n; a < p; a += 1n) {
      assert.equal(jacobiSymbol(a, p).value, legendreSymbol(a, p).value, `(${a}/${p})`);
    }
  }

  // `+ 0` normalises the -0 that falls out of multiplying by a zero symbol.
  const normalise = (value) => value + 0;

  for (const n of [9n, 15n, 21n, 35n, 45n]) {
    for (let a = 1n; a < n; a += 1n) {
      for (let b = 1n; b < n; b += 1n) {
        assert.equal(
          normalise(jacobiSymbol(a * b, n).value),
          normalise(jacobiSymbol(a, n).value * jacobiSymbol(b, n).value),
          `(${a}*${b}/${n})`
        );
      }
    }
  }

  assert.equal(jacobiSymbol(3, 4).ok, false, 'Jacobi needs an odd modulus');
});

test('solveModularPolynomial matches direct expansion', () => {
  for (let trial = 0; trial < 200; trial += 1) {
    const m = BigInt(2 + Math.floor(Math.random() * 40));
    const coeffs = Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 41) - 20));
    const big = coeffs.map(BigInt);

    const expected = [];
    for (let x = 0n; x < m; x += 1n) {
      let v = 0n;
      for (let i = 0; i < big.length; i += 1) v += big[i] * x ** BigInt(i);
      if (((v % m) + m) % m === 0n) expected.push(x);
    }

    assert.deepEqual(solveModularPolynomial(coeffs, 0, m).roots, expected, `coeffs ${coeffs}`);
  }

  assert.equal(solveModularPolynomial(['1'], 0, 0).ok, false, 'modulus must be positive');
});

test('integerSqrt returns the exact floor of the square root', () => {
  for (let n = 0n; n <= 1000n; n += 1n) {
    const r = integerSqrt(n);
    assert.ok(r * r <= n && (r + 1n) * (r + 1n) > n, `isqrt(${n})`);
  }
  assert.equal(integerSqrt(10n ** 30n), 10n ** 15n);
});

test('fermatTest distinguishes pseudoprimes from actual primes', () => {
  assert.equal(fermatTest(2, 7).outcome, 'probablePrime');
  assert.equal(fermatTest(2, 9).outcome, 'composite');
  assert.equal(fermatTest(2, 341).outcome, 'pseudoprime', '341 is a base-2 Fermat pseudoprime');
  assert.equal(fermatTest(2, 561).outcome, 'pseudoprime', '561 is a Carmichael number');
  assert.equal(fermatTest(5, 5).outcome, 'notCoprime');
});
