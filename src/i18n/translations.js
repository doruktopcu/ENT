/**
 * English and Turkish strings for the Elementary Number Theory extension.
 *
 * Rules for contributors:
 *  - The two trees must stay structurally identical; `npm test` is not aware of
 *    them, so a missing key silently falls back to English at runtime.
 *  - Placeholders use `{name}` and are filled by `t(key, vars)`.
 *  - Never concatenate translated fragments in a component — word order differs
 *    between English and Turkish. Add a parameterised sentence here instead.
 *  - Keep Turkish-only vocabulary (EBOB, EKOK, TKS, IKS) out of the `en` tree.
 */

export const SUPPORTED_LANGUAGES = ['en', 'tr'];

export const translations = {
  en: {
    appTitle: "Number Theory Lab",
    appSubtitle: 'Interactive solvers, derivations, custom workbench and a theory guide',
    labFullView: 'Full Lab View',
    labFullViewTitle: 'Open in a full browser tab',
    searchPlaceholder: 'Search topics (e.g. Extended GCD, Diophantine, Euler totient, CRT)…',
    matchingTopics: 'Matching topics & solvers',
    clearSearch: 'Clear search',
    noSearchResults: 'No topic matches “{query}”.',
    solverListHeading: 'Solvers ({count})',
    footerTagline: "Elementary Number Theory Lab • v{version}",

    nav: {
      sections: 'Lab sections',
      solverList: 'Solver list',
    },

    tabs: {
      solvers: 'Solvers',
      workbench: 'Workbench',
      history: 'History',
      wiki: 'Theory Guide',
      settings: 'Settings',
    },

    notes: {
      title: "Lecture Notes",
      subtitle: 'Intuition, formal statements and historical background',
      showNotes: 'Show notes',
      hideNotes: 'Hide notes',
      intuition: 'Intuition & tips',
      theorem: 'Formal theorem',
      history: 'Historical context',
    },

    solvers: {
      compute: 'Compute',
      saveToHistory: 'Save to history',
      saved: 'Saved',
      result: 'Result',
      solutionExists: 'A solution exists.',
      noSolution: 'No solution exists',
      invalidInputTitle: 'Check the inputs',
      particularSolution: 'Particular solution',
      generalSolution: 'General solution',
      stepByStep: 'Step-by-step derivation',
      sampleSolutions: 'Sample integer solutions',
      parameter: 'Parameter',
      verification: 'Check',
      step: 'Step',
      divisionEquation: 'Division equation',
      quotient: 'Quotient q',
      remainder: 'Remainder r',
      bezoutIdentity: 'Bezout identity',
      formula: 'Formula',
      gcdLabel: 'Greatest common divisor',
      lcmLabel: 'Least common multiple',
      euclideanBadge: 'Euclidean & extended Euclidean algorithm',
      diophantineSolvable: 'gcd({a}, {b}) = {d} divides {c}, so integer solutions exist.',
      congruenceSolutionCount:
        'There are exactly {count} incongruent solutions modulo {m}.',
      incongruentSolutionsHeading: 'Incongruent solutions modulo {m}',
      canonicalDecomposition: 'Canonical prime decomposition',
      prime: 'Prime',
      composite: 'Composite',
      unit: 'Unit',
      numberOfDivisors: 'Number of divisors',
      sumOfDivisors: 'Sum of divisors',
      mobiusValue: 'Möbius function',
      mobiusSquarefree: 'Squarefree — μ(n) = {value}',
      mobiusNotSquarefree: 'Not squarefree — μ(n) = 0',
      divisorList: 'All divisors',
      divisorListTruncated: 'Showing the first {shown} of {total} divisors.',
      tauFormulaNote: 'τ(n) = ∏ (kᵢ + 1), where kᵢ are the prime exponents.',
      sigmaFormulaNote: 'σ(n) = ∏ (pᵢ^(kᵢ+1) − 1) / (pᵢ − 1).',
      uniqueSolutionModulo: 'Unique solution modulo M = {m}',
      crtBreakdown: 'CRT component breakdown',
      addCongruence: 'Add congruence',
      removeCongruence: 'Remove this congruence',
      fastExponentiation: 'Fast modular exponentiation',
      multiplicativeOrder: 'Multiplicative order',
      primitiveRootStatus: 'Primitive root status',
      isPrimitiveRoot: 'Primitive root modulo {m}',
      isNotPrimitiveRoot: 'Not a primitive root — ord < φ({m}) = {phi}',
      legendreResult: 'Legendre symbol',
      eulerCriterion: "Euler's criterion",
      quadraticResidue: 'Quadratic residue',
      quadraticNonResidue: 'Quadratic non-residue',
      divisibleByP: 'Divisible by p',
      witnessRoot: 'Witness: {x}² ≡ {a} (mod {p})',
      jacobiSymbol: 'Jacobi symbol',
      jacobiNote:
        'The Jacobi symbol extends the Legendre symbol to odd composite moduli. Note that (a/n) = +1 does not by itself prove a is a quadratic residue.',
      rootsFound: 'Found {count} root(s) modulo {m}',
      noRootsFound: 'No x satisfies f(x) ≡ {b} (mod {m}).',
      evaluationTable: 'Modular evaluation table',
      polynomialScanTruncated:
        'The modulus is large; only x = 0 … {scanned} − 1 was scanned.',
      residuePreviewTruncated: 'Showing the first {shown} residues of {total}.',
      root: 'Root',
      status: 'Status',
      crsHeading: 'Complete residue system (CRS)',
      rrsHeading: 'Reduced residue system (RRS)',
      crsCount: 'Complete residue system size = {n}',
      rrsCount: 'Reduced residue system size = φ({n}) = {phi}',
      totientMeaning:
        'There are exactly {phi} integers in 1 … {n} that are coprime to {n}.',
      primeFactorBreakdown: 'Prime factor contributions',
      primeFactorRow: 'p = {p}, exponent {k}',
    },

    fields: {
      integerA: 'Integer a',
      integerB: 'Integer b',
      integerN: 'Integer n',
      positiveIntegerN: 'Positive integer n',
      coefficientA: 'Coefficient a',
      coefficientB: 'Coefficient b',
      constantB: 'Constant b',
      constantC: 'Constant c',
      modulusM: 'Modulus m',
      oddPrimeP: 'Odd prime p',
      baseA: 'Base a',
      exponentE: 'Exponent e',
      targetValueB: 'Target value b',
      remainderA: 'Remainder a',
      coefficientOf: 'Coefficient of {term}',
      constantTerm: 'Constant term',
      multiplierA: 'Multiplier a',
      rangeLimit: 'Upper bound N',
    },

    workbench: {
      title: 'Custom formula workbench',
      subtitle:
        'Tune parameters, sweep a range and watch how a sequence behaves across its bounds.',
      foundMatches: 'Matches',
      selectTemplate: 'Formula template',
      template1: 'Perfect square generator',
      template2: 'Fermat primality scan',
      template3: 'Modular multiplication sweep',
      rangeBounds: 'Evaluation range (1 … N)',
      outputTable: 'Sequence output',
      inputColumn: 'Input',
      evaluatedExpr: 'Evaluated expression',
      status: 'Status',
      perfectSquare: 'Perfect square: {root}² = {value}',
      notPerfectSquare: 'Not a perfect square',
      fermatProbablePrime: 'Passes base {a} — and {n} is prime',
      fermatPseudoprime: 'Passes base {a} — but {n} is COMPOSITE (pseudoprime)',
      fermatComposite: 'Fails base {a} — {n} is composite',
      fermatNotCoprime: 'Skipped — gcd({a}, {n}) = {gcd} ≠ 1',
      fermatCaveat:
        'Passing the Fermat test does not prove primality: Carmichael numbers such as 561 pass for every coprime base. Highlighted rows are the ones that pass.',
      remainderIs: 'Remainder = {value}',
      emptyRange: 'No values to evaluate for this range.',
      invalidParameters: 'Enter whole numbers for every parameter.',
      modulusMustBePositive: 'The modulus must be a positive integer.',
    },

    history: {
      title: 'Calculation history',
      subtitle: 'Revisit solved problems and reload their parameters.',
      empty: 'No history yet. Solve a problem and press “Save to history”.',
      noMatches: 'No saved calculation matches “{query}”.',
      clearAll: 'Clear history',
      confirmClear: 'Delete all saved calculations?',
      loadProblem: 'Load',
      delete: 'Delete entry',
      inputs: 'Inputs',
      searchPlaceholder: 'Search saved problems by topic, formula or input…',
    },

    settings: {
      title: 'Settings',
      subtitle: 'Appearance, computation limits, startup behaviour and stored data.',

      appearance: 'Appearance',
      appearanceHelp: 'How the lab looks and which language it speaks.',
      language: 'Language',
      languageHelp: 'Applies to every solver, lecture note and guide entry.',
      theme: 'Theme',
      themeHelp: 'Pick an appearance, or follow your operating system.',
      dark: 'Dark',
      light: 'Light',
      system: 'System',

      computation: 'Computation limits',
      computationHelp:
        'The lab computes as you type, so these caps stop a large input from freezing the window. Raising them trades responsiveness for reach.',
      residuePreviewLimit: 'Residue preview limit',
      residuePreviewLimitHelp:
        'How many residues to list for the totient solver before truncating the preview.',
      polynomialScanLimit: 'Polynomial scan limit',
      polynomialScanLimitHelp:
        'How far to search for roots of f(x) = b (mod m) when the modulus is large.',
      factorisationBudget: 'Factorisation budget',
      factorisationBudgetHelp:
        'Trial-division candidates to try before giving up. Primes are still detected instantly regardless of this value.',

      startup: 'Startup',
      startupHelp: 'What the lab shows when you open it.',
      startupTab: 'Open on tab',
      startupSolver: 'Default solver',

      historySection: 'History',
      historySectionHelp: 'How calculations get recorded.',
      historyLimit: 'Entries kept',
      historyLimitHelp: 'The oldest entries are dropped once the limit is reached.',
      saveMode: 'Saving',
      saveModeHelp:
        'Automatic saving records a calculation once the inputs stop changing, rather than on every keystroke.',
      saveManual: 'Manual',
      saveAuto: 'Automatic',

      data: 'Data',
      dataHelp: 'Everything is stored locally in this browser and is never uploaded.',
      storageUsed: 'Storage used',
      entriesSaved: 'Entries saved',
      exportHistory: 'Export history',
      importHistory: 'Import history',
      exportDone: 'Exported {count} entries.',
      importDone: 'Imported {added} new entries out of {total}.',
      importInvalidJson: 'That file is not valid JSON.',
      importUnrecognised: 'That file does not look like an exported history.',
      importNoEntries: 'No usable entries were found in that file.',
      historyCleared: 'History cleared.',
      restoreDefaults: 'Restore defaults',
      resetEverything: 'Reset everything',
      confirmResetEverything:
        'Reset language, theme and every setting, and delete all saved calculations?',
      resetDone: 'Everything has been reset.',
    },

    topics: {
      gcd_lcm: {
        title: 'Extended GCD & LCM',
        description:
          'Euclidean algorithm, Bezout coefficients au + bv = d, and the least common multiple',
      },
      diophantine: {
        title: 'Linear Diophantine equations',
        description: 'Solve ax + by = c over the integers with parametric solutions x(t), y(t)',
      },
      linear_congruence: {
        title: 'Linear congruences ax ≡ b (mod m)',
        description: 'All incongruent solutions, modular inverse and reduction mod m',
      },
      modular_poly: {
        title: 'Modular polynomial roots',
        description: 'Roots of degree 1–5 polynomials f(x) ≡ b (mod m)',
      },
      euler_phi: {
        title: 'Euler totient φ(n) & residue systems',
        description: 'Compute φ(n), complete residue systems ℤₙ and reduced systems (ℤ/nℤ)ˣ',
      },
      prime_factor: {
        title: 'Prime factorisation & divisors',
        description: 'Canonical decomposition, divisor count τ(n), divisor sum σ(n), Möbius μ(n)',
      },
      crt: {
        title: 'Chinese Remainder Theorem',
        description: 'Simultaneous congruences x ≡ aᵢ (mod mᵢ) with coprime moduli',
      },
      mod_exp: {
        title: 'Modular exponentiation & order',
        description: 'Fast modular power aᵉ mod m, order ordₘ(a) and primitive root test',
      },
      quadratic_residue: {
        title: 'Quadratic residues & Legendre symbol',
        description: "Legendre symbol (a/p), Euler's criterion, Jacobi symbol",
      },
    },

    insights: {
      gcd_lcm: {
        pedagogy:
          'The Euclidean algorithm rests on the invariant gcd(a, b) = gcd(b, a mod b). The extended version tracks the coefficients back up the chain to write the gcd as a linear combination au + bv = d — that is Bezout’s identity.',
        theorem:
          'a u + b v = \\gcd(a, b) \\quad \\text{for some } u, v \\in \\mathbb{Z}',
        history:
          'Described by Euclid in Book VII of the Elements (c. 300 BC); the coefficient form is credited to Claude Gaspard Bachet de Méziriac (1621).',
      },
      diophantine: {
        pedagogy:
          'ax + by = c has integer solutions if and only if d = gcd(a, b) divides c. Find one particular solution with the extended Euclidean algorithm, then slide along the line: x = x₀ + (b/d)t, y = y₀ − (a/d)t.',
        theorem: 'a x + b y = c \\text{ is solvable} \\iff \\gcd(a, b) \\mid c',
        history: 'Named after Diophantus of Alexandria (3rd century AD), author of the Arithmetica.',
      },
      linear_congruence: {
        pedagogy:
          'ax ≡ b (mod m) is the Diophantine equation ax − my = b in disguise. It has exactly d = gcd(a, m) incongruent solutions modulo m when d divides b, and none otherwise.',
        theorem: 'a x \\equiv b \\pmod{m} \\iff a x - m y = b \\text{ for some } y \\in \\mathbb{Z}',
        history:
          'Gauss introduced the ≡ notation for congruences in the Disquisitiones Arithmeticae (1801).',
      },
      modular_poly: {
        pedagogy:
          'Over a prime modulus p, Lagrange’s theorem bounds a degree-n polynomial by n roots. Over a composite modulus that bound fails — x² ≡ 1 (mod 8) already has four solutions.',
        theorem:
          'f \\not\\equiv 0, \\deg f = n, p \\text{ prime} \\implies f \\text{ has at most } n \\text{ roots mod } p',
        history: 'Proved by Joseph-Louis Lagrange in 1768.',
      },
      euler_phi: {
        pedagogy:
          'φ(n) counts the integers in 1 … n that are coprime to n. It is multiplicative: φ(mn) = φ(m)φ(n) whenever gcd(m, n) = 1. Euler’s theorem then gives a^φ(m) ≡ 1 (mod m) for every a coprime to m.',
        theorem:
          '\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right), \\quad a^{\\varphi(m)} \\equiv 1 \\pmod{m}',
        history: 'Introduced by Leonhard Euler in 1763; the φ notation is due to Gauss.',
      },
      prime_factor: {
        pedagogy:
          'The fundamental theorem of arithmetic gives every n > 1 a unique prime decomposition p₁^k₁ ⋯ pᵣ^kᵣ. From the exponents alone you get τ(n) = ∏(kᵢ + 1) divisors and σ(n) = ∏ (pᵢ^(kᵢ+1) − 1)/(pᵢ − 1).',
        theorem:
          'n = \\prod_{i=1}^{r} p_i^{k_i} \\implies \\tau(n) = \\prod_{i=1}^{r} (k_i + 1)',
        history:
          'Euclid proved the key lemma; Gauss gave the first complete statement and proof in 1801.',
      },
      crt: {
        pedagogy:
          'With pairwise coprime moduli the system x ≡ aᵢ (mod mᵢ) has exactly one solution modulo M = ∏mᵢ. Build it term by term: each Mᵢ = M/mᵢ is invertible mod mᵢ, so aᵢMᵢyᵢ hits aᵢ in slot i and vanishes everywhere else.',
        theorem:
          'x \\equiv \\sum_{i=1}^{r} a_i M_i y_i \\pmod{M}, \\quad M_i = \\frac{M}{m_i}, \\quad M_i y_i \\equiv 1 \\pmod{m_i}',
        history:
          'First recorded by Sunzi in the Sunzi Suanjing (3rd–5th century AD); the general statement is due to Qin Jiushao (1247).',
      },
      mod_exp: {
        pedagogy:
          'Computing aᵉ then reducing is hopeless for large e. Square-and-multiply walks the binary digits of e, reducing mod m at every step, so the numbers never exceed m² and only O(log e) multiplications are needed.',
        theorem: 'e = \\sum_i b_i 2^i \\implies a^e = \\prod_i \\left(a^{2^i}\\right)^{b_i} \\pmod{m}',
        history:
          'The method appears in Pingala’s Chandaḥśāstra (c. 200 BC) and was popularised in computing by Donald Knuth.',
      },
      quadratic_residue: {
        pedagogy:
          'a is a quadratic residue mod p when x² ≡ a (mod p) is solvable. Euler’s criterion decides it in one modular power: (a/p) ≡ a^((p−1)/2) (mod p). Quadratic reciprocity then links (p/q) and (q/p) for distinct odd primes.',
        theorem:
          '\\left(\\frac{a}{p}\\right) \\equiv a^{\\frac{p-1}{2}} \\pmod{p}, \\quad \\left(\\frac{p}{q}\\right)\\left(\\frac{q}{p}\\right) = (-1)^{\\frac{p-1}{2}\\frac{q-1}{2}}',
        history:
          'Gauss called quadratic reciprocity the “golden theorem” and published six different proofs of it.',
      },
    },

    steps: {
      diophantine: {
        step1: 'Compute the greatest common divisor.',
        step2: 'Check divisibility — {d} divides {c}, so a solution exists.',
        step3: 'Extract Bezout coefficients from the extended Euclidean algorithm.',
        step4: 'Scale the Bezout identity by {k}.',
        step5: 'Read off the particular solution.',
        step6: 'Write the general solution for every t ∈ ℤ.',
      },
      congruence: {
        step1: 'Compute d = gcd(a, m).',
        step2: 'Since {d} divides {b}, solutions exist.',
        step3: 'Divide the congruence through by {d}.',
        step4: 'Invert the reduced coefficient modulo {m}.',
        step5: 'Solve the reduced congruence.',
        step6: 'Lift to all {count} incongruent solutions modulo {m}.',
        trivialModulus: 'Every integer is congruent modulo 1, so x ≡ 0 is the only class.',
      },
    },

    engine: {
      invalidInput: 'Enter whole numbers in every field.',
      modulusMustBePositive: 'The modulus must be a positive integer.',
      requiresPositiveInteger: 'This function needs a positive integer.',
      requiresIntegerAboveOne: 'This test needs an integer greater than 1.',
      factorizationUndefinedForZero: 'Zero has no prime factorisation.',
      factorizationTooLarge:
        'No small factor was found within the search budget, so {n} could not be fully factorised here.',
      gcdDoesNotDivideC:
        'gcd({a}, {b}) = {d} does not divide {c}, so ax + by = c has no integer solution.',
      gcdDoesNotDivideB:
        'gcd({a}, {m}) = {d} does not divide {b}, so the congruence has no solution.',
      zeroCoefficientsNoSolution: '0x + 0y can never equal a non-zero constant.',
      everyPairIsASolution: '0x + 0y = 0 holds for every pair of integers.',
      noCongruences: 'Add at least one congruence.',
      moduliNotCoprime:
        'Moduli {m1} and {m2} share the factor {gcd}. The classical CRT needs pairwise coprime moduli.',
      notCoprime: 'The values are not coprime (gcd = {gcd}), so no inverse exists.',
      noInverseForNegativeExponent:
        'A negative exponent needs a modular inverse, but {a} is not invertible modulo {m}.',
      orderRequiresCoprime:
        'ord_m(a) is defined only when gcd(a, m) = 1, but gcd({a}, {m}) = {gcd}.',
      orderNotFound: 'No multiplicative order could be determined.',
      legendreRequiresOddPrime: 'The Legendre symbol needs an odd prime modulus; {p} is not one.',
      legendreModulusNotPrime:
        '{p} is not prime, so the Legendre symbol is undefined. Use the Jacobi symbol below instead.',
      jacobiRequiresOddPositive: 'The Jacobi symbol needs a positive odd modulus.',
    },

    wiki: {
      title: 'Elementary number theory guide',
      subtitle: 'Definitions, formal statements, LaTeX notation and external references.',
      searchPlaceholder: 'Search definitions and theorems…',
      allTopics: 'All topics',
      reference: 'Reference',
      noResults: 'No entry matches “{query}”.',
      categories: {
        divisibility: 'Divisibility',
        modular: 'Modular arithmetic',
        equations: 'Equations',
        functions: 'Arithmetic functions',
        theorems: 'Theorems',
        residues: 'Residues',
      },
      entries: {
        divisibility: {
          title: 'Divisibility & greatest common divisor',
          summary:
            'a divides b (written a | b) when b = ak for some integer k. The gcd is the largest positive integer dividing both.',
          details:
            'The Euclidean algorithm computes gcd(a, b) in O(log min(a, b)) division steps, and Bezout’s identity guarantees integers u, v with au + bv = gcd(a, b).',
        },
        congruence: {
          title: 'Modular congruence',
          summary:
            'a and b are congruent modulo m when m divides their difference a − b.',
          details:
            'Congruence is an equivalence relation compatible with addition, subtraction and multiplication. Division is the exception: you may cancel c only when gcd(c, m) = 1.',
        },
        diophantine: {
          title: 'Linear Diophantine equations',
          summary: 'Equations with integer coefficients solved over the integers: ax + by = c.',
          details:
            'Solvable exactly when gcd(a, b) | c. Given one solution (x₀, y₀), every solution is x = x₀ + (b/d)t, y = y₀ − (a/d)t with d = gcd(a, b) and t ∈ ℤ.',
        },
        euler_phi: {
          title: 'Euler’s totient function φ(n)',
          summary: 'Counts the integers in 1 … n that are coprime to n.',
          details:
            'φ(p) = p − 1 for prime p and φ(pᵏ) = pᵏ − pᵏ⁻¹. It is multiplicative on coprime arguments, and Euler’s theorem gives a^φ(m) ≡ 1 (mod m) when gcd(a, m) = 1.',
        },
        mobius: {
          title: 'Möbius function & inversion',
          summary:
            'μ(n) is 0 when n has a squared prime factor, and (−1)^k when n is a product of k distinct primes.',
          details:
            'The Möbius inversion formula recovers f from its divisor sums: if g(n) = Σ_{d|n} f(d) then f(n) = Σ_{d|n} μ(d) g(n/d). It also gives φ(n) = Σ_{d|n} μ(d)·n/d.',
        },
        fermat_theorem: {
          title: "Fermat's little theorem",
          summary: 'If p is prime and p does not divide a, then a^(p−1) ≡ 1 (mod p).',
          details:
            'The basis of fast primality screening and of RSA. The converse fails: Carmichael numbers such as 561 satisfy the congruence for every coprime base without being prime.',
        },
        euler_theorem: {
          title: "Euler's theorem",
          summary: 'If gcd(a, m) = 1 then a^φ(m) ≡ 1 (mod m).',
          details:
            'Generalises Fermat’s little theorem from prime to arbitrary moduli, and explains why exponents in modular arithmetic can be reduced modulo φ(m).',
        },
        crt: {
          title: 'Chinese Remainder Theorem',
          summary:
            'A system of congruences with pairwise coprime moduli has exactly one solution modulo the product of the moduli.',
          details:
            'Equivalently ℤ/Mℤ ≅ ℤ/m₁ℤ × ⋯ × ℤ/mᵣℤ as rings. Used in multi-precision arithmetic, secret sharing and RSA decryption speed-ups.',
        },
        primitive_root: {
          title: 'Multiplicative order & primitive roots',
          summary:
            'ord_m(a) is the least k > 0 with a^k ≡ 1 (mod m); a is a primitive root when ord_m(a) = φ(m).',
          details:
            'The order always divides φ(m). Primitive roots exist exactly for m = 1, 2, 4, pᵏ and 2pᵏ with p an odd prime — not for every modulus.',
        },
        wilson_theorem: {
          title: "Wilson's theorem",
          summary: 'An integer n > 1 is prime if and only if (n − 1)! ≡ −1 (mod n).',
          details:
            'Elegant but impractical as a primality test: computing (n − 1)! costs far more than trial division.',
        },
        quadratic_residue: {
          title: 'Quadratic residues & the Legendre symbol',
          summary:
            'a is a quadratic residue mod p when x² ≡ a (mod p) is solvable. The Legendre symbol is +1 for residues, −1 for non-residues and 0 when p | a.',
          details:
            'Euler’s criterion evaluates it as a^((p−1)/2) mod p. Quadratic reciprocity relates (p/q) and (q/p) for distinct odd primes, with supplements for −1 and 2.',
        },
        jacobi: {
          title: 'Jacobi symbol',
          summary:
            'Extends the Legendre symbol to any odd positive modulus n by multiplying the symbols of its prime factors.',
          details:
            'Computable by reciprocity without factoring n. Careful: (a/n) = +1 does not imply a is a quadratic residue mod n — only (a/n) = −1 proves it is not.',
        },
      },
    },
  },

  tr: {
    appTitle: 'Sayılar Teorisi Laboratuvarı',
    appSubtitle: 'Etkileşimli çözücüler, çıkarımlar, özel formül tezgâhı ve teori rehberi',
    labFullView: 'Tam Ekran Laboratuvar',
    labFullViewTitle: 'Yeni bir tarayıcı sekmesinde aç',
    searchPlaceholder:
      'Konu ara (örn. Genişletilmiş EBOB, Diophantus, Euler fonksiyonu, ÇKT)…',
    matchingTopics: 'Eşleşen konular ve çözücüler',
    clearSearch: 'Aramayı temizle',
    noSearchResults: '“{query}” ile eşleşen konu yok.',
    solverListHeading: 'Çözücüler ({count})',
    footerTagline: 'Temel Sayılar Teorisi Laboratuvarı • s{version}',

    nav: {
      sections: 'Laboratuvar bölümleri',
      solverList: 'Çözücü listesi',
    },

    tabs: {
      solvers: 'Çözücüler',
      workbench: 'Formül Tezgâhı',
      history: 'Geçmiş',
      wiki: 'Teori Rehberi',
      settings: 'Ayarlar',
    },

    notes: {
      title: "Ders Notları",
      subtitle: 'Sezgi, formal ifadeler ve tarihsel arka plan',
      showNotes: 'Notları göster',
      hideNotes: 'Notları gizle',
      intuition: 'Sezgi ve ipuçları',
      theorem: 'Formal teorem',
      history: 'Tarihsel arka plan',
    },

    solvers: {
      compute: 'Hesapla',
      saveToHistory: 'Geçmişe kaydet',
      saved: 'Kaydedildi',
      result: 'Sonuç',
      solutionExists: 'Çözüm vardır.',
      noSolution: 'Çözüm yoktur',
      invalidInputTitle: 'Girdileri kontrol edin',
      particularSolution: 'Özel çözüm',
      generalSolution: 'Genel çözüm',
      stepByStep: 'Adım adım çıkarım',
      sampleSolutions: 'Örnek tam sayı çözümleri',
      parameter: 'Parametre',
      verification: 'Kontrol',
      step: 'Adım',
      divisionEquation: 'Bölme denklemi',
      quotient: 'Bölüm q',
      remainder: 'Kalan r',
      bezoutIdentity: 'Bezout özdeşliği',
      formula: 'Formül',
      gcdLabel: 'En büyük ortak bölen (EBOB)',
      lcmLabel: 'En küçük ortak kat (EKOK)',
      euclideanBadge: 'Öklid ve genişletilmiş Öklid algoritması',
      diophantineSolvable:
        'EBOB({a}, {b}) = {d} sayısı {c} sayısını böldüğü için tam sayı çözümleri vardır.',
      congruenceSolutionCount: '{m} modülüne göre tam olarak {count} denk olmayan çözüm vardır.',
      incongruentSolutionsHeading: '{m} modülüne göre denk olmayan çözümler',
      canonicalDecomposition: 'Kanonik asal çarpanlara ayrılış',
      prime: 'Asal',
      composite: 'Bileşik',
      unit: 'Birim',
      numberOfDivisors: 'Bölen sayısı',
      sumOfDivisors: 'Bölenler toplamı',
      mobiusValue: 'Möbius fonksiyonu',
      mobiusSquarefree: 'Karesiz — μ(n) = {value}',
      mobiusNotSquarefree: 'Karesiz değil — μ(n) = 0',
      divisorList: 'Tüm bölenler',
      divisorListTruncated: '{total} bölenden ilk {shown} tanesi gösteriliyor.',
      tauFormulaNote: 'τ(n) = ∏ (kᵢ + 1); burada kᵢ asal kuvvetleridir.',
      sigmaFormulaNote: 'σ(n) = ∏ (pᵢ^(kᵢ+1) − 1) / (pᵢ − 1).',
      uniqueSolutionModulo: 'M = {m} modülüne göre tek çözüm',
      crtBreakdown: 'ÇKT bileşenlerinin ayrıntısı',
      addCongruence: 'Kongrüans ekle',
      removeCongruence: 'Bu kongrüansı sil',
      fastExponentiation: 'Hızlı modüler üs alma',
      multiplicativeOrder: 'Çarpımsal mertebe',
      primitiveRootStatus: 'İlkel kök durumu',
      isPrimitiveRoot: '{m} modülüne göre ilkel köktür',
      isNotPrimitiveRoot: 'İlkel kök değil — mertebe < φ({m}) = {phi}',
      legendreResult: 'Legendre sembolü',
      eulerCriterion: 'Euler kriteri',
      quadraticResidue: 'Karesel kalan',
      quadraticNonResidue: 'Karesel kalan değil',
      divisibleByP: "p'ye bölünüyor",
      witnessRoot: 'Tanık: {x}² ≡ {a} (mod {p})',
      jacobiSymbol: 'Jacobi sembolü',
      jacobiNote:
        'Jacobi sembolü, Legendre sembolünü tek bileşik modüllere genişletir. Dikkat: (a/n) = +1 olması tek başına a’nın karesel kalan olduğunu kanıtlamaz.',
      rootsFound: '{m} modülüne göre {count} kök bulundu',
      noRootsFound: 'f(x) ≡ {b} (mod {m}) denkliğini sağlayan x yoktur.',
      evaluationTable: 'Modüler değerlendirme tablosu',
      polynomialScanTruncated:
        'Modül büyük olduğundan yalnızca x = 0 … {scanned} − 1 aralığı tarandı.',
      residuePreviewTruncated: '{total} kalandan ilk {shown} tanesi gösteriliyor.',
      root: 'Kök',
      status: 'Durum',
      crsHeading: 'Tam kalan sistemi (TKS)',
      rrsHeading: 'İndirgenmiş kalan sistemi (İKS)',
      crsCount: 'Tam kalan sistemi eleman sayısı = {n}',
      rrsCount: 'İndirgenmiş kalan sistemi eleman sayısı = φ({n}) = {phi}',
      totientMeaning: '1 … {n} aralığında {n} ile aralarında asal olan tam {phi} sayı vardır.',
      primeFactorBreakdown: 'Asal çarpan katkıları',
      primeFactorRow: 'p = {p}, kuvvet {k}',
    },

    fields: {
      integerA: 'Tam sayı a',
      integerB: 'Tam sayı b',
      integerN: 'Tam sayı n',
      positiveIntegerN: 'Pozitif tam sayı n',
      coefficientA: 'Katsayı a',
      coefficientB: 'Katsayı b',
      constantB: 'Sabit b',
      constantC: 'Sabit c',
      modulusM: 'Modül m',
      oddPrimeP: 'Tek asal p',
      baseA: 'Taban a',
      exponentE: 'Üs e',
      targetValueB: 'Hedef değer b',
      remainderA: 'Kalan a',
      coefficientOf: '{term} katsayısı',
      constantTerm: 'Sabit terim',
      multiplierA: 'Çarpan a',
      rangeLimit: 'Üst sınır N',
    },

    workbench: {
      title: 'Özel formül tezgâhı',
      subtitle:
        'Parametreleri ayarlayın, bir aralığı tarayın ve dizinin sınırlar boyunca davranışını izleyin.',
      foundMatches: 'Eşleşme',
      selectTemplate: 'Formül şablonu',
      template1: 'Tam kare üreteci',
      template2: 'Fermat asallık taraması',
      template3: 'Modüler çarpma taraması',
      rangeBounds: 'Değerlendirme aralığı (1 … N)',
      outputTable: 'Dizi çıktısı',
      inputColumn: 'Girdi',
      evaluatedExpr: 'Değerlendirilen ifade',
      status: 'Durum',
      perfectSquare: 'Tam kare: {root}² = {value}',
      notPerfectSquare: 'Tam kare değil',
      fermatProbablePrime: '{a} tabanını geçti — ve {n} asaldır',
      fermatPseudoprime: '{a} tabanını geçti — ama {n} BİLEŞİKTİR (sözde asal)',
      fermatComposite: '{a} tabanında kaldı — {n} bileşiktir',
      fermatNotCoprime: 'Atlandı — EBOB({a}, {n}) = {gcd} ≠ 1',
      fermatCaveat:
        'Fermat testini geçmek asallığı kanıtlamaz: 561 gibi Carmichael sayıları aralarında asal her taban için testi geçer. Vurgulanan satırlar testi geçenlerdir.',
      remainderIs: 'Kalan = {value}',
      emptyRange: 'Bu aralıkta değerlendirilecek değer yok.',
      invalidParameters: 'Her parametre için tam sayı girin.',
      modulusMustBePositive: 'Modül pozitif bir tam sayı olmalıdır.',
    },

    history: {
      title: 'Hesaplama geçmişi',
      subtitle: 'Çözülmüş problemleri yeniden görüntüleyin ve parametrelerini geri yükleyin.',
      empty: 'Henüz geçmiş yok. Bir problem çözüp “Geçmişe kaydet” düğmesine basın.',
      noMatches: '“{query}” ile eşleşen kayıtlı hesaplama yok.',
      clearAll: 'Geçmişi temizle',
      confirmClear: 'Kayıtlı tüm hesaplamalar silinsin mi?',
      loadProblem: 'Yükle',
      delete: 'Kaydı sil',
      inputs: 'Girdiler',
      searchPlaceholder: 'Kayıtlı problemleri konu, formül veya girdiye göre ara…',
    },

    settings: {
      title: 'Ayarlar',
      subtitle: 'Görünüm, hesaplama sınırları, açılış davranışı ve saklanan veriler.',

      appearance: 'Görünüm',
      appearanceHelp: 'Laboratuvarın görünüşü ve arayüz dili.',
      language: 'Arayüz dili',
      languageHelp: 'Tüm çözücüler, ders notları ve rehber kayıtları için geçerlidir.',
      theme: 'Tema',
      themeHelp: 'Bir görünüm seçin veya işletim sisteminizi izleyin.',
      dark: 'Karanlık',
      light: 'Aydınlık',
      system: 'Sistem',

      computation: 'Hesaplama sınırları',
      computationHelp:
        'Laboratuvar siz yazarken hesaplar; bu sınırlar büyük girdilerin pencereyi dondurmasını önler. Sınırı yükseltmek erişimi artırır ama akıcılığı azaltır.',
      residuePreviewLimit: 'Kalan önizleme sınırı',
      residuePreviewLimitHelp:
        'Euler fonksiyonu çözücüsünde önizleme kısaltılmadan önce kaç kalanın listeleneceği.',
      polynomialScanLimit: 'Polinom tarama sınırı',
      polynomialScanLimitHelp:
        'Modül büyük olduğunda f(x) = b (mod m) köklerinin ne kadar ileriye kadar aranacağı.',
      factorisationBudget: 'Çarpanlara ayırma bütçesi',
      factorisationBudgetHelp:
        'Vazgeçmeden önce denenecek bölen adayı sayısı. Bu değerden bağımsız olarak asal sayılar yine de anında saptanır.',

      startup: 'Açılış',
      startupHelp: 'Laboratuvarı açtığınızda ne görüneceği.',
      startupTab: 'Açılışta gösterilecek sekme',
      startupSolver: 'Varsayılan çözücü',

      historySection: 'Geçmiş',
      historySectionHelp: 'Hesaplamaların nasıl kaydedileceği.',
      historyLimit: 'Saklanacak kayıt sayısı',
      historyLimitHelp: 'Sınıra ulaşıldığında en eski kayıtlar silinir.',
      saveMode: 'Kaydetme',
      saveModeHelp:
        'Otomatik kaydetme, her tuş vuruşunda değil, girdiler değişmeyi bıraktığında hesaplamayı kaydeder.',
      saveManual: 'Elle',
      saveAuto: 'Otomatik',

      data: 'Veriler',
      dataHelp: 'Her şey bu tarayıcıda yerel olarak saklanır ve hiçbir yere gönderilmez.',
      storageUsed: 'Kullanılan alan',
      entriesSaved: 'Kayıt sayısı',
      exportHistory: 'Geçmişi dışa aktar',
      importHistory: 'Geçmişi içe aktar',
      exportDone: '{count} kayıt dışa aktarıldı.',
      importDone: '{total} kaydın {added} tanesi yeni olarak içe aktarıldı.',
      importInvalidJson: 'Bu dosya geçerli bir JSON değil.',
      importUnrecognised: 'Bu dosya dışa aktarılmış bir geçmişe benzemiyor.',
      importNoEntries: 'Bu dosyada kullanılabilir kayıt bulunamadı.',
      historyCleared: 'Geçmiş temizlendi.',
      restoreDefaults: 'Varsayılanlara dön',
      resetEverything: 'Her şeyi sıfırla',
      confirmResetEverything:
        'Dil, tema ve tüm ayarlar sıfırlansın, kayıtlı hesaplamaların tamamı silinsin mi?',
      resetDone: 'Her şey sıfırlandı.',
    },

    topics: {
      gcd_lcm: {
        title: 'Genişletilmiş EBOB ve EKOK',
        description:
          'Öklid algoritması, Bezout katsayıları au + bv = d ve en küçük ortak kat',
      },
      diophantine: {
        title: 'Lineer Diophantus denklemleri',
        description:
          'ax + by = c denklemini tam sayılarda çözme, parametrik çözümler x(t), y(t)',
      },
      linear_congruence: {
        title: 'Lineer kongrüanslar ax ≡ b (mod m)',
        description: 'Tüm denk olmayan çözümler, modüler ters ve mod m indirgemesi',
      },
      modular_poly: {
        title: 'Modüler polinom kökleri',
        description: '1–5. derece f(x) ≡ b (mod m) polinomlarının kökleri',
      },
      euler_phi: {
        title: 'Euler fonksiyonu φ(n) ve kalan sistemleri',
        description:
          'φ(n) hesabı, tam kalan sistemi ℤₙ ve indirgenmiş kalan sistemi (ℤ/nℤ)ˣ',
      },
      prime_factor: {
        title: 'Asal çarpanlara ayırma ve bölenler',
        description:
          'Kanonik ayrışım, bölen sayısı τ(n), bölenler toplamı σ(n), Möbius μ(n)',
      },
      crt: {
        title: 'Çin Kalan Teoremi',
        description:
          'Aralarında asal modüllerle eşzamanlı kongrüanslar x ≡ aᵢ (mod mᵢ)',
      },
      mod_exp: {
        title: 'Modüler üs alma ve mertebe',
        description:
          'Hızlı modüler kuvvet aᵉ mod m, mertebe ordₘ(a) ve ilkel kök testi',
      },
      quadratic_residue: {
        title: 'Karesel kalanlar ve Legendre sembolü',
        description: 'Legendre sembolü (a/p), Euler kriteri, Jacobi sembolü',
      },
    },

    insights: {
      gcd_lcm: {
        pedagogy:
          'Öklid algoritması EBOB(a, b) = EBOB(b, a mod b) değişmezine dayanır. Genişletilmiş sürüm katsayıları zincir boyunca geri taşıyarak EBOB’u au + bv = d lineer birleşimi olarak yazar; bu Bezout özdeşliğidir.',
        theorem: 'a u + b v = \\gcd(a, b) \\quad \\text{öyle ki } u, v \\in \\mathbb{Z}',
        history:
          'Öklid’in Elemanlar’ının VII. kitabında anlatılır (yaklaşık MÖ 300); katsayılı biçim Claude Gaspard Bachet de Méziriac’a atfedilir (1621).',
      },
      diophantine: {
        pedagogy:
          'ax + by = c denkleminin tam sayı çözümü ancak ve ancak d = EBOB(a, b) sayısı c’yi bölerse vardır. Genişletilmiş Öklid ile bir özel çözüm bulunur, sonra doğru boyunca kaydırılır: x = x₀ + (b/d)t, y = y₀ − (a/d)t.',
        theorem: 'a x + b y = c \\text{ çözülebilir} \\iff \\gcd(a, b) \\mid c',
        history:
          'Arithmetica’nın yazarı İskenderiyeli Diophantus’tan (MS 3. yüzyıl) adını alır.',
      },
      linear_congruence: {
        pedagogy:
          'ax ≡ b (mod m) aslında ax − my = b Diophantus denklemidir. d = EBOB(a, m) sayısı b’yi böldüğünde m modülüne göre tam d adet denk olmayan çözüm vardır, aksi hâlde hiç yoktur.',
        theorem:
          'a x \\equiv b \\pmod{m} \\iff a x - m y = b, \\quad y \\in \\mathbb{Z}',
        history:
          'Gauss, kongrüanslar için ≡ gösterimini Disquisitiones Arithmeticae’de (1801) tanıttı.',
      },
      modular_poly: {
        pedagogy:
          'Asal bir p modülünde Lagrange teoremi n dereceli bir polinomu en çok n kökle sınırlar. Bileşik modüllerde bu sınır geçersizdir: x² ≡ 1 (mod 8) denkliğinin dört çözümü vardır.',
        theorem:
          'f \\not\\equiv 0, \\deg f = n, p \\text{ asal} \\implies f \\text{ mod } p \\text{ en çok } n \\text{ köke sahiptir}',
        history: 'Joseph-Louis Lagrange tarafından 1768’de kanıtlandı.',
      },
      euler_phi: {
        pedagogy:
          'φ(n), 1 … n aralığında n ile aralarında asal olan sayıları sayar. Çarpımsaldır: EBOB(m, n) = 1 iken φ(mn) = φ(m)φ(n). Euler teoremi de m ile aralarında asal her a için a^φ(m) ≡ 1 (mod m) verir.',
        theorem:
          '\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right), \\quad a^{\\varphi(m)} \\equiv 1 \\pmod{m}',
        history:
          'Leonhard Euler tarafından 1763’te tanıtıldı; φ gösterimi Gauss’a aittir.',
      },
      prime_factor: {
        pedagogy:
          'Aritmetiğin temel teoremi, n > 1 olan her sayıya tek bir p₁^k₁ ⋯ pᵣ^kᵣ asal ayrışımı verir. Yalnız kuvvetlerden τ(n) = ∏(kᵢ + 1) bölen sayısı ve σ(n) = ∏ (pᵢ^(kᵢ+1) − 1)/(pᵢ − 1) elde edilir.',
        theorem: 'n = \\prod_{i=1}^{r} p_i^{k_i} \\implies \\tau(n) = \\prod_{i=1}^{r} (k_i + 1)',
        history:
          'Temel önermeyi Öklid kanıtladı; ilk eksiksiz ifade ve ispat 1801’de Gauss’tan geldi.',
      },
      crt: {
        pedagogy:
          'Modüller ikişer ikişer aralarında asalsa x ≡ aᵢ (mod mᵢ) sisteminin M = ∏mᵢ modülüne göre tek çözümü vardır. Terim terim kurulur: her Mᵢ = M/mᵢ, mᵢ modülünde tersinirdir; böylece aᵢMᵢyᵢ yalnız i. konumda aᵢ verir, diğerlerinde sıfırlanır.',
        theorem:
          'x \\equiv \\sum_{i=1}^{r} a_i M_i y_i \\pmod{M}, \\quad M_i = \\frac{M}{m_i}, \\quad M_i y_i \\equiv 1 \\pmod{m_i}',
        history:
          'İlk kez Sunzi Suanjing’de kayda geçti (MS 3–5. yüzyıl); genel ifade Qin Jiushao’ya aittir (1247).',
      },
      mod_exp: {
        pedagogy:
          'Önce aᵉ hesaplayıp sonra indirgemek büyük e için umutsuzdur. Kare-al-ve-çarp yöntemi e’nin ikili basamaklarını dolaşır ve her adımda mod m indirger; böylece sayılar m²’yi aşmaz ve yalnız O(log e) çarpma gerekir.',
        theorem:
          'e = \\sum_i b_i 2^i \\implies a^e = \\prod_i \\left(a^{2^i}\\right)^{b_i} \\pmod{m}',
        history:
          'Yöntem Pingala’nın Chandaḥśāstra’sında görülür (yaklaşık MÖ 200); bilgisayar biliminde Donald Knuth yaygınlaştırdı.',
      },
      quadratic_residue: {
        pedagogy:
          'x² ≡ a (mod p) çözülebiliyorsa a, p modülüne göre karesel kalandır. Euler kriteri bunu tek bir modüler kuvvetle belirler: (a/p) ≡ a^((p−1)/2) (mod p). Karesel karşılıklılık ise farklı tek asallar için (p/q) ile (q/p) arasında bağ kurar.',
        theorem:
          '\\left(\\frac{a}{p}\\right) \\equiv a^{\\frac{p-1}{2}} \\pmod{p}, \\quad \\left(\\frac{p}{q}\\right)\\left(\\frac{q}{p}\\right) = (-1)^{\\frac{p-1}{2}\\frac{q-1}{2}}',
        history:
          'Gauss, karesel karşılıklılığı “altın teorem” diye andı ve altı ayrı ispatını yayımladı.',
      },
    },

    steps: {
      diophantine: {
        step1: 'En büyük ortak böleni hesapla.',
        step2: 'Bölünebilirliği kontrol et — {d} sayısı {c} sayısını böler, çözüm vardır.',
        step3: 'Genişletilmiş Öklid algoritmasından Bezout katsayılarını al.',
        step4: 'Bezout özdeşliğini {k} ile ölçekle.',
        step5: 'Özel çözümü oku.',
        step6: 'Her t ∈ ℤ için genel çözümü yaz.',
      },
      congruence: {
        step1: 'd = EBOB(a, m) değerini hesapla.',
        step2: '{d} sayısı {b} sayısını böldüğü için çözüm vardır.',
        step3: 'Kongrüansı {d} ile böl.',
        step4: 'İndirgenmiş katsayının {m} modülüne göre tersini al.',
        step5: 'İndirgenmiş kongrüansı çöz.',
        step6: '{m} modülüne göre {count} denk olmayan çözümün tamamına yükselt.',
        trivialModulus:
          'Her tam sayı 1 modülüne göre denktir, dolayısıyla tek sınıf x ≡ 0’dır.',
      },
    },

    engine: {
      invalidInput: 'Her alana tam sayı girin.',
      modulusMustBePositive: 'Modül pozitif bir tam sayı olmalıdır.',
      requiresPositiveInteger: 'Bu fonksiyon pozitif bir tam sayı gerektirir.',
      requiresIntegerAboveOne: "Bu test 1'den büyük bir tam sayı gerektirir.",
      factorizationUndefinedForZero: 'Sıfırın asal çarpanlara ayrılışı yoktur.',
      factorizationTooLarge:
        'Arama bütçesi içinde küçük bir çarpan bulunamadı, bu yüzden {n} burada tam olarak çarpanlarına ayrılamadı.',
      gcdDoesNotDivideC:
        'EBOB({a}, {b}) = {d} sayısı {c} sayısını bölmediğinden ax + by = c denkleminin tam sayı çözümü yoktur.',
      gcdDoesNotDivideB:
        'EBOB({a}, {m}) = {d} sayısı {b} sayısını bölmediğinden kongrüansın çözümü yoktur.',
      zeroCoefficientsNoSolution: '0x + 0y ifadesi sıfırdan farklı bir sabite eşit olamaz.',
      everyPairIsASolution: '0x + 0y = 0 her tam sayı çifti için sağlanır.',
      noCongruences: 'En az bir kongrüans ekleyin.',
      moduliNotCoprime:
        '{m1} ve {m2} modülleri {gcd} çarpanını paylaşıyor. Klasik ÇKT, ikişer ikişer aralarında asal modüller gerektirir.',
      notCoprime: 'Sayılar aralarında asal değil (EBOB = {gcd}), bu yüzden ters yoktur.',
      noInverseForNegativeExponent:
        'Negatif üs modüler ters gerektirir, ancak {a} sayısının {m} modülüne göre tersi yoktur.',
      orderRequiresCoprime:
        'ord_m(a) yalnızca EBOB(a, m) = 1 iken tanımlıdır, oysa EBOB({a}, {m}) = {gcd}.',
      orderNotFound: 'Çarpımsal mertebe belirlenemedi.',
      legendreRequiresOddPrime:
        'Legendre sembolü tek bir asal modül gerektirir; {p} böyle değil.',
      legendreModulusNotPrime:
        '{p} asal olmadığından Legendre sembolü tanımsızdır. Bunun yerine aşağıdaki Jacobi sembolünü kullanın.',
      jacobiRequiresOddPositive: 'Jacobi sembolü pozitif ve tek bir modül gerektirir.',
    },

    wiki: {
      title: 'Temel sayılar teorisi rehberi',
      subtitle: 'Tanımlar, formal ifadeler, LaTeX gösterimi ve dış kaynaklar.',
      searchPlaceholder: 'Tanım ve teoremlerde ara…',
      allTopics: 'Tüm konular',
      reference: 'Kaynak',
      noResults: '“{query}” ile eşleşen kayıt yok.',
      categories: {
        divisibility: 'Bölünebilme',
        modular: 'Modüler aritmetik',
        equations: 'Denklemler',
        functions: 'Aritmetik fonksiyonlar',
        theorems: 'Teoremler',
        residues: 'Kalanlar',
      },
      entries: {
        divisibility: {
          title: 'Bölünebilme ve en büyük ortak bölen',
          summary:
            'Bir k tam sayısı için b = ak ise a, b’yi böler (a | b yazılır). EBOB, ikisini birden bölen en büyük pozitif tam sayıdır.',
          details:
            'Öklid algoritması EBOB(a, b) değerini O(log min(a, b)) bölme adımında hesaplar; Bezout özdeşliği ise au + bv = EBOB(a, b) olacak u, v tam sayılarının varlığını garanti eder.',
        },
        congruence: {
          title: 'Modüler kongrüans',
          summary: 'm sayısı a − b farkını bölüyorsa a ile b, m modülüne göre denktir.',
          details:
            'Kongrüans; toplama, çıkarma ve çarpma ile uyumlu bir denklik bağıntısıdır. İstisna bölmedir: c ancak EBOB(c, m) = 1 iken sadeleştirilebilir.',
        },
        diophantine: {
          title: 'Lineer Diophantus denklemleri',
          summary:
            'Tam sayı katsayılı ve tam sayılarda çözülen denklemler: ax + by = c.',
          details:
            'Ancak EBOB(a, b) | c iken çözülebilir. Bir (x₀, y₀) çözümü bilindiğinde d = EBOB(a, b) ve t ∈ ℤ için tüm çözümler x = x₀ + (b/d)t, y = y₀ − (a/d)t biçimindedir.',
        },
        euler_phi: {
          title: 'Euler fonksiyonu φ(n)',
          summary: '1 … n aralığında n ile aralarında asal olan sayıları sayar.',
          details:
            'Asal p için φ(p) = p − 1 ve φ(pᵏ) = pᵏ − pᵏ⁻¹. Aralarında asal argümanlarda çarpımsaldır; Euler teoremi EBOB(a, m) = 1 iken a^φ(m) ≡ 1 (mod m) verir.',
        },
        mobius: {
          title: 'Möbius fonksiyonu ve ters çevirme',
          summary:
            'n bir asalın karesine bölünüyorsa μ(n) = 0; n birbirinden farklı k asalın çarpımıysa μ(n) = (−1)^k.',
          details:
            'Möbius ters çevirme formülü f’yi bölen toplamlarından geri getirir: g(n) = Σ_{d|n} f(d) ise f(n) = Σ_{d|n} μ(d) g(n/d). Ayrıca φ(n) = Σ_{d|n} μ(d)·n/d bağıntısını verir.',
        },
        fermat_theorem: {
          title: 'Fermat’nın küçük teoremi',
          summary: 'p asal ve p, a’yı bölmüyorsa a^(p−1) ≡ 1 (mod p) olur.',
          details:
            'Hızlı asallık elemesinin ve RSA’nın temelidir. Karşıtı doğru değildir: 561 gibi Carmichael sayıları asal olmadıkları hâlde aralarında asal her taban için kongrüansı sağlar.',
        },
        euler_theorem: {
          title: 'Euler teoremi',
          summary: 'EBOB(a, m) = 1 ise a^φ(m) ≡ 1 (mod m).',
          details:
            'Fermat’nın küçük teoremini asal modüllerden herhangi bir modüle genelleştirir ve modüler aritmetikte üslerin neden φ(m) modülünde indirgenebildiğini açıklar.',
        },
        crt: {
          title: 'Çin Kalan Teoremi',
          summary:
            'İkişer ikişer aralarında asal modüllere sahip bir kongrüans sisteminin, modüllerin çarpımı modülünde tam olarak bir çözümü vardır.',
          details:
            'Eşdeğer olarak halka izomorfizmi ℤ/Mℤ ≅ ℤ/m₁ℤ × ⋯ × ℤ/mᵣℤ geçerlidir. Çok duyarlıklı aritmetikte, sır paylaşımında ve RSA şifre çözmenin hızlandırılmasında kullanılır.',
        },
        primitive_root: {
          title: 'Çarpımsal mertebe ve ilkel kökler',
          summary:
            'ord_m(a), a^k ≡ 1 (mod m) sağlayan en küçük k > 0 sayısıdır; ord_m(a) = φ(m) ise a bir ilkel köktür.',
          details:
            'Mertebe daima φ(m) sayısını böler. İlkel kökler yalnızca m = 1, 2, 4, pᵏ ve 2pᵏ (p tek asal) için vardır — her modül için değil.',
        },
        wilson_theorem: {
          title: 'Wilson teoremi',
          summary: 'n > 1 tam sayısı ancak ve ancak (n − 1)! ≡ −1 (mod n) ise asaldır.',
          details:
            'Zarif ama asallık testi olarak kullanışsızdır: (n − 1)! hesaplamak deneme bölmesinden çok daha pahalıdır.',
        },
        quadratic_residue: {
          title: 'Karesel kalanlar ve Legendre sembolü',
          summary:
            'x² ≡ a (mod p) çözülebiliyorsa a, p modülüne göre karesel kalandır. Legendre sembolü kalanlar için +1, kalan olmayanlar için −1, p | a iken 0 değerini alır.',
          details:
            'Euler kriteri sembolü a^((p−1)/2) mod p olarak hesaplar. Karesel karşılıklılık, farklı tek asallar için (p/q) ile (q/p) arasında bağ kurar; −1 ve 2 için ek kuralları vardır.',
        },
        jacobi: {
          title: 'Jacobi sembolü',
          summary:
            'Legendre sembolünü, asal çarpanlarının sembollerini çarparak pozitif tek her n modülüne genişletir.',
          details:
            'n çarpanlarına ayrılmadan karşılıklılıkla hesaplanabilir. Dikkat: (a/n) = +1 olması a’nın n modülüne göre karesel kalan olduğunu göstermez; yalnızca (a/n) = −1 olmadığını kanıtlar.',
        },
      },
    },
  },
};
