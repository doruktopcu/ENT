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
      bookReference: 'Textbook: Crisman, Number Theory: In Context and Interactive, {sections}.',
      readOnline: 'Read online',
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
      modeLabel: 'Mode',
      listTruncated: 'Showing {shown} of {total}.',
      primitive: {
        modeRoots: 'Primitive roots',
        modePower: 'Higher roots xᵏ ≡ a',
        modeLog: 'Discrete log bˣ ≡ a',
        exists: '{n} has primitive roots',
        doesNotExist: '{n} has no primitive root',
        form: {
          small: 'n = 2 and n = 4 are the small cases where Uₙ is cyclic.',
          oddPrimePower: 'n is a power of an odd prime, so Uₙ is cyclic.',
          twiceOddPrimePower: 'n is twice a power of an odd prime, so Uₙ is cyclic.',
          highPowerOfTwo:
            'n = 2ᵏ with k ≥ 3: no unit has order φ(n), because the largest possible order is 2ᵏ⁻².',
          severalOddPrimes: 'n has two different odd prime factors, so Uₙ is not cyclic.',
          fourDividesN: '4 divides n and n has an odd prime factor, so Uₙ is not cyclic.',
        },
        allRoots: 'All {count} primitive roots (there are always φ(φ(n)) of them)',
        tooManyToList:
          'φ(n) is too large to list every primitive root; the smallest one and the count are exact.',
        testHeading: 'Is {a} a primitive root of {n}?',
        testExplain:
          'A unit a is a primitive root exactly when a^(φ(n)/q) ≢ 1 for every prime q dividing φ(n) — one power per prime, not φ(n) powers.',
        notRoot: '{a} is not a primitive root of {n}: some a^(φ(n)/q) ≡ 1.',
        indexTable: 'Table of indices for g = {g} modulo {n}',
        solutionCount: '{count} solution(s) modulo {m}',
      },
      primality: {
        verdictPrime: '{n} is prime',
        verdictComposite: '{n} is composite',
        verdictNote:
          'Verdict from the deterministic Miller–Rabin test (bases 2 … 41). The panels below show what each classical test says — and where each one can be fooled.',
        wilsonHeading: "Wilson's theorem",
        wilsonPrime: '(n − 1)! ≡ −1 (mod n), exactly as Wilson’s theorem predicts for a prime.',
        wilsonComposite: '(n − 1)! ≢ −1 (mod n), so n cannot be prime.',
        wilsonPairs: 'Every 1 < a < n − 1 pairs off with its inverse, leaving only 1 · (n − 1):',
        fermatHeading: 'Fermat test, base {a}',
        fermatPass: 'aⁿ⁻¹ ≡ 1 and n is prime.',
        fermatPseudoprime: 'aⁿ⁻¹ ≡ 1 although n is composite: n is a pseudoprime to base {a}.',
        fermatFail: 'aⁿ⁻¹ ≢ 1, so n is certainly composite.',
        fermatNotCoprime: 'gcd({a}, {n}) = {gcd} > 1, so n is composite.',
        millerHeading: "Miller's test, base {a}",
        millerExplain:
          'Start with a^((n−1)/2). −1 means pass; anything other than ±1 means fail; +1 with an even exponent means halve the exponent and look again.',
        stepPass: 'pass',
        stepFail: 'fail',
        stepContinue: '+1, halve',
        millerPass: 'n passes Miller’s test to base {a} and is prime.',
        strongPseudoprime:
          '{n} passes Miller’s test to base {a} but is composite: a strong pseudoprime.',
        millerFail: '{n} fails Miller’s test to base {a}, so it is composite.',
        liarCount:
          '{count} of the bases 1 … {n} − 1 pass Miller’s test for this composite; the guaranteed bound is (n − 1)/4 = {bound}.',
        korseltHeading: "Korselt's criterion (Carmichael numbers)",
        korselt: {
          prime: '{n} is prime, so it is not a Carmichael number.',
          notSquarefree: '{n} is not squarefree, so it is not a Carmichael number.',
          divisibilityFails: 'Some p − 1 does not divide n − 1, so {n} is not a Carmichael number.',
          carmichael:
            '{n} is a Carmichael number: aⁿ ≡ a (mod n) for every a, so the Fermat test can never expose it.',
        },
      },
      crypto: {
        modeAffine: 'Caesar / affine',
        modeExponent: 'Exponent cipher',
        modeDh: 'Key exchange',
        modeRsa: 'RSA',
        modeSharing: 'Secret sharing',
        inputText: 'Text',
        inputNumbers: 'Numbers',
        inputType: 'Message type',
        block: 'Block',
        encrypted: 'Encrypted',
        decrypted: 'Decrypted',
        blocksBelow: 'Every block must be smaller than {n}.',
        encodingNote:
          'Letters A–Z become 1–26 (other characters are ignored). A block of k letters is read in base 26 with the first letter as the units digit; block size 0 sends the whole message as one number.',
        explain: {
          affine:
            'Encrypt with m ≡ ax + b (mod n) and decrypt with x ≡ a′(m − b), which needs gcd(a, n) = 1. Caesar’s cipher is a = 1, b = 3, n = 26.',
          exponent:
            'Encrypt with c ≡ xᵉ (mod p) for a prime p with gcd(e, p − 1) = 1; decrypt with f ≡ e⁻¹ (mod p − 1), since x^(ef) ≡ x by Fermat’s little theorem.',
          dh:
            'Alice and Bob agree publicly on p and g, keep m and n secret, exchange gᵐ and gⁿ, and both arrive at g^(mn) without ever sending it.',
          rsa:
            'Publish n = pq and e; keep d ≡ e⁻¹ (mod φ(n)) private. Anyone can compute xᵉ, but undoing it needs φ(n) — and so, as far as anyone knows, the factors of n.',
          sharing:
            'Split a secret K among three people so that any two of them — but no single one — can rebuild it with the Chinese Remainder Theorem.',
        },
        keys: 'Keys',
        inverseNote: '{a}⁻¹ ≡ {inverse} (mod {n}) undoes the multiplication.',
        lossyWarning:
          'Block {block} is larger than n = {n}, so it cannot be recovered uniquely. Use a larger modulus or smaller blocks.',
        dhHeading: 'Diffie–Hellman key exchange',
        dhNotGenerator:
          '{g} is not a primitive root of {p}, so the shared keys come from a smaller subgroup — easier for an eavesdropper.',
        rsaHeading: 'RSA key generation',
        sharingHeading: 'Keys and reconstruction',
        person: 'Person',
        reconstruct: 'Any two keys rebuild K₀ by the CRT, and K = K₀ mod p:',
      },
      crt: {
        reductionsHeading: 'Rows with coefficients, solved first',
        mergedNote:
          'Some moduli share a factor, so the classical CRT formula does not apply. The congruences are merged two at a time instead: a pair is compatible exactly when gcd(mᵢ, mⱼ) divides aⱼ − aᵢ, and the answer is unique modulo the lcm.',
        mergeHeading: 'Merging the congruences',
      },
      hensel: {
        heading: 'Prime powers + CRT (Hensel lifting)',
        explain:
          'Solve modulo each prime power of {m}, lifting every root from p to p², p³, … with Hensel’s lemma, then combine the pieces with the Chinese Remainder Theorem.',
        componentRoots: '{count} root(s) modulo {m}',
        showLifting: 'Show the lifting steps',
        combined: 'Number of roots: {product} = {count} modulo {m}',
        tooManyToCombine: 'Too many combinations to list; the count is exact.',
        beatsScan: 'The direct scan stopped early, but this method found every root.',
      },
      quadratic: {
        modeLegendre: 'Legendre symbol',
        modeSqrt: 'Square roots mod n',
        modeQuadratic: 'Quadratic ax² + bx + c',
        sqrtCount: '{count} square root(s) of {a} modulo {n}',
        sqrtNone: '{a} has no square root modulo {n}',
        tooManyRoots: 'Too many roots to list; the count is exact.',
        sqrtExplain:
          'Solved modulo each prime power separately, then combined with the CRT. A single prime power without a root rules out every solution.',
        bothRoots: 'Square roots: x ≡ {roots} give x² ≡ {a} (mod {p})',
        residueListHeading: 'Quadratic residues modulo {p}',
        residuesLabel: 'Residues ({count})',
        nonResiduesLabel: 'Non-residues ({count})',
        scanFallback:
          'gcd(2a, {n}) ≠ 1, so completing the square would mean dividing by a non-unit. Every x was checked directly instead.',
      },
      squares: {
        modeTwo: 'Two squares',
        modeMore: 'Three & four squares',
        modePythagorean: 'Pythagorean triples',
        isSum: '{n} is a sum of two squares',
        isNotSum: '{n} is not a sum of two squares',
        criterion:
          'n = a² + b² exactly when every prime p ≡ 3 (mod 4) divides n to an even power. r₂(n) counts all ordered, signed pairs (a, b).',
        oddPower: 'odd power of p ≡ 3',
        representations: 'Representations a² + b² with 0 ≤ a ≤ b',
        tooLargeToList:
          'n is too large to list the representations; the criterion and r₂(n) are exact.',
        lagrangeHeading: 'Four squares always suffice',
        threeObstructed: '{n} = 4^{a}·(8·{b} + 7), so it is not a sum of three squares.',
        lagrangeNote:
          'Lagrange: every non-negative integer is a sum of four squares. Legendre: three squares suffice unless n = 4ᵃ(8b + 7).',
        fromPQ: 'Triple from (p, q)',
        primitive: 'Primitive triple ({x}, {y}, {z}); triangle area {area}.',
        notPrimitive:
          '({x}, {y}, {z}) is a triple but not primitive: p and q must be coprime and of opposite parity.',
        tripleCount: '{count} triples with hypotenuse ≤ {n}, {primitive} of them primitive',
      },
      curves: {
        modePell: "Pell's equation",
        modeMordell: 'Mordell curves',
        pellHeading: 'Solutions of x² − dy² = 1',
        cfExplain:
          'The continued fraction of √d repeats with period {length}; the fundamental solution sits at the end of the first (or, for odd length, second) period.',
        compositionExplain:
          'Every further solution comes from multiplying by the fundamental one — the "doubling" and "adding" of points on the hyperbola.',
        negativeYes: 'The period is odd, so x² − {d}y² = −1 also has a solution: ({x}, {y}).',
        negativeNo: 'The period is even, so x² − {d}y² = −1 has no solution.',
        mordellCount: '{count} integer point(s) with |x| ≤ {bound}',
        mordellNote:
          'A search can only find points; proving none exist beyond the bound needs congruence arguments like those in §15.3.',
      },
      factoring: {
        modeFermat: 'Fermat factoring',
        modeRho: 'Pollard rho',
        modeFermatNumbers: 'Fermat numbers',
        modeMersenne: 'Mersenne & Lucas–Lehmer',
        explain: {
          fermat:
            'Write n = s² − t² = (s + t)(s − t): start at s = ⌈√n⌉ and step up until s² − n is a perfect square. Fast when the two factors are close.',
          rho:
            'Iterate x ↦ x² + c (mod n) and compare xₖ with x₂ₖ. A non-trivial gcd(x₂ₖ − xₖ, n) is a factor — often found long before trial division would.',
          fermatNumbers:
            'Fermat conjectured that every Fₖ = 2^(2ᵏ) + 1 is prime. Only F₀ … F₄ are known to be; Euler found 641 | F₅.',
          mersenne:
            'Mₚ = 2ᵖ − 1 can only be prime when p is. The Lucas–Lehmer test decides it with p − 2 squarings, and each Mersenne prime gives an even perfect number.',
        },
        fermatFound: 'Found after {tries} value(s) of s',
        fermatGaveUp: 'No factor after {tries} values of s',
        perfectSquare: 'Square?',
        trivial: 'Only the trivial factorisation n · 1 appeared, so n is prime.',
        rhoFound: 'Factor found in round {k}',
        rhoFailed: 'The cycle closed without a factor. Try another seed or constant c.',
        fermatPrime: 'F{k} is prime',
        fermatComposite: 'F{k} is composite',
        value: 'Value',
        digits: 'Digits',
        fermatFactor: 'Factor {d} = {j}·2^{k2} + 1; cofactor {cofactor}.',
        noSmallFactor: 'No factor of the form j·2^(k+2) + 1 was found within the search limit.',
        mersennePrime: '2^{p} − 1 is a Mersenne prime',
        mersenneComposite: '2^{p} − 1 is composite',
        compositeExponent:
          '{p} is composite, and 2ᵃ − 1 divides 2^(ab) − 1; here {divisor} is a factor.',
        perfect: 'Perfect number 2^({p} − 1)·(2^{p} − 1) = {value}',
      },
      arith: {
        modeProfile: 'Profile of n',
        modeDirichlet: 'Dirichlet product',
        modeInversion: 'Möbius inversion',
        modeThabit: "Thabit's rule",
        fn: {
          I: 'identity',
          u: 'constant 1',
          N: 'n itself',
          mu: 'Möbius',
          phi: 'Euler phi',
          tau: 'number of divisors',
          sigma: 'sum of divisors',
          lambda: 'Liouville',
          mu2: 'squarefree indicator',
        },
        kind: {
          perfect: '{n} is perfect: σ(n) = 2n',
          abundant: '{n} is abundant: σ(n) > 2n',
          deficient: '{n} is deficient: σ(n) < 2n',
        },
        multiplyPerfect: '{n} is {k}-perfect: σ(n) = {k}n.',
        aliquotHeading: 'Aliquot sequence n → σ(n) − n',
        amicable: '{n} and {m} are amicable: each is the sum of the other’s proper divisors.',
        notAmicable: '{n} has no amicable partner.',
        productMatches: '{f} ⋆ {g} = {h}',
        productNew: '{f} ⋆ {g} is not one of the listed functions',
        inversionWorks: 'Möbius inversion recovers {g}',
        inversionFails: 'Inversion did not recover g',
        inversionF: 'Here f = {g} ⋆ u = {f}.',
        thabitWorks: 'n = {n}: all three numbers are prime, so the rule gives an amicable pair',
        thabitFails: 'n = {n}: not all three numbers are prime, so the rule gives nothing',
      },
      dist: {
        modeSieve: 'Sieve',
        modeCounting: 'π(x) vs Li(x)',
        modeRace: 'Prime races',
        modeTwins: 'Twin primes',
        modeAverages: 'Average orders',
        modeZeta: 'Zeta function',
        raceMod4: 'mod 4',
        raceMod3: 'mod 3',
        raceModulus: 'Race modulus',
        explain: {
          sieve: 'Cross out the multiples of every prime p ≤ √n; whatever survives is prime.',
          counting:
            'The Prime Number Theorem: π(x) ~ x / ln x. Gauss’s logarithmic integral Li(x) = ∫₂ˣ dt / ln t is a far better estimate.',
          race:
            'Count primes in each residue class. Both teams are infinite, but the non-residue team leads almost all the time (Chebyshev’s bias).',
          twins:
            'Pairs p, p + 2 that are both prime. Nobody knows whether there are infinitely many; the Hardy–Littlewood heuristic predicts how many.',
          averages:
            'Individual values of τ, σ and φ jump around, but their averages grow smoothly.',
          zeta:
            'For real s > 1, ζ(s) is both a sum over all n and a product over all primes — the link between primes and analysis.',
        },
        sieveCount: '{count} primes up to {n}',
        sievingPrimes: 'Sieving primes (p ≤ √n): {primes}',
        sieveGrid: 'Sieve grid',
        sieveLegend:
          'Green numbers survive; the small subscript is the prime that crossed a number out first.',
        countingHeading: 'Counting primes up to {x}',
        errorChart: 'Error of each estimate, Li(x) − π(x) and x/ln x − π(x)',
      pntNote:
          'Li(x) stays above π(x) throughout this range, yet Littlewood proved the lead changes sign infinitely often.',
        raceHeading: 'Primes mod {m} up to {x}',
        raceFirstLead: 'The 1 (mod {m}) team first takes the lead at {x}.',
        raceNeverLeads: 'Up to {x}, primes ≡ 1 (mod {m}) never lead the ≡ {other} team.',
        raceChanges: 'Lead changes (x → leading class): {list}',
        twinsHeading: '{count} twin prime pairs up to {x}',
        twinsNote:
          'C₂ ≈ 0.6601 is the twin prime constant. The estimate is a conjecture, not a theorem.',
        averagesHeading: 'Averages up to {x}',
        zetaHeading: 'ζ({s}) with {n} terms',
        tailBound: 'Tail bound N^(1−s)/(s − 1)',
        exactValue: 'Exact value',
      },
      lattice: {
        heading: '{count} solution(s) with x > 0 and y > 0',
        explain:
          'Positivity cuts the parameter t down to an interval, so counting positive solutions is counting integers in it.',
      },
      groups: {
        heading: 'Tables of ℤ{n}',
        multiplication: 'Multiplication',
        addition: 'Addition',
        powers: 'Powers',
        units: 'Units (highlighted): {units}. Orders: {orders}.',
      },
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
      modulusN: 'Modulus n',
      candidateA: 'Candidate a',
      exponentK: 'Exponent k',
      targetValueA: 'Target a',
      baseB: 'Base b',
      message: 'Message',
      numberList: 'Numbers (comma separated)',
      blockSize: 'Letters per block',
      blockSizeWhole: 'Letters per block (0 = all)',
      shiftB: 'Shift b',
      primeP: 'Prime p',
      primeQ: 'Prime q',
      baseG: 'Base g',
      aliceSecret: "Alice's secret m",
      bobSecret: "Bob's secret n",
      publicExponent: 'Public exponent e',
      secretK: 'Secret K',
      randomT: 'Random t',
      shareModulus1: 'Modulus m₁',
      shareModulus2: 'Modulus m₂',
      shareModulus3: 'Modulus m₃',
      coefficientC: 'Coefficient c',
      hypotenuseLimit: 'Hypotenuse up to N',
      parameterP: 'Parameter p',
      parameterQ: 'Parameter q',
      nonSquareD: 'Non-square d',
      constantK: 'Constant k',
      searchBound: 'Search |x| up to',
      oddIntegerN: 'Odd integer n',
      seed: 'Seed x₀',
      polynomialShift: 'Constant c in x² + c',
      indexK: 'Index k',
      exponentP: 'Exponent p',
      functionF: 'Function f',
      functionG: 'Function g',
      upToN: 'Up to n',
      upToX: 'Up to x',
      realS: 'Real s > 1',
      termsN: 'Terms N',
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
        description: 'Roots of degree 1–5 polynomials f(x) ≡ b (mod m), with Hensel lifting to prime powers',
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
        description: 'Simultaneous congruences cᵢx ≡ aᵢ (mod mᵢ), including moduli that share factors',
      },
      mod_exp: {
        title: 'Modular exponentiation & order',
        description: 'Fast modular power aᵉ mod m, order ordₘ(a) and primitive root test',
      },
      quadratic_residue: {
        title: 'Quadratic residues & congruences',
        description: "Legendre and Jacobi symbols, Euler's criterion, square roots mod n and ax² + bx + c ≡ 0",
      },
      primitive_roots: {
        title: 'Primitive roots & discrete logarithms',
        description: 'Existence, every primitive root, index tables, xᵏ ≡ a and bˣ ≡ a (mod n)',
      },
      cryptography: {
        title: 'Cryptography',
        description:
          'Caesar and affine ciphers, the exponent cipher, Diffie–Hellman, RSA and CRT secret sharing',
      },
      primality: {
        title: 'Primality tests & pseudoprimes',
        description:
          "Wilson's theorem, the Fermat and Miller tests, strong pseudoprimes and Carmichael numbers",
      },
      factoring: {
        title: 'Factoring methods & special primes',
        description:
          'Fermat factoring, Pollard rho, Fermat numbers, Mersenne primes via Lucas–Lehmer, and perfect numbers',
      },
      sums_of_squares: {
        title: 'Sums of squares & Pythagorean triples',
        description:
          'Which n are a² + b², r₂(n), three and four squares, Gaussian factors and all Pythagorean triples',
      },
      pell_curves: {
        title: "Pell's equation & curves",
        description:
          'x² − dy² = 1 via continued fractions and composition; integer points on y² = x³ + k',
      },
      arithmetic_functions: {
        title: 'Arithmetic functions',
        description:
          'σₖ, μ, λ, Λ, perfect and amicable numbers, aliquot sequences, Dirichlet products and Möbius inversion',
      },
      prime_distribution: {
        title: 'Distribution of primes',
        description:
          'Sieve of Eratosthenes, π(x) against Li(x), prime races, twin primes, average orders and ζ(s)',
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
          'Over a prime modulus p, Lagrange’s theorem bounds a degree-n polynomial by n roots. Over a composite modulus that bound fails — x² ≡ 1 (mod 8) already has four solutions. Modulo a prime power pᵉ, Hensel’s lemma lifts each root mod p one power at a time, and the CRT then glues the prime powers together.',
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
          'With pairwise coprime moduli the system x ≡ aᵢ (mod mᵢ) has exactly one solution modulo M = ∏mᵢ. Build it term by term: each Mᵢ = M/mᵢ is invertible mod mᵢ, so aᵢMᵢyᵢ hits aᵢ in slot i and vanishes everywhere else. If moduli share a factor, merge two congruences at a time: a solution exists exactly when gcd(mᵢ, mⱼ) divides aⱼ − aᵢ, and it is unique modulo the lcm.',
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
      primitive_roots: {
        pedagogy:
          'A primitive root g of n generates every unit: g, g², …, g^φ(n) run through all of Uₙ. Every unit is then a power gⁱ, and i = ind_g(a) behaves like a logarithm — xᵏ ≡ a and bˣ ≡ a become linear congruences modulo φ(n).',
        theorem:
          'U_n \\text{ cyclic} \\iff n \\in \\{2, 4, p^k, 2p^k\\}, \\quad g \\text{ primitive} \\iff g^{\\varphi(n)/q} \\not\\equiv 1 \\;\\; \\forall\\, q \\mid \\varphi(n)',
        history:
          'Euler named primitive roots in 1773; Gauss gave the first complete proof that every prime has one in the Disquisitiones Arithmeticae (1801).',
      },
      cryptography: {
        pedagogy:
          'Modern ciphers are public about their method and secret only about their keys. Each rests on an operation that is easy to perform and, without the key, hard to undo: multiplying primes, or raising to a power modulo n.',
        theorem:
          'ed \\equiv 1 \\pmod{\\varphi(n)} \\implies (x^e)^d \\equiv x \\pmod{n}, \\quad n = pq',
        history:
          'Diffie and Hellman published public key exchange in 1976, and Rivest, Shamir and Adleman published RSA in 1977. Clifford Cocks at GCHQ had found an equivalent scheme in 1973; it stayed classified until 1997.',
      },
      primality: {
        pedagogy:
          'Fermat’s little theorem gives a fast test — but composites can pass it, and Carmichael numbers pass it for every base. Miller’s test also watches the square roots of 1 along the way, and no composite fools it for more than a quarter of the bases.',
        theorem:
          'n \\text{ prime} \\iff (n-1)! \\equiv -1 \\pmod{n}, \\qquad p \\text{ prime} \\implies a^{p-1} \\equiv 1 \\pmod{p}',
        history:
          'Ibn al-Haytham stated Wilson’s theorem around 1000 and Lagrange proved it in 1771. Korselt gave his criterion in 1899 and Robert Carmichael produced the first examples in 1910–12; Miller (1976) and Rabin (1980) made Miller’s test the standard probabilistic primality test.',
      },
      factoring: {
        pedagogy:
          'Primality is easy to test but factoring is hard — that gap is what RSA relies on. Fermat’s method attacks factors near √n; Pollard rho walks a pseudo-random sequence until two terms collide modulo a hidden factor.',
        theorem:
          'n = s^2 - t^2 = (s+t)(s-t), \\qquad M_p \\text{ prime} \\iff x_{p-2} \\equiv 0 \\pmod{M_p}',
        history:
          'Fermat described his method in 1643; Euler factored F₅ in 1732; Lucas (1876) and Lehmer (1930) gave the Mersenne test; Pollard published rho in 1975.',
      },
      sums_of_squares: {
        pedagogy:
          'Products of sums of two squares are again sums of two squares, so everything reduces to primes: 2 and every p ≡ 1 (mod 4) are sums of two squares, and p ≡ 3 (mod 4) never is.',
        theorem:
          'n = a^2 + b^2 \\iff p^{e} \\parallel n,\\ p \\equiv 3 \\!\\!\\pmod 4 \\implies 2 \\mid e',
        history:
          'Fermat stated the two-squares theorem in 1640 and Euler proved it in 1749; Lagrange proved the four-squares theorem in 1770.',
      },
      pell_curves: {
        pedagogy:
          'A conic with one rational point has infinitely many, found by drawing lines. On the hyperbola x² − dy² = 1 the integer points form a group: compose (x₁ + y₁√d)ᵏ to get them all.',
        theorem: '(x_1 + y_1\\sqrt{d})^k = x_k + y_k\\sqrt{d} \\implies x_k^2 - d\\,y_k^2 = 1',
        history:
          'Brahmagupta (628) found the composition rule; Lagrange (1768) proved that Pell’s equation always has a solution. Euler misattributed it to John Pell.',
      },
      arithmetic_functions: {
        pedagogy:
          'Multiplicative functions are determined by prime powers. Under the Dirichlet product they form a group with identity I, and μ is the inverse of the constant function u — which is Möbius inversion.',
        theorem:
          'f = g \\star u \\iff g = f \\star \\mu, \\qquad (f \\star g)(n) = \\sum_{d \\mid n} f(d)\\, g(n/d)',
        history:
          'Euclid proved that 2ᵖ⁻¹(2ᵖ − 1) is perfect when 2ᵖ − 1 is prime, and Euler proved the converse for even numbers; Thabit ibn Qurra gave his amicable rule in the ninth century; Möbius introduced μ in 1832.',
      },
      prime_distribution: {
        pedagogy:
          'Primes look random individually but are regular in bulk: near x roughly one number in ln x is prime. Analytic tools — Li(x), ζ(s) — make that precise.',
        theorem:
          '\\pi(x) \\sim \\frac{x}{\\ln x} \\sim \\mathrm{Li}(x), \\qquad \\zeta(s) = \\sum_{n \\ge 1} n^{-s} = \\prod_p \\left(1 - p^{-s}\\right)^{-1}',
        history:
          'Gauss conjectured the Prime Number Theorem as a teenager; Hadamard and de la Vallée Poussin proved it independently in 1896, using Riemann’s ζ.',
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
      index: {
        primitiveRoot: 'Take the primitive root g = {g} of {n}.',
        writeTarget: 'Write the right-hand side as a power of g (its index).',
        substitutePower: 'Put x = gⁱ and compare exponents modulo φ(n).',
        backSubstitute: 'Solve for i and turn each of the {count} exponents back into x = gⁱ.',
        writeBoth: 'Write both b and a as powers of g.',
        substituteExponent: 'Compare exponents modulo φ(n) — a linear congruence in x.',
      },
      quadratic: {
        multiply: 'Multiply through by 4a = {factor}.',
        isolate: 'Complete the square and isolate it.',
        squareRoots: 'Find all {count} square root(s) s of {d} modulo {n}.',
        solveLinear: 'Undo 2ax + b = s with the inverse of 2a.',
      },
      dh: {
        alicePublic: 'Alice publishes A = gᵐ.',
        bobPublic: 'Bob publishes B = gⁿ.',
        aliceKey: 'Alice raises B to the secret m.',
        bobKey: 'Bob raises A to the secret n — and gets the same number.',
      },
      rsa: {
        modulus: 'Multiply the primes to get the public modulus.',
        totient: 'Compute φ(n) — easy only for someone who knows p and q.',
        coprime: 'Check that e is coprime to φ(n).',
        private: 'Invert e modulo φ(n) to get the private key d.',
      },
      crt: {
        reduceRow: 'Row {row}: solve this linear congruence on its own.',
        mergeStep: 'Merge moduli {m1} and {m2} (gcd = {gcd}).',
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
      crtRowUnsolvable:
        'Row {row}: gcd({c}, {m}) = {d} does not divide {a}, so {c}x ≡ {a} (mod {m}) has no solution — and neither does the system.',
      crtIncompatible:
        'x ≡ {a1} (mod {m1}) and x ≡ {a2} (mod {m2}) contradict each other: gcd({m1}, {m2}) = {gcd} does not divide {a2} − {a1}.',
      henselRequiresPrime: '{p} is not prime, so Hensel lifting does not apply.',
      henselRequiresPositiveExponent: 'The exponent must be at least 1.',
      henselPrimeTooLarge:
        'The prime factor {p} is above the scan limit {limit}, so its roots could not be found by search.',
      tooManyRoots: 'More than {limit} roots modulo {m} — too many to list.',
      wilsonTooLarge: '(n − 1)! is only computed for n ≤ {limit}.',
      millerRequiresOdd: "Miller's test needs an odd n ≥ 3.",
      millerTrivialBase: 'Base {a} is ≡ 0 or ±1 (mod {n}), which says nothing. Pick 1 < a < n − 1.',
      liarCountTooLarge: 'Counting every base is limited to n ≤ {limit}.',
      primitiveRootSearchExhausted: 'No primitive root was found within the search limit.',
      indexModulusTooSmall: 'Use a modulus n ≥ 3.',
      indexNeedsPrimitiveRoot:
        '{n} has no primitive root, so the index method does not apply. Split n with the CRT and solve each part instead.',
      indexTooLarge: 'φ(n) exceeds {limit}; computing an index would take too long here.',
      indexRequiresUnits: 'Indices exist only for numbers coprime to {n}.',
      indexNoSolution:
        'The linear congruence in the exponents has no solution, so neither does the original congruence.',
      exponentMustBePositive: 'The exponent must be a positive integer.',
      quadraticLeadingZero:
        'a ≡ 0 (mod {n}), so this is not a quadratic. Use the linear congruence solver.',
      quadraticNeedsUnitLeading:
        'gcd(2·{a}, {n}) ≠ 1, so the square cannot be completed, and n is above the scan limit {limit}.',
      residueListTooLarge: 'Residues are listed only for primes up to {limit}.',
      messageHasNoLetters: 'The message needs at least one letter A–Z.',
      invalidBlockSize: 'The block size must be 0 or a positive integer.',
      invalidNumberList: 'Enter non-negative integers separated by commas or spaces.',
      affineNeedsUnit: 'gcd({a}, {n}) = {gcd} ≠ 1, so multiplying by {a} cannot be undone.',
      requiresPrimeModulus: '{p} is not prime.',
      exponentNotCoprime:
        'gcd({e}, {m}) = {gcd} ≠ 1, so the exponent {e} cannot be inverted modulo {m}.',
      blockExceedsModulus:
        'Block {block} is not smaller than {n}, so it would not survive encryption. Use smaller blocks or a larger modulus.',
      dhBaseOutOfRange: 'Choose a base g with 1 < g < {p}.',
      rsaRequiresPrimes: 'RSA needs p and q to be prime.',
      rsaPrimesMustDiffer: 'p and q must be different primes.',
      secretMustBeBelowP: 'The secret K must satisfy 0 ≤ K < p = {p}.',
      sharingModuliNotCoprime:
        '{x} and {y} share the factor {gcd}; the moduli and p must be pairwise coprime.',
      sharingThresholdFails: 'Need m₁m₂ > p·m₃ (with m₁ < m₂ < m₃), but {M} ≤ {pm}.',
      sharingTTooLarge: 't is too large: K + tp must stay below m₁m₂, so t ≤ {max}.',
      latticeNeedsPositive: 'Counting positive solutions needs a > 0 and b > 0.',
      pythagoreanNeedsPQ: 'Choose integers 1 ≤ p < q.',
      tripleLimitRange: 'Choose a hypotenuse bound between 5 and {max}.',
      sieveRange: 'The sieve lists primes for 2 ≤ n ≤ {max}.',
      groupTableRange: 'Tables are drawn for 2 ≤ n ≤ {max}.',
      fermatIndexRange: 'Choose 0 ≤ k ≤ {max}.',
      lucasLehmerRange: 'Choose an exponent 2 ≤ p ≤ {max}.',
      fermatFactorNeedsOdd: "Fermat's method needs an odd n ≥ 3 (divide out factors of 2 first).",
      rhoNeedsComposite: '{n} is prime, so there is nothing to factor.',
      squaresTooLarge: 'Representations are searched for n ≤ {max}.',
      pellNeedsD: 'Choose d ≥ 2.',
      pellSquare: '{d} is a perfect square, so x² − dy² = 1 only has the trivial solutions.',
      pellPeriodTooLong: 'The continued fraction period exceeds {max} terms.',
      mordellZero: 'For k = 0 every (t², t³) is a point; choose k ≠ 0.',
      mordellBoundRange: 'Choose a search bound between 1 and {max}.',
      thabitRange: 'Choose 2 ≤ n ≤ 64.',
      dirichletRange: 'Choose 1 ≤ n ≤ {max}.',
      countingRange: 'Choose a value between {min} and {max}.',
      zetaNeedsS: 'The series converges only for s > 1 (this tool accepts s ≤ 64).',
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
        riemann: {
          title: 'Riemann zeta function & Riemann hypothesis',
          summary:
            'For s > 1, ζ(s) is the sum of 1/nˢ and equals a product over all primes. Riemann extended it to every complex s ≠ 1; the Riemann hypothesis says its non-trivial zeros all lie on the line Re s = 1/2.',
          details:
            'The Euler product is the bridge between ζ and the primes. The hypothesis is equivalent to the error bound |π(x) − Li(x)| ≤ (1/8π)·√x·ln x for x ≥ 2657, and through Riemann’s explicit formula each zero contributes an oscillating term to the prime count. It is still unproved (definition only — see Crisman §24.2, §25.3, Theorem 25.2.4).',
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
      bookReference: 'Ders kitabı: Crisman, Number Theory: In Context and Interactive, {sections}.',
      readOnline: 'Çevrimiçi oku',
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
      modeLabel: 'Mod',
      listTruncated: '{total} öğeden {shown} tanesi gösteriliyor.',
      primitive: {
        modeRoots: 'İlkel kökler',
        modePower: 'Yüksek kökler xᵏ ≡ a',
        modeLog: 'Ayrık logaritma bˣ ≡ a',
        exists: '{n} sayısının ilkel kökleri vardır',
        doesNotExist: '{n} sayısının ilkel kökü yoktur',
        form: {
          small: 'n = 2 ve n = 4, Uₙ grubunun devirli olduğu küçük durumlardır.',
          oddPrimePower: 'n tek bir asalın kuvvetidir, dolayısıyla Uₙ devirlidir.',
          twiceOddPrimePower: 'n, tek bir asal kuvvetinin iki katıdır, dolayısıyla Uₙ devirlidir.',
          highPowerOfTwo:
            'k ≥ 3 için n = 2ᵏ: hiçbir birimin mertebesi φ(n) olamaz, çünkü mümkün en büyük mertebe 2ᵏ⁻²’dir.',
          severalOddPrimes:
            'n’nin iki farklı tek asal çarpanı vardır, dolayısıyla Uₙ devirli değildir.',
          fourDividesN:
            '4 sayısı n’yi böler ve n’nin tek bir asal çarpanı vardır, dolayısıyla Uₙ devirli değildir.',
        },
        allRoots: '{count} ilkel kökün tamamı (sayıları her zaman φ(φ(n))’dir)',
        tooManyToList:
          'φ(n) tüm ilkel kökleri listelemek için çok büyük; en küçük kök ve kök sayısı kesindir.',
        testHeading: '{a}, {n} modülüne göre ilkel kök mü?',
        testExplain:
          'Bir a birimi, φ(n)’yi bölen her q asalı için a^(φ(n)/q) ≢ 1 ise ve ancak o zaman ilkel köktür — φ(n) tane değil, her asal için tek bir kuvvet yeterlidir.',
        notRoot: '{a}, {n} modülüne göre ilkel kök değildir: bazı a^(φ(n)/q) ≡ 1.',
        indexTable: '{n} modülüne göre g = {g} için indeks tablosu',
        solutionCount: '{m} modülüne göre {count} çözüm',
      },
      primality: {
        verdictPrime: '{n} asaldır',
        verdictComposite: '{n} bileşiktir',
        verdictNote:
          'Karar, deterministik Miller–Rabin testinden (2 … 41 tabanları) gelir. Aşağıdaki paneller her klasik testin ne söylediğini ve nerede yanılabileceğini gösterir.',
        wilsonHeading: 'Wilson teoremi',
        wilsonPrime: '(n − 1)! ≡ −1 (mod n); Wilson teoreminin bir asal için öngördüğü gibi.',
        wilsonComposite: '(n − 1)! ≢ −1 (mod n), dolayısıyla n asal olamaz.',
        wilsonPairs:
          '1 < a < n − 1 aralığındaki her sayı tersiyle eşleşir; geriye yalnızca 1 · (n − 1) kalır:',
        fermatHeading: 'Fermat testi, taban {a}',
        fermatPass: 'aⁿ⁻¹ ≡ 1 ve n asaldır.',
        fermatPseudoprime: 'n bileşik olduğu hâlde aⁿ⁻¹ ≡ 1: n, {a} tabanına göre sahte asaldır.',
        fermatFail: 'aⁿ⁻¹ ≢ 1, dolayısıyla n kesinlikle bileşiktir.',
        fermatNotCoprime: 'EBOB({a}, {n}) = {gcd} > 1, dolayısıyla n bileşiktir.',
        millerHeading: 'Miller testi, taban {a}',
        millerExplain:
          'a^((n−1)/2) ile başla. −1 “geçer” demektir; ±1 dışındaki her değer “kalır” demektir; üs çiftken +1 çıkarsa üssü yarıya indirip yeniden bak.',
        stepPass: 'geçer',
        stepFail: 'kalır',
        stepContinue: '+1, yarıya indir',
        millerPass: 'n, {a} tabanında Miller testini geçer ve asaldır.',
        strongPseudoprime:
          '{n}, {a} tabanında Miller testini geçer ama bileşiktir: güçlü sahte asal.',
        millerFail: '{n}, {a} tabanında Miller testinden kalır, dolayısıyla bileşiktir.',
        liarCount:
          'Bu bileşik sayı için 1 … {n} − 1 tabanlarından {count} tanesi Miller testini geçer; garanti edilen üst sınır (n − 1)/4 = {bound}.',
        korseltHeading: 'Korselt kriteri (Carmichael sayıları)',
        korselt: {
          prime: '{n} asaldır, dolayısıyla Carmichael sayısı değildir.',
          notSquarefree: '{n} karesiz değildir, dolayısıyla Carmichael sayısı değildir.',
          divisibilityFails:
            'Bazı p − 1 değerleri n − 1’i bölmez, dolayısıyla {n} Carmichael sayısı değildir.',
          carmichael:
            '{n} bir Carmichael sayısıdır: her a için aⁿ ≡ a (mod n), bu yüzden Fermat testi onu asla yakalayamaz.',
        },
      },
      crypto: {
        modeAffine: 'Sezar / afin',
        modeExponent: 'Üs şifresi',
        modeDh: 'Anahtar değişimi',
        modeRsa: 'RSA',
        modeSharing: 'Gizli paylaşım',
        inputText: 'Metin',
        inputNumbers: 'Sayılar',
        inputType: 'Mesaj türü',
        block: 'Blok',
        encrypted: 'Şifreli',
        decrypted: 'Çözülmüş',
        blocksBelow: 'Her blok {n} sayısından küçük olmalıdır.',
        encodingNote:
          'A–Z harfleri 1–26 olur (diğer karakterler yok sayılır). k harflik bir blok, ilk harf birler basamağı olacak şekilde 26 tabanında okunur; blok boyutu 0 tüm mesajı tek bir sayı olarak gönderir.',
        explain: {
          affine:
            'm ≡ ax + b (mod n) ile şifrele, x ≡ a′(m − b) ile çöz; bunun için EBOB(a, n) = 1 gerekir. Sezar şifresi a = 1, b = 3, n = 26 durumudur.',
          exponent:
            'p asal ve EBOB(e, p − 1) = 1 iken c ≡ xᵉ (mod p) ile şifrele; f ≡ e⁻¹ (mod p − 1) ile çöz, çünkü Fermat’nın küçük teoremine göre x^(ef) ≡ x.',
          dh:
            'Alice ve Bob p ile g üzerinde açıkça anlaşır, m ve n’yi gizli tutar, gᵐ ve gⁿ değerlerini paylaşır; g^(mn) sayısını hiç göndermeden ikisi de ona ulaşır.',
          rsa:
            'n = pq ve e açıklanır; d ≡ e⁻¹ (mod φ(n)) gizli tutulur. Herkes xᵉ hesaplayabilir, ama işlemi geri almak için φ(n) — bilindiği kadarıyla da n’nin çarpanları — gerekir.',
          sharing:
            'Bir K sırrını üç kişi arasında öyle paylaştır ki herhangi ikisi Çin Kalan Teoremi ile onu yeniden kurabilsin, ama hiçbiri tek başına kuramasın.',
        },
        keys: 'Anahtarlar',
        inverseNote: '{a}⁻¹ ≡ {inverse} (mod {n}) çarpmayı geri alır.',
        lossyWarning:
          '{block} bloğu n = {n} değerinden büyük, bu yüzden tek türlü geri elde edilemez. Daha büyük bir modül ya da daha küçük bloklar kullanın.',
        dhHeading: 'Diffie–Hellman anahtar değişimi',
        dhNotGenerator:
          '{g}, {p} modülüne göre ilkel kök değil; ortak anahtarlar daha küçük bir alt gruptan gelir — bu da dinleyen biri için işi kolaylaştırır.',
        rsaHeading: 'RSA anahtar üretimi',
        sharingHeading: 'Anahtarlar ve yeniden kurma',
        person: 'Kişi',
        reconstruct: 'Herhangi iki anahtar ÇKT ile K₀’ı yeniden kurar ve K = K₀ mod p:',
      },
      crt: {
        reductionsHeading: 'Katsayılı satırlar önce çözülür',
        mergedNote:
          'Bazı modüller ortak çarpan paylaşıyor, bu yüzden klasik ÇKT formülü uygulanamaz. Kongrüanslar bunun yerine ikişer ikişer birleştirilir: bir çift ancak ve ancak EBOB(mᵢ, mⱼ) sayısı aⱼ − aᵢ farkını bölüyorsa uyumludur ve çözüm EKOK’a göre tektir.',
        mergeHeading: 'Kongrüansları birleştirme',
      },
      hensel: {
        heading: 'Asal kuvvetler + ÇKT (Hensel yükseltmesi)',
        explain:
          '{m} sayısının her asal kuvvetine göre ayrı ayrı çöz, her kökü Hensel lemması ile p’den p², p³, … modüllerine yükselt, sonra parçaları Çin Kalan Teoremi ile birleştir.',
        componentRoots: '{m} modülüne göre {count} kök',
        showLifting: 'Yükseltme adımlarını göster',
        combined: 'Kök sayısı: {product} = {count} ({m} modülüne göre)',
        tooManyToCombine: 'Listelemek için çok fazla birleşim var; sayı kesindir.',
        beatsScan: 'Doğrudan tarama erken durdu, ama bu yöntem tüm kökleri buldu.',
      },
      quadratic: {
        modeLegendre: 'Legendre sembolü',
        modeSqrt: 'Mod n karekökler',
        modeQuadratic: 'İkinci derece ax² + bx + c',
        sqrtCount: '{n} modülüne göre {a} sayısının {count} karekökü',
        sqrtNone: '{a} sayısının {n} modülüne göre karekökü yoktur',
        tooManyRoots: 'Listelemek için çok fazla kök var; sayı kesindir.',
        sqrtExplain:
          'Her asal kuvvet modülüne göre ayrı ayrı çözülür, sonra ÇKT ile birleştirilir. Kökü olmayan tek bir asal kuvvet bile tüm çözümleri ortadan kaldırır.',
        bothRoots: 'Karekökler: x ≡ {roots} için x² ≡ {a} (mod {p})',
        residueListHeading: '{p} modülüne göre karesel kalanlar',
        residuesLabel: 'Kalanlar ({count})',
        nonResiduesLabel: 'Kalan olmayanlar ({count})',
        scanFallback:
          'EBOB(2a, {n}) ≠ 1, bu yüzden kareye tamamlamak birim olmayan bir sayıya bölmeyi gerektirirdi. Bunun yerine her x doğrudan denendi.',
      },
      squares: {
        modeTwo: 'İki kare',
        modeMore: 'Üç ve dört kare',
        modePythagorean: 'Pisagor üçlüleri',
        isSum: '{n} iki karenin toplamıdır',
        isNotSum: '{n} iki karenin toplamı değildir',
        criterion:
          'n = a² + b² ancak ve ancak p ≡ 3 (mod 4) olan her asal n’yi çift kuvvetle bölüyorsa mümkündür. r₂(n), sıralı ve işaretli tüm (a, b) çiftlerini sayar.',
        oddPower: 'p ≡ 3 tek kuvvette',
        representations: '0 ≤ a ≤ b olan a² + b² gösterimleri',
        tooLargeToList: 'n gösterimleri listelemek için çok büyük; kriter ve r₂(n) kesindir.',
        lagrangeHeading: 'Dört kare her zaman yeter',
        threeObstructed: '{n} = 4^{a}·(8·{b} + 7), dolayısıyla üç karenin toplamı değildir.',
        lagrangeNote:
          'Lagrange: negatif olmayan her tam sayı dört karenin toplamıdır. Legendre: n = 4ᵃ(8b + 7) değilse üç kare yeter.',
        fromPQ: '(p, q) çiftinden üçlü',
        primitive: 'İlkel üçlü ({x}, {y}, {z}); üçgen alanı {area}.',
        notPrimitive:
          '({x}, {y}, {z}) bir üçlüdür ama ilkel değildir: p ve q aralarında asal ve farklı paritede olmalıdır.',
        tripleCount: 'Hipotenüsü ≤ {n} olan {count} üçlü, bunların {primitive} tanesi ilkel',
      },
      curves: {
        modePell: 'Pell denklemi',
        modeMordell: 'Mordell eğrileri',
        pellHeading: 'x² − dy² = 1 denkleminin çözümleri',
        cfExplain:
          '√d sayısının sürekli kesri {length} uzunluğunda bir periyotla tekrar eder; temel çözüm ilk periyodun (uzunluk tekse ikinci periyodun) sonundadır.',
        compositionExplain:
          'Sonraki her çözüm temel çözümle çarpılarak elde edilir — hiperbol üzerindeki noktaların “ikilenmesi” ve “toplanması”.',
        negativeYes:
          'Periyot tek, dolayısıyla x² − {d}y² = −1 denkleminin de çözümü vardır: ({x}, {y}).',
        negativeNo: 'Periyot çift, dolayısıyla x² − {d}y² = −1 denkleminin çözümü yoktur.',
        mordellCount: '|x| ≤ {bound} için {count} tam sayı noktası',
        mordellNote:
          'Arama yalnızca nokta bulabilir; sınırın ötesinde nokta olmadığını kanıtlamak §15.3’tekiler gibi kongrüans argümanları gerektirir.',
      },
      factoring: {
        modeFermat: 'Fermat çarpanlama',
        modeRho: 'Pollard rho',
        modeFermatNumbers: 'Fermat sayıları',
        modeMersenne: 'Mersenne ve Lucas–Lehmer',
        explain: {
          fermat:
            'n = s² − t² = (s + t)(s − t) yaz: s = ⌈√n⌉ ile başla ve s² − n tam kare olana kadar artır. İki çarpan birbirine yakınsa hızlıdır.',
          rho:
            'x ↦ x² + c (mod n) dönüşümünü yinele ve xₖ ile x₂ₖ’yı karşılaştır. EBOB(x₂ₖ − xₖ, n) aşikâr değilse bir çarpandır — çoğu zaman deneme bölmesinden çok önce bulunur.',
          fermatNumbers:
            'Fermat her Fₖ = 2^(2ᵏ) + 1 sayısının asal olduğunu sanıyordu. Yalnızca F₀ … F₄’ün asal olduğu biliniyor; Euler 641 | F₅ olduğunu buldu.',
          mersenne:
            'Mₚ = 2ᵖ − 1 ancak p asalsa asal olabilir. Lucas–Lehmer testi bunu p − 2 kare almayla belirler ve her Mersenne asalı bir çift mükemmel sayı verir.',
        },
        fermatFound: '{tries} farklı s değerinden sonra bulundu',
        fermatGaveUp: '{tries} s değerinden sonra çarpan bulunamadı',
        perfectSquare: 'Kare mi?',
        trivial: 'Yalnızca aşikâr n · 1 ayrışımı çıktı, dolayısıyla n asaldır.',
        rhoFound: '{k}. turda çarpan bulundu',
        rhoFailed:
          'Döngü çarpan bulunmadan kapandı. Başka bir başlangıç değeri ya da c sabiti deneyin.',
        fermatPrime: 'F{k} asaldır',
        fermatComposite: 'F{k} bileşiktir',
        value: 'Değer',
        digits: 'Basamak',
        fermatFactor: 'Çarpan {d} = {j}·2^{k2} + 1; diğer çarpan {cofactor}.',
        noSmallFactor: 'Arama sınırı içinde j·2^(k+2) + 1 biçiminde çarpan bulunamadı.',
        mersennePrime: '2^{p} − 1 bir Mersenne asalıdır',
        mersenneComposite: '2^{p} − 1 bileşiktir',
        compositeExponent:
          '{p} bileşik ve 2ᵃ − 1 sayısı 2^(ab) − 1’i böler; burada {divisor} bir çarpandır.',
        perfect: 'Mükemmel sayı 2^({p} − 1)·(2^{p} − 1) = {value}',
      },
      arith: {
        modeProfile: 'n’nin profili',
        modeDirichlet: 'Dirichlet çarpımı',
        modeInversion: 'Möbius ters çevirme',
        modeThabit: 'Sabit kuralı',
        fn: {
          I: 'birim',
          u: 'sabit 1',
          N: 'n’nin kendisi',
          mu: 'Möbius',
          phi: 'Euler fi',
          tau: 'bölen sayısı',
          sigma: 'bölenler toplamı',
          lambda: 'Liouville',
          mu2: 'karesiz göstergesi',
        },
        kind: {
          perfect: '{n} mükemmeldir: σ(n) = 2n',
          abundant: '{n} bolluk sayısıdır: σ(n) > 2n',
          deficient: '{n} eksik sayıdır: σ(n) < 2n',
        },
        multiplyPerfect: '{n}, {k}-mükemmeldir: σ(n) = {k}n.',
        aliquotHeading: 'Alikot dizisi n → σ(n) − n',
        amicable: '{n} ve {m} dost sayılardır: her biri diğerinin öz bölenlerinin toplamıdır.',
        notAmicable: '{n} sayısının dost eşi yoktur.',
        productMatches: '{f} ⋆ {g}, {h} fonksiyonuna eşittir',
        productNew: '{f} ⋆ {g} listedeki fonksiyonlardan biri değil',
        inversionWorks: 'Möbius ters çevirme {g} fonksiyonunu geri verir',
        inversionFails: 'Ters çevirme g’yi geri vermedi',
        inversionF: 'Burada f = {g} ⋆ u = {f}.',
        thabitWorks: 'n = {n}: üç sayının üçü de asal, dolayısıyla kural bir dost sayı çifti verir',
        thabitFails: 'n = {n}: üç sayının hepsi asal değil, dolayısıyla kural bir şey vermez',
      },
      dist: {
        modeSieve: 'Kalbur',
        modeCounting: 'π(x) ve Li(x)',
        modeRace: 'Asal yarışları',
        modeTwins: 'İkiz asallar',
        modeAverages: 'Ortalama mertebeler',
        modeZeta: 'Zeta fonksiyonu',
        raceMod4: 'mod 4',
        raceMod3: 'mod 3',
        raceModulus: 'Yarış modülü',
        explain: {
          sieve: 'Her p ≤ √n asalının katlarını sil; geriye kalanlar asaldır.',
          counting:
            'Asal Sayı Teoremi: π(x) ~ x / ln x. Gauss’un logaritmik integrali Li(x) = ∫₂ˣ dt / ln t çok daha iyi bir tahmindir.',
          race:
            'Her kalan sınıfındaki asalları say. İki takım da sonsuzdur, ama kalan olmayan takım neredeyse her zaman öndedir (Chebyshev yanlılığı).',
          twins:
            'İkisi de asal olan p, p + 2 çiftleri. Sonsuz sayıda olup olmadıkları bilinmiyor; Hardy–Littlewood sezgisi kaç tane olacağını tahmin eder.',
          averages: 'τ, σ ve φ’nin tek tek değerleri zıplar, ama ortalamaları düzgün büyür.',
          zeta:
            'Gerçel s > 1 için ζ(s) hem tüm n üzerinde bir toplam hem de tüm asallar üzerinde bir çarpımdır — asallarla analiz arasındaki köprü.',
        },
        sieveCount: '{n} sayısına kadar {count} asal',
        sievingPrimes: 'Kalburlayan asallar (p ≤ √n): {primes}',
        sieveGrid: 'Kalbur ızgarası',
        sieveLegend: 'Yeşil sayılar kalburdan geçer; küçük alt simge sayıyı ilk silen asaldır.',
        countingHeading: '{x} sayısına kadar asal sayma',
        errorChart: 'Her tahminin hatası: Li(x) − π(x) ve x/ln x − π(x)',
      pntNote:
          'Bu aralıkta Li(x) hep π(x)’in üstünde kalır, yine de Littlewood farkın işaretinin sonsuz kez değiştiğini kanıtladı.',
        raceHeading: '{x} sayısına kadar mod {m} asallar',
        raceFirstLead: '1 (mod {m}) takımı ilk kez {x} değerinde öne geçer.',
        raceNeverLeads:
          '{x} sayısına kadar ≡ 1 (mod {m}) asallar, ≡ {other} takımının hiç önüne geçmez.',
        raceChanges: 'Liderlik değişimleri (x → önde olan sınıf): {list}',
        twinsHeading: '{x} sayısına kadar {count} ikiz asal çifti',
        twinsNote: 'C₂ ≈ 0,6601 ikiz asal sabitidir. Tahmin bir teorem değil, bir sanıdır.',
        averagesHeading: '{x} sayısına kadar ortalamalar',
        zetaHeading: '{n} terimle ζ({s})',
        tailBound: 'Kuyruk sınırı N^(1−s)/(s − 1)',
        exactValue: 'Kesin değer',
      },
      lattice: {
        heading: 'x > 0 ve y > 0 olan {count} çözüm',
        explain:
          'Pozitiflik koşulu t parametresini bir aralığa sıkıştırır; pozitif çözümleri saymak bu aralıktaki tam sayıları saymaktır.',
      },
      groups: {
        heading: 'ℤ{n} tabloları',
        multiplication: 'Çarpma',
        addition: 'Toplama',
        powers: 'Kuvvetler',
        units: 'Birimler (vurgulu): {units}. Mertebeler: {orders}.',
      },
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
      modulusN: 'Modül n',
      candidateA: 'Aday a',
      exponentK: 'Üs k',
      targetValueA: 'Hedef a',
      baseB: 'Taban b',
      message: 'Mesaj',
      numberList: 'Sayılar (virgülle ayrılmış)',
      blockSize: 'Blok başına harf',
      blockSizeWhole: 'Blok başına harf (0 = tümü)',
      shiftB: 'Kaydırma b',
      primeP: 'Asal p',
      primeQ: 'Asal q',
      baseG: 'Taban g',
      aliceSecret: 'Alice’in sırrı m',
      bobSecret: 'Bob’un sırrı n',
      publicExponent: 'Açık üs e',
      secretK: 'Sır K',
      randomT: 'Rastgele t',
      shareModulus1: 'Modül m₁',
      shareModulus2: 'Modül m₂',
      shareModulus3: 'Modül m₃',
      coefficientC: 'Katsayı c',
      hypotenuseLimit: 'Hipotenüs üst sınırı N',
      parameterP: 'Parametre p',
      parameterQ: 'Parametre q',
      nonSquareD: 'Kare olmayan d',
      constantK: 'Sabit k',
      searchBound: 'Arama sınırı |x|',
      oddIntegerN: 'Tek tam sayı n',
      seed: 'Başlangıç x₀',
      polynomialShift: 'x² + c içindeki c sabiti',
      indexK: 'İndeks k',
      exponentP: 'Üs p',
      functionF: 'Fonksiyon f',
      functionG: 'Fonksiyon g',
      upToN: 'n üst sınırı',
      upToX: 'x üst sınırı',
      realS: 'Gerçel s > 1',
      termsN: 'Terim sayısı N',
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
        description: '1–5. derece f(x) ≡ b (mod m) polinomlarının kökleri; asal kuvvetlere Hensel yükseltmesi',
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
          'Ortak çarpanlı modüller dahil, eşzamanlı kongrüanslar cᵢx ≡ aᵢ (mod mᵢ)',
      },
      mod_exp: {
        title: 'Modüler üs alma ve mertebe',
        description:
          'Hızlı modüler kuvvet aᵉ mod m, mertebe ordₘ(a) ve ilkel kök testi',
      },
      quadratic_residue: {
        title: 'Karesel kalanlar ve kongrüanslar',
        description: 'Legendre ve Jacobi sembolleri, Euler kriteri, mod n karekökler ve ax² + bx + c ≡ 0',
      },
      primitive_roots: {
        title: 'İlkel kökler ve ayrık logaritmalar',
        description: 'Varlık, tüm ilkel kökler, indeks tabloları, xᵏ ≡ a ve bˣ ≡ a (mod n)',
      },
      cryptography: {
        title: 'Kriptografi',
        description:
          'Sezar ve afin şifreler, üs şifresi, Diffie–Hellman, RSA ve ÇKT ile gizli paylaşım',
      },
      primality: {
        title: 'Asallık testleri ve sahte asallar',
        description:
          'Wilson teoremi, Fermat ve Miller testleri, güçlü sahte asallar ve Carmichael sayıları',
      },
      factoring: {
        title: 'Çarpanlama yöntemleri ve özel asallar',
        description:
          'Fermat çarpanlama, Pollard rho, Fermat sayıları, Lucas–Lehmer ile Mersenne asalları ve mükemmel sayılar',
      },
      sums_of_squares: {
        title: 'Kareler toplamı ve Pisagor üçlüleri',
        description:
          'Hangi n’ler a² + b² olur, r₂(n), üç ve dört kare, Gauss çarpanları ve tüm Pisagor üçlüleri',
      },
      pell_curves: {
        title: 'Pell denklemi ve eğriler',
        description:
          'Sürekli kesirler ve bileşim ile x² − dy² = 1; y² = x³ + k üzerindeki tam sayı noktaları',
      },
      arithmetic_functions: {
        title: 'Aritmetik fonksiyonlar',
        description:
          'σₖ, μ, λ, Λ, mükemmel ve dost sayılar, alikot dizileri, Dirichlet çarpımları ve Möbius ters çevirme',
      },
      prime_distribution: {
        title: 'Asalların dağılımı',
        description:
          'Eratosthenes kalburu, π(x) ile Li(x), asal yarışları, ikiz asallar, ortalama mertebeler ve ζ(s)',
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
          'Asal bir p modülünde Lagrange teoremi n dereceli bir polinomu en çok n kökle sınırlar. Bileşik modüllerde bu sınır geçersizdir: x² ≡ 1 (mod 8) denkliğinin dört çözümü vardır. Bir pᵉ asal kuvveti modülünde Hensel lemması mod p kökleri birer kuvvet yükseltir; ÇKT ise asal kuvvetleri birbirine yapıştırır.',
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
          'Modüller ikişer ikişer aralarında asalsa x ≡ aᵢ (mod mᵢ) sisteminin M = ∏mᵢ modülüne göre tek çözümü vardır. Terim terim kurulur: her Mᵢ = M/mᵢ, mᵢ modülünde tersinirdir; böylece aᵢMᵢyᵢ yalnız i. konumda aᵢ verir, diğerlerinde sıfırlanır. Modüller ortak çarpan paylaşıyorsa kongrüanslar ikişer ikişer birleştirilir: çözüm ancak ve ancak EBOB(mᵢ, mⱼ) sayısı aⱼ − aᵢ farkını bölüyorsa vardır ve EKOK’a göre tektir.',
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
      primitive_roots: {
        pedagogy:
          'n’nin bir g ilkel kökü tüm birimleri üretir: g, g², …, g^φ(n) değerleri Uₙ’nin tamamını dolaşır. Böylece her birim bir gⁱ kuvvetidir ve i = ind_g(a) bir logaritma gibi davranır — xᵏ ≡ a ve bˣ ≡ a, φ(n) modülüne göre lineer kongrüanslara dönüşür.',
        theorem:
          'U_n \\text{ devirli} \\iff n \\in \\{2, 4, p^k, 2p^k\\}, \\quad g \\text{ ilkel} \\iff g^{\\varphi(n)/q} \\not\\equiv 1 \\;\\; \\forall\\, q \\mid \\varphi(n)',
        history:
          'İlkel kökleri 1773’te Euler adlandırdı; her asalın bir ilkel kökü olduğunun ilk tam kanıtını Gauss, Disquisitiones Arithmeticae’de (1801) verdi.',
      },
      cryptography: {
        pedagogy:
          'Modern şifreler yöntemleri konusunda açık, yalnızca anahtarları konusunda gizlidir. Her biri yapması kolay ama anahtar olmadan geri alması zor bir işleme dayanır: asalları çarpmak ya da n modülüne göre kuvvet almak.',
        theorem:
          'ed \\equiv 1 \\pmod{\\varphi(n)} \\implies (x^e)^d \\equiv x \\pmod{n}, \\quad n = pq',
        history:
          'Diffie ve Hellman açık anahtar değişimini 1976’da, Rivest, Shamir ve Adleman da RSA’yı 1977’de yayımladı. GCHQ’dan Clifford Cocks eşdeğer bir yöntemi 1973’te bulmuştu; bu çalışma 1997’ye kadar gizli kaldı.',
      },
      primality: {
        pedagogy:
          'Fermat’nın küçük teoremi hızlı bir test verir — ama bileşik sayılar da onu geçebilir, Carmichael sayıları ise her tabanda geçer. Miller testi yol boyunca 1’in kareköklerini de izler ve hiçbir bileşik sayı onu tabanların dörtte birinden fazlasında yanıltamaz.',
        theorem:
          'n \\text{ asal} \\iff (n-1)! \\equiv -1 \\pmod{n}, \\qquad p \\text{ asal} \\implies a^{p-1} \\equiv 1 \\pmod{p}',
        history:
          'Wilson teoremini 1000 yılları civarında İbn el-Heysem ifade etti, 1771’de Lagrange kanıtladı. Korselt kriterini 1899’da verdi, ilk örnekleri 1910–12’de Robert Carmichael buldu; Miller (1976) ve Rabin (1980) Miller testini standart olasılıksal asallık testine dönüştürdü.',
      },
      factoring: {
        pedagogy:
          'Asallığı test etmek kolay, çarpanlara ayırmak zordur — RSA bu farka dayanır. Fermat yöntemi √n’ye yakın çarpanları hedefler; Pollard rho ise iki terim gizli bir çarpana göre çakışana kadar sözde rastgele bir dizide yürür.',
        theorem:
          'n = s^2 - t^2 = (s+t)(s-t), \\qquad M_p \\text{ asal} \\iff x_{p-2} \\equiv 0 \\pmod{M_p}',
        history:
          'Fermat yöntemini 1643’te anlattı; Euler F₅’i 1732’de çarpanlarına ayırdı; Lucas (1876) ve Lehmer (1930) Mersenne testini verdi; Pollard rho’yu 1975’te yayımladı.',
      },
      sums_of_squares: {
        pedagogy:
          'İki kare toplamlarının çarpımı yine iki kare toplamıdır, dolayısıyla her şey asallara indirgenir: 2 ve p ≡ 1 (mod 4) olan her asal iki karenin toplamıdır, p ≡ 3 (mod 4) ise asla değildir.',
        theorem:
          'n = a^2 + b^2 \\iff p^{e} \\parallel n,\\ p \\equiv 3 \\!\\!\\pmod 4 \\implies 2 \\mid e',
        history:
          'Fermat iki kare teoremini 1640’ta ifade etti, Euler 1749’da kanıtladı; Lagrange dört kare teoremini 1770’te kanıtladı.',
      },
      pell_curves: {
        pedagogy:
          'Bir rasyonel noktası olan konikte doğrular çizerek sonsuz çok nokta bulunur. x² − dy² = 1 hiperbolünde tam sayı noktaları bir grup oluşturur: hepsini (x₁ + y₁√d)ᵏ bileşimiyle elde et.',
        theorem: '(x_1 + y_1\\sqrt{d})^k = x_k + y_k\\sqrt{d} \\implies x_k^2 - d\\,y_k^2 = 1',
        history:
          'Bileşim kuralını Brahmagupta (628) buldu; Lagrange (1768) Pell denkleminin her zaman çözümü olduğunu kanıtladı. Euler denklemi yanlışlıkla John Pell’e atfetti.',
      },
      arithmetic_functions: {
        pedagogy:
          'Çarpımsal fonksiyonlar asal kuvvetlerdeki değerleriyle belirlenir. Dirichlet çarpımı altında I birimli bir grup oluştururlar ve μ, sabit u fonksiyonunun tersidir — Möbius ters çevirmesi budur.',
        theorem:
          'f = g \\star u \\iff g = f \\star \\mu, \\qquad (f \\star g)(n) = \\sum_{d \\mid n} f(d)\\, g(n/d)',
        history:
          'Öklid, 2ᵖ − 1 asalken 2ᵖ⁻¹(2ᵖ − 1)’in mükemmel olduğunu kanıtladı, Euler çift sayılar için tersini kanıtladı; Sabit bin Kurra dost sayı kuralını dokuzuncu yüzyılda verdi; Möbius μ’yü 1832’de tanıttı.',
      },
      prime_distribution: {
        pedagogy:
          'Asallar tek tek rastgele görünür ama toplu hâlde düzenlidir: x civarında kabaca ln x sayıdan biri asaldır. Li(x) ve ζ(s) gibi analitik araçlar bunu kesinleştirir.',
        theorem:
          '\\pi(x) \\sim \\frac{x}{\\ln x} \\sim \\mathrm{Li}(x), \\qquad \\zeta(s) = \\sum_{n \\ge 1} n^{-s} = \\prod_p \\left(1 - p^{-s}\\right)^{-1}',
        history:
          'Gauss Asal Sayı Teoremini gençken tahmin etti; Hadamard ve de la Vallée Poussin, Riemann’ın ζ fonksiyonunu kullanarak 1896’da birbirinden bağımsız kanıtladı.',
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
      index: {
        primitiveRoot: '{n} modülünün g = {g} ilkel kökünü al.',
        writeTarget: 'Sağ tarafı g’nin bir kuvveti (indeksi) olarak yaz.',
        substitutePower: 'x = gⁱ koy ve üsleri φ(n) modülüne göre karşılaştır.',
        backSubstitute: 'i için çöz ve {count} üssün her birini x = gⁱ olarak geri çevir.',
        writeBoth: 'Hem b’yi hem a’yı g’nin kuvvetleri olarak yaz.',
        substituteExponent: 'Üsleri φ(n) modülüne göre karşılaştır — x için lineer bir kongrüans.',
      },
      quadratic: {
        multiply: 'Her şeyi 4a = {factor} ile çarp.',
        isolate: 'Kareye tamamla ve kareyi yalnız bırak.',
        squareRoots: '{d} sayısının {n} modülüne göre {count} karekökünü (s) bul.',
        solveLinear: '2a’nın tersiyle 2ax + b = s eşitliğini çöz.',
      },
      dh: {
        alicePublic: 'Alice A = gᵐ değerini açıklar.',
        bobPublic: 'Bob B = gⁿ değerini açıklar.',
        aliceKey: 'Alice, B’yi gizli m üssüne yükseltir.',
        bobKey: 'Bob, A’yı gizli n üssüne yükseltir — ve aynı sayıyı bulur.',
      },
      rsa: {
        modulus: 'Açık modülü elde etmek için asalları çarp.',
        totient: 'φ(n)’yi hesapla — bu yalnızca p ile q’yu bilen biri için kolaydır.',
        coprime: 'e’nin φ(n) ile aralarında asal olduğunu kontrol et.',
        private: 'Gizli anahtar d’yi bulmak için e’nin φ(n) modülüne göre tersini al.',
      },
      crt: {
        reduceRow: '{row}. satır: bu lineer kongrüansı tek başına çöz.',
        mergeStep: '{m1} ve {m2} modüllerini birleştir (EBOB = {gcd}).',
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
      crtRowUnsolvable:
        '{row}. satır: EBOB({c}, {m}) = {d} sayısı {a} sayısını bölmez, dolayısıyla {c}x ≡ {a} (mod {m}) kongrüansının — ve sistemin — çözümü yoktur.',
      crtIncompatible:
        'x ≡ {a1} (mod {m1}) ve x ≡ {a2} (mod {m2}) çelişir: EBOB({m1}, {m2}) = {gcd} sayısı {a2} − {a1} farkını bölmez.',
      henselRequiresPrime: '{p} asal değil, bu yüzden Hensel yükseltmesi uygulanamaz.',
      henselRequiresPositiveExponent: 'Üs en az 1 olmalıdır.',
      henselPrimeTooLarge:
        '{p} asal çarpanı {limit} tarama sınırının üzerinde, bu yüzden kökleri aranarak bulunamadı.',
      tooManyRoots: '{m} modülüne göre {limit} taneden fazla kök var — listelemek için çok fazla.',
      wilsonTooLarge: '(n − 1)! yalnızca n ≤ {limit} için hesaplanır.',
      millerRequiresOdd: 'Miller testi 3 veya daha büyük tek bir n gerektirir.',
      millerTrivialBase:
        '{a} tabanı {n} modülüne göre 0 veya ±1’e denktir ve hiçbir şey söylemez. 1 < a < n − 1 seçin.',
      liarCountTooLarge: 'Tüm tabanları saymak n ≤ {limit} ile sınırlıdır.',
      primitiveRootSearchExhausted: 'Arama sınırı içinde ilkel kök bulunamadı.',
      indexModulusTooSmall: 'n ≥ 3 olan bir modül kullanın.',
      indexNeedsPrimitiveRoot:
        '{n} sayısının ilkel kökü yok, bu yüzden indeks yöntemi uygulanamaz. Bunun yerine n’yi ÇKT ile parçalara ayırıp her parçayı ayrı çözün.',
      indexTooLarge: 'φ(n) değeri {limit} sınırını aşıyor; indeks hesabı burada çok uzun sürer.',
      indexRequiresUnits: 'İndeksler yalnızca {n} ile aralarında asal sayılar için vardır.',
      indexNoSolution:
        'Üsler için elde edilen lineer kongrüansın çözümü yok, dolayısıyla asıl kongrüansın da yok.',
      exponentMustBePositive: 'Üs pozitif bir tam sayı olmalıdır.',
      quadraticLeadingZero:
        'a ≡ 0 (mod {n}), dolayısıyla bu ikinci dereceden değil. Lineer kongrüans çözücüsünü kullanın.',
      quadraticNeedsUnitLeading:
        'EBOB(2·{a}, {n}) ≠ 1 olduğundan kareye tamamlanamaz ve n, {limit} tarama sınırının üzerinde.',
      residueListTooLarge: 'Kalanlar yalnızca {limit} sayısına kadar olan asallar için listelenir.',
      messageHasNoLetters: 'Mesajda en az bir A–Z harfi olmalıdır.',
      invalidBlockSize: 'Blok boyutu 0 ya da pozitif bir tam sayı olmalıdır.',
      invalidNumberList: 'Virgül veya boşlukla ayrılmış negatif olmayan tam sayılar girin.',
      affineNeedsUnit: 'EBOB({a}, {n}) = {gcd} ≠ 1, bu yüzden {a} ile çarpma geri alınamaz.',
      requiresPrimeModulus: '{p} asal değil.',
      exponentNotCoprime:
        'EBOB({e}, {m}) = {gcd} ≠ 1, bu yüzden {e} üssünün {m} modülüne göre tersi alınamaz.',
      blockExceedsModulus:
        '{block} bloğu {n} sayısından küçük değil, bu yüzden şifrelemeden bozulmadan çıkamaz. Daha küçük bloklar veya daha büyük bir modül kullanın.',
      dhBaseOutOfRange: '1 < g < {p} olacak şekilde bir g tabanı seçin.',
      rsaRequiresPrimes: 'RSA için p ve q asal olmalıdır.',
      rsaPrimesMustDiffer: 'p ve q farklı asallar olmalıdır.',
      secretMustBeBelowP: 'K sırrı 0 ≤ K < p = {p} koşulunu sağlamalıdır.',
      sharingModuliNotCoprime:
        '{x} ve {y} sayıları {gcd} çarpanını paylaşıyor; modüller ve p ikişer ikişer aralarında asal olmalıdır.',
      sharingThresholdFails: 'm₁m₂ > p·m₃ (m₁ < m₂ < m₃ iken) gerekir, ama {M} ≤ {pm}.',
      sharingTTooLarge: 't çok büyük: K + tp, m₁m₂’den küçük kalmalıdır, dolayısıyla t ≤ {max}.',
      latticeNeedsPositive: 'Pozitif çözümleri saymak için a > 0 ve b > 0 olmalıdır.',
      pythagoreanNeedsPQ: '1 ≤ p < q olacak şekilde tam sayılar seçin.',
      tripleLimitRange: '5 ile {max} arasında bir hipotenüs sınırı seçin.',
      sieveRange: 'Kalbur 2 ≤ n ≤ {max} için asalları listeler.',
      groupTableRange: 'Tablolar 2 ≤ n ≤ {max} için çizilir.',
      fermatIndexRange: '0 ≤ k ≤ {max} seçin.',
      lucasLehmerRange: '2 ≤ p ≤ {max} olan bir üs seçin.',
      fermatFactorNeedsOdd:
        'Fermat yöntemi 3 veya daha büyük tek bir n gerektirir (önce 2 çarpanlarını ayırın).',
      rhoNeedsComposite: '{n} asal, çarpanlarına ayrılacak bir şey yok.',
      squaresTooLarge: 'Gösterimler n ≤ {max} için aranır.',
      pellNeedsD: 'd ≥ 2 seçin.',
      pellSquare:
        '{d} tam kare, dolayısıyla x² − dy² = 1 denkleminin yalnızca aşikâr çözümleri vardır.',
      pellPeriodTooLong: 'Sürekli kesir periyodu {max} terimi aşıyor.',
      mordellZero: 'k = 0 için her (t², t³) bir noktadır; k ≠ 0 seçin.',
      mordellBoundRange: '1 ile {max} arasında bir arama sınırı seçin.',
      thabitRange: '2 ≤ n ≤ 64 seçin.',
      dirichletRange: '1 ≤ n ≤ {max} seçin.',
      countingRange: '{min} ile {max} arasında bir değer seçin.',
      zetaNeedsS: 'Seri yalnızca s > 1 için yakınsar (bu araç s ≤ 64 kabul eder).',
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
        riemann: {
          title: 'Riemann zeta fonksiyonu ve Riemann hipotezi',
          summary:
            's > 1 için ζ(s), 1/nˢ terimlerinin toplamıdır ve tüm asallar üzerinde bir çarpıma eşittir. Riemann onu s ≠ 1 olan her karmaşık sayıya genişletti; Riemann hipotezi aşikâr olmayan tüm sıfırlarının Re s = 1/2 doğrusu üzerinde olduğunu söyler.',
          details:
            'Euler çarpımı ζ ile asallar arasındaki köprüdür. Hipotez, x ≥ 2657 için |π(x) − Li(x)| ≤ (1/8π)·√x·ln x hata sınırına denktir ve Riemann’ın açık formülünde her sıfır asal sayımına salınan bir terim ekler. Henüz kanıtlanmamıştır (yalnızca tanım — bkz. Crisman §24.2, §25.3, Teorem 25.2.4).',
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
