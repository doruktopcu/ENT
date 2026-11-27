"""
Elementary Number Theory engine (Python edition).

A dependency-free companion to the browser extension: the same algorithms,
same guarantees, usable from a REPL, a script or the accompanying Colab
notebook.

Design notes
------------
* Functions *return* their results. Printing is the caller's business, so these
  can be composed and unit-tested; `demo()` shows the previous console output.
* The original Turkish function names are kept as the public API so existing
  notebooks keep working.
* Everything is exact integer arithmetic — Python ints are arbitrary precision,
  so no overflow handling is needed.
"""

from __future__ import annotations

__all__ = [
    "ebob", "gcd",
    "ekok", "lcm",
    "ext_ebob", "ext_gcd",
    "mod_inverse",
    "diophantus_solver",
    "lineer_kongruens_cozumu", "solve_linear_congruence",
    "lineer_fonksiyon_cozumleri", "solve_modular_polynomial",
    "asal_carpanlar", "asal_bolenler", "prime_factorization",
    "bolenler", "divisors",
    "tau", "sigma", "mobius",
    "euler_phi",
    "is_prime",
    "multiplicative_order",
    "legendre_symbol", "jacobi_symbol",
    "crt",
    "tam_kalan_sistemi",
    "demo",
]


# ---------------------------------------------------------------------------
# Greatest common divisor
# ---------------------------------------------------------------------------

def ebob(x: int, y: int) -> int:
    """Greatest common divisor (En Buyuk Ortak Bolen). Always non-negative."""
    x, y = abs(x), abs(y)
    while y:
        x, y = y, x % y
    return x


def ekok(x: int, y: int) -> int:
    """Least common multiple (En Kucuk Ortak Kat)."""
    if x == 0 or y == 0:
        return 0
    return abs(x // ebob(x, y) * y)


def ext_ebob(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean algorithm.

    Returns (d, u, v) with ``a*u + b*v == d == ebob(a, b)`` and ``d >= 0``.

    The previous implementation returned the raw final remainder, which is
    negative for inputs such as (-4, -6) or (21, -35). That made it report
    ``d = -7`` as a "greatest common divisor", and callers doing ``range(d)``
    silently produced no solutions at all.
    """
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t

    if old_r < 0:
        old_r, old_s, old_t = -old_r, -old_s, -old_t

    return old_r, old_s, old_t


def mod_inverse(a: int, m: int) -> int | None:
    """Inverse of a modulo m, or None when gcd(a, m) != 1."""
    if m <= 0:
        raise ValueError("modulus must be positive")
    if m == 1:
        return 0

    d, u, _ = ext_ebob(a % m, m)
    return u % m if d == 1 else None


# ---------------------------------------------------------------------------
# Equations and congruences
# ---------------------------------------------------------------------------

def diophantus_solver(a: int, b: int, n: int) -> dict | None:
    """
    Solve the linear Diophantine equation ``a*x + b*y = n``.

    Returns a dict with the particular solution and the parametric steps, or
    None when gcd(a, b) does not divide n.
    """
    if a == 0 and b == 0:
        return {"x0": 0, "y0": 0, "step_x": 0, "step_y": 0, "d": 0} if n == 0 else None

    d, u, v = ext_ebob(a, b)
    if n % d != 0:
        return None

    k = n // d
    return {
        "d": d,
        "x0": u * k,
        "y0": v * k,
        "step_x": b // d,
        "step_y": -a // d,
    }


def solve_linear_congruence(a: int, b: int, m: int) -> list[int]:
    """
    All incongruent solutions of ``a*x = b (mod m)``, ascending.

    Returns [] when gcd(a, m) does not divide b.
    """
    if m <= 0:
        raise ValueError("modulus must be positive")
    if m == 1:
        return [0]

    a %= m
    b %= m
    d = ebob(a, m)
    if b % d != 0:
        return []

    a1, b1, m1 = a // d, b // d, m // d
    inv = mod_inverse(a1, m1)
    if inv is None:
        return []

    x0 = (inv * b1) % m1
    return sorted((x0 + i * m1) % m for i in range(d))


def lineer_kongruens_cozumu(a: int, mod: int, b: int) -> list[int]:
    """Turkish-named alias kept for the notebook: ``a*x = b (mod mod)``."""
    return solve_linear_congruence(a, b, mod)


def solve_modular_polynomial(coeffs: list[int], b: int, mod: int) -> list[int]:
    """
    Roots of ``f(x) = b (mod mod)`` where ``coeffs[i]`` multiplies ``x**i``.

    Uses Horner's rule, reducing at every step.
    """
    if mod <= 0:
        raise ValueError("modulus must be positive")

    target = b % mod
    roots = []
    for x in range(mod):
        value = 0
        for c in reversed(coeffs):
            value = (value * x + c) % mod
        if value == target:
            roots.append(x)
    return roots


def lineer_fonksiyon_cozumleri(a_5, a_4, a_3, a_2, a_1, a_0, b, mod) -> list[int]:
    """Turkish-named alias: roots of a5*x^5 + ... + a0 = b (mod mod)."""
    return solve_modular_polynomial([a_0, a_1, a_2, a_3, a_4, a_5], b, mod)


def crt(congruences: list[tuple[int, int]]) -> tuple[int, int] | None:
    """
    Chinese Remainder Theorem for pairwise coprime moduli.

    Takes [(a1, m1), (a2, m2), ...] and returns (x, M) with x = ai (mod mi),
    or None when the moduli are not pairwise coprime.
    """
    if not congruences:
        return None

    for _, m in congruences:
        if m <= 0:
            raise ValueError("moduli must be positive")

    for i in range(len(congruences)):
        for j in range(i + 1, len(congruences)):
            if ebob(congruences[i][1], congruences[j][1]) != 1:
                return None

    total = 1
    for _, m in congruences:
        total *= m

    x = 0
    for a, m in congruences:
        partial = total // m
        inv = mod_inverse(partial, m)
        if inv is None:
            return None
        x = (x + a * partial * inv) % total

    return x % total, total


# ---------------------------------------------------------------------------
# Factorisation and arithmetic functions
# ---------------------------------------------------------------------------

def prime_factorization(n: int) -> dict[int, int]:
    """Canonical factorisation of |n| as {prime: exponent}. 0 and 1 map to {}."""
    n = abs(n)
    if n <= 1:
        return {}

    factors: dict[int, int] = {}

    while n % 2 == 0:
        factors[2] = factors.get(2, 0) + 1
        n //= 2

    d = 3
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 2

    if n > 1:
        factors[n] = factors.get(n, 0) + 1

    return factors


def asal_carpanlar(n: int) -> dict[int, int]:
    """Turkish-named alias for :func:`prime_factorization`."""
    return prime_factorization(n)


def asal_bolenler(integer: int) -> list[int]:
    """Distinct prime divisors of ``integer``, ascending."""
    return sorted(prime_factorization(integer))


def divisors(n: int) -> list[int]:
    """All positive divisors of |n|, ascending."""
    n = abs(n)
    if n == 0:
        return []
    if n == 1:
        return [1]

    result = [1]
    for prime, power in prime_factorization(n).items():
        result = [d * prime ** e for e in range(power + 1) for d in result]
    return sorted(result)


def bolenler(n: int) -> list[int]:
    """Turkish-named alias for :func:`divisors`."""
    return divisors(n)


def tau(n: int) -> int:
    """Number of positive divisors, tau(n)."""
    if abs(n) == 1:
        return 1
    result = 1
    for power in prime_factorization(n).values():
        result *= power + 1
    return result


def sigma(n: int) -> int:
    """Sum of positive divisors, sigma(n)."""
    if abs(n) == 1:
        return 1
    result = 1
    for prime, power in prime_factorization(n).items():
        result *= (prime ** (power + 1) - 1) // (prime - 1)
    return result


def mobius(n: int) -> int:
    """Mobius function mu(n): 0 if not squarefree, else (-1)**omega(n)."""
    if abs(n) == 1:
        return 1

    factors = prime_factorization(n)
    if any(power > 1 for power in factors.values()):
        return 0
    return -1 if len(factors) % 2 else 1


def euler_phi(n: int) -> int:
    """Euler's totient function phi(n)."""
    if n <= 0:
        return 0
    result = n
    for prime in prime_factorization(n):
        result = result // prime * (prime - 1)
    return result


# ---------------------------------------------------------------------------
# Primality, orders and quadratic residues
# ---------------------------------------------------------------------------

_MILLER_RABIN_WITNESSES = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)


def is_prime(n: int) -> bool:
    """
    Deterministic Miller-Rabin for n < 3.3e24, a strong test beyond that.

    Correctly rejects Carmichael numbers such as 561, which a naive Fermat
    test reports as prime.
    """
    if n < 2:
        return False

    for p in _MILLER_RABIN_WITNESSES:
        if n == p:
            return True
        if n % p == 0:
            return False

    d, r = n - 1, 0
    while d % 2 == 0:
        d //= 2
        r += 1

    for a in _MILLER_RABIN_WITNESSES:
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(r - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False

    return True


def multiplicative_order(a: int, m: int) -> int | None:
    """
    Least k > 0 with ``a**k = 1 (mod m)``, or None when gcd(a, m) != 1.

    Walks the divisors of phi(m) instead of incrementing one power at a time.
    """
    if m <= 0:
        raise ValueError("modulus must be positive")
    if m == 1:
        return 1
    if ebob(a, m) != 1:
        return None

    a %= m
    for candidate in divisors(euler_phi(m)):
        if pow(a, candidate, m) == 1:
            return candidate
    return None


def legendre_symbol(a: int, p: int) -> int:
    """
    Legendre symbol (a/p) via Euler's criterion. ``p`` must be an odd prime.

    Raises ValueError otherwise — a composite modulus has no Legendre symbol,
    and returning a plausible-looking +-1 for one is worse than failing.
    """
    if p < 3 or p % 2 == 0 or not is_prime(p):
        raise ValueError(f"{p} is not an odd prime")

    a %= p
    if a == 0:
        return 0
    return 1 if pow(a, (p - 1) // 2, p) == 1 else -1


def jacobi_symbol(a: int, n: int) -> int:
    """Jacobi symbol (a/n) for odd n > 0; equals the Legendre symbol when n is prime."""
    if n <= 0 or n % 2 == 0:
        raise ValueError("the Jacobi symbol needs a positive odd modulus")

    a %= n
    result = 1

    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5):
                result = -result
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3:
            result = -result
        a %= n

    return result if n == 1 else 0


def tam_kalan_sistemi(liste: list[int]) -> dict | None:
    """
    Check whether ``liste`` is a complete residue system modulo its own length.

    Returns a dict with the reduced residue system when it is, else None.
    """
    n = len(liste)
    if n == 0:
        return None

    if len({x % n for x in liste}) != n:
        return None

    rrs = [x for x in liste if ebob(x, n) == 1]
    return {"n": n, "is_crs": True, "rrs": rrs, "phi": euler_phi(n)}


# English aliases
gcd = ebob
lcm = ekok
ext_gcd = ext_ebob


# ---------------------------------------------------------------------------
# Demo
# ---------------------------------------------------------------------------

def demo() -> None:
    """Print a short verification run, mirroring the extension's defaults."""
    print("--- ENT Python module verification ---")
    print(f"gcd(12, 18)                = {ebob(12, 18)}")
    print(f"lcm(12, 18)                = {ekok(12, 18)}")
    print(f"ext_gcd(21, -35)           = {ext_ebob(21, -35)}   (d must be positive)")

    solution = diophantus_solver(153, -803, 44)
    if solution is None:
        print("153x - 803y = 44          -> no integer solution")
    else:
        print(
            f"153x - 803y = 44          -> d = {solution['d']}, "
            f"x0 = {solution['x0']}, y0 = {solution['y0']}, "
            f"x(t) = x0 + ({solution['step_x']})t, y(t) = y0 + ({solution['step_y']})t"
        )

    print(f"140x = 133 (mod 301)       -> {solve_linear_congruence(140, 133, 301)}")
    print(f"prime factors of 301       = {asal_bolenler(301)}")
    print(f"factorisation of 24000     = {prime_factorization(24000)}")
    print(f"tau(24000), sigma(24000)   = {tau(24000)}, {sigma(24000)}")
    print(f"phi(24000)                 = {euler_phi(24000)}")
    print(f"mu(30), mu(12)             = {mobius(30)}, {mobius(12)}")
    print(f"crt x=2(3), 3(5), 2(7)     = {crt([(2, 3), (3, 5), (2, 7)])}")
    print(f"ord_7(3)                   = {multiplicative_order(3, 7)}")
    print(f"(10/13) Legendre           = {legendre_symbol(10, 13)}")
    print(f"(1001/9907) Jacobi         = {jacobi_symbol(1001, 9907)}")
    print(f"is_prime(561) [Carmichael] = {is_prime(561)}")


if __name__ == "__main__":
    demo()
