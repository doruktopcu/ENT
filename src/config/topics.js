/**
 * Topic registry. Titles and descriptions live in the translation tree and are
 * looked up as `topics.<id>.title`; only language-neutral metadata sits here.
 *
 * `keywords` exist so search still finds a topic by a term that does not appear
 * in its localised title — including the Turkish abbreviations (EBOB, EKOK,
 * TKS, IKS) that must not leak into the English UI text itself.
 *
 * `book` lists where the topic is developed in Crisman, "Number Theory: In
 * Context and Interactive" (2024 ed.) — shown in the lecture notes so students
 * can read the full treatment. docs/BOOK_SOURCES.md says what was taken from it.
 */
export const TOPICS = [
  {
    id: 'gcd_lcm',
    book: '§2.1–2.4',
    keywords: ['gcd', 'lcm', 'ebob', 'ekok', 'euclid', 'öklid', 'bezout', 'extended', 'genişletilmiş'],
  },
  {
    id: 'diophantine',
    book: '§3.1–3.3',
    keywords: ['diophantus', 'diophantine', 'ax+by=c', 'linear equation', 'lineer denklem', 'tam sayı'],
  },
  {
    id: 'linear_congruence',
    book: '§5.1–5.2',
    keywords: ['congruence', 'kongrüans', 'denklik', 'modular', 'modüler', 'ax=b', 'mod', 'inverse', 'ters'],
  },
  {
    id: 'modular_poly',
    book: '§7.1–7.4, §16.1',
    keywords: ['polynomial', 'polinom', 'roots', 'kök', 'degree', 'derece', 'lagrange', 'hensel', 'prime power', 'asal kuvvet', 'lifting', 'yükseltme'],
  },
  {
    id: 'euler_phi',
    book: '§8.1–8.2, §9.1–9.5',
    keywords: ['euler', 'phi', 'totient', 'crs', 'rrs', 'tks', 'iks', 'residue', 'kalan'],
  },
  {
    id: 'prime_factor',
    book: '§6.1–6.4, §19.1–19.2',
    keywords: ['prime', 'asal', 'factorization', 'çarpan', 'tau', 'sigma', 'mobius', 'möbius', 'divisor', 'bölen'],
  },
  {
    id: 'crt',
    book: '§5.3–5.5',
    keywords: ['crt', 'çkt', 'chinese remainder', 'çin kalan', 'system', 'sistem', 'coprime', 'sunzi', 'qin', 'lcm', 'ekok'],
  },
  {
    id: 'mod_exp',
    book: '§4.5.2, §8.2, §10.1',
    keywords: ['power', 'kuvvet', 'exponentiation', 'üs', 'order', 'mertebe', 'primitive root', 'ilkel kök', 'fermat'],
  },
  {
    id: 'quadratic_residue',
    book: '§16.1–16.7, §17.4',
    keywords: [
      'legendre',
      'jacobi',
      'quadratic residue',
      'karesel kalan',
      'gauss',
      'reciprocity',
      'karşılıklılık',
      'square root',
      'karekök',
      'completing the square',
      'tam kare',
      'quadratic congruence',
      'ikinci dereceden',
    ],
  },
  {
    id: 'primitive_roots',
    book: '§10.1–10.7',
    keywords: [
      'primitive root',
      'ilkel kök',
      'generator',
      'üreteç',
      'index',
      'indeks',
      'discrete log',
      'ayrık logaritma',
      'cyclic',
      'devirli',
      'higher root',
    ],
  },
  {
    id: 'cryptography',
    book: '§11.1–11.7',
    keywords: [
      'cryptography',
      'kriptografi',
      'rsa',
      'diffie',
      'hellman',
      'caesar',
      'sezar',
      'affine',
      'afin',
      'cipher',
      'şifre',
      'secret sharing',
      'gizli paylaşım',
      'key exchange',
      'anahtar',
    ],
  },
  {
    id: 'primality',
    book: '§7.5, §12.2–12.4',
    keywords: [
      'primality',
      'asallık',
      'wilson',
      'miller',
      'rabin',
      'pseudoprime',
      'sahte asal',
      'carmichael',
      'korselt',
      'strong pseudoprime',
      'güçlü sahte asal',
      'fermat test',
    ],
  },
  {
    id: 'factoring',
    book: '§12.1, §12.5–12.6, §19.4',
    keywords: ['factoring', 'çarpanlara', 'pollard', 'rho', 'fermat factor', 'mersenne', 'lucas', 'lehmer', 'fermat number', 'fermat sayısı', 'perfect', 'mükemmel'],
  },
  {
    id: 'sums_of_squares',
    book: '§3.4, §13.1–13.6, §14.1–14.2',
    keywords: ['sum of squares', 'kareler toplamı', 'two squares', 'four squares', 'lagrange', 'pythagorean', 'pisagor', 'gaussian', 'gauss tam', 'r2', 'triple', 'üçlü'],
  },
  {
    id: 'pell_curves',
    book: '§15.3–15.6',
    keywords: ['pell', 'continued fraction', 'sürekli kesir', 'mordell', 'bachet', 'curve', 'eğri', 'conic', 'konik', 'hyperbola', 'hiperbol'],
  },
  {
    id: 'arithmetic_functions',
    book: '§18–19, §23',
    keywords: ['sigma', 'tau', 'perfect', 'mükemmel', 'abundant', 'bolluk', 'amicable', 'dost', 'aliquot', 'dirichlet', 'convolution', 'möbius inversion', 'ters çevirme', 'liouville', 'mangoldt', 'thabit'],
  },
  {
    id: 'prime_distribution',
    book: '§6.2, §20–22, §24',
    keywords: ['sieve', 'eratosthenes', 'kalbur', 'prime counting', 'asal sayma', 'pi(x)', 'li(x)', 'prime number theorem', 'asal sayı teoremi', 'twin', 'ikiz', 'race', 'yarış', 'zeta', 'average', 'ortalama'],
  },
];

export const DEFAULT_TOPIC_ID = TOPICS[0].id;
