/**
 * Topic registry. Titles and descriptions live in the translation tree and are
 * looked up as `topics.<id>.title`; only language-neutral metadata sits here.
 *
 * `keywords` exist so search still finds a topic by a term that does not appear
 * in its localised title — including the Turkish abbreviations (EBOB, EKOK,
 * TKS, IKS) that must not leak into the English UI text itself.
 */
export const TOPICS = [
  {
    id: 'gcd_lcm',
    keywords: ['gcd', 'lcm', 'ebob', 'ekok', 'euclid', 'öklid', 'bezout', 'extended', 'genişletilmiş'],
  },
  {
    id: 'diophantine',
    keywords: ['diophantus', 'diophantine', 'ax+by=c', 'linear equation', 'lineer denklem', 'tam sayı'],
  },
  {
    id: 'linear_congruence',
    keywords: ['congruence', 'kongrüans', 'denklik', 'modular', 'modüler', 'ax=b', 'mod', 'inverse', 'ters'],
  },
  {
    id: 'modular_poly',
    keywords: ['polynomial', 'polinom', 'roots', 'kök', 'degree', 'derece', 'lagrange'],
  },
  {
    id: 'euler_phi',
    keywords: ['euler', 'phi', 'totient', 'crs', 'rrs', 'tks', 'iks', 'residue', 'kalan'],
  },
  {
    id: 'prime_factor',
    keywords: ['prime', 'asal', 'factorization', 'çarpan', 'tau', 'sigma', 'mobius', 'möbius', 'divisor', 'bölen'],
  },
  {
    id: 'crt',
    keywords: ['crt', 'çkt', 'chinese remainder', 'çin kalan', 'system', 'sistem', 'coprime', 'sunzi'],
  },
  {
    id: 'mod_exp',
    keywords: ['power', 'kuvvet', 'exponentiation', 'üs', 'order', 'mertebe', 'primitive root', 'ilkel kök', 'fermat'],
  },
  {
    id: 'quadratic_residue',
    keywords: ['legendre', 'jacobi', 'quadratic residue', 'karesel kalan', 'gauss', 'reciprocity', 'karşılıklılık'],
  },
];

export const DEFAULT_TOPIC_ID = TOPICS[0].id;
