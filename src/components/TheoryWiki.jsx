import React, { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import MathRender from './MathRender';
import { useApp } from '../context/AppContext';

/**
 * Wiki entries hold only language-neutral data (id, category, LaTeX, source).
 * Titles, summaries and details live in the translation tree, so the guide is
 * localised rather than being hard-coded English as it was before.
 */
const WIKI_ENTRIES = [
  {
    id: 'divisibility',
    category: 'divisibility',
    latex: 'a \\mid b \\iff \\exists k \\in \\mathbb{Z} : b = ak',
    sourceUrl: 'https://mathworld.wolfram.com/GreatestCommonDivisor.html',
  },
  {
    id: 'congruence',
    category: 'modular',
    latex: 'a \\equiv b \\pmod{m} \\iff m \\mid (a - b)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Modular_arithmetic',
  },
  {
    id: 'diophantine',
    category: 'equations',
    latex: 'ax + by = c \\text{ solvable} \\iff \\gcd(a,b) \\mid c',
    sourceUrl: 'https://mathworld.wolfram.com/DiophantineEquation.html',
  },
  {
    id: 'euler_phi',
    category: 'functions',
    latex: '\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Euler%27s_totient_function',
  },
  {
    id: 'mobius',
    category: 'functions',
    latex: 'g(n) = \\sum_{d \\mid n} f(d) \\iff f(n) = \\sum_{d \\mid n} \\mu(d)\\, g\\!\\left(\\tfrac{n}{d}\\right)',
    sourceUrl: 'https://en.wikipedia.org/wiki/M%C3%B6bius_function',
  },
  {
    id: 'fermat_theorem',
    category: 'theorems',
    latex: 'a^{p-1} \\equiv 1 \\pmod{p} \\quad (p \\text{ prime}, \\; p \\nmid a)',
    sourceUrl: 'https://mathworld.wolfram.com/FermatsLittleTheorem.html',
  },
  {
    id: 'euler_theorem',
    category: 'theorems',
    latex: '\\gcd(a, m) = 1 \\implies a^{\\varphi(m)} \\equiv 1 \\pmod{m}',
    sourceUrl: 'https://en.wikipedia.org/wiki/Euler%27s_theorem',
  },
  {
    id: 'crt',
    category: 'theorems',
    latex:
      'x \\equiv a_i \\!\\!\\pmod{m_i} \\implies x \\equiv x_0 \\!\\!\\pmod{M}, \\; M = \\prod_i m_i',
    sourceUrl: 'https://en.wikipedia.org/wiki/Chinese_remainder_theorem',
  },
  {
    id: 'primitive_root',
    category: 'residues',
    latex: '\\operatorname{ord}_m(a) \\mid \\varphi(m), \\quad a \\text{ primitive} \\iff \\operatorname{ord}_m(a) = \\varphi(m)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Primitive_root_modulo_n',
  },
  {
    id: 'wilson_theorem',
    category: 'theorems',
    latex: '(n-1)! \\equiv -1 \\pmod{n} \\iff n \\text{ is prime}',
    sourceUrl: 'https://mathworld.wolfram.com/WilsonsTheorem.html',
  },
  {
    id: 'quadratic_residue',
    category: 'residues',
    latex: '\\left(\\frac{a}{p}\\right) \\equiv a^{\\frac{p-1}{2}} \\pmod{p}',
    sourceUrl: 'https://en.wikipedia.org/wiki/Quadratic_residue',
  },
  {
    id: 'jacobi',
    category: 'residues',
    latex: '\\left(\\frac{a}{n}\\right) = \\prod_{i} \\left(\\frac{a}{p_i}\\right)^{k_i}, \\quad n = \\prod_i p_i^{k_i}',
    sourceUrl: 'https://en.wikipedia.org/wiki/Jacobi_symbol',
  },
  {
    // Definition only (NTIC §24.2, §25.3, Theorem 25.2.4): the lab does not
    // compute non-trivial zeros, which needs complex analysis beyond the engine.
    id: 'riemann',
    category: 'functions',
    latex:
      '\\begin{gathered} \\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^{s}} = \\prod_{p} \\frac{1}{1 - p^{-s}} \\quad (\\operatorname{Re} s > 1) \\\\ \\zeta(\\rho) = 0,\\; 0 < \\operatorname{Re}\\rho < 1 \\implies \\operatorname{Re}\\rho = \\tfrac{1}{2} \\end{gathered}',
    sourceUrl: 'https://math.gordon.edu/ntic/ntic/ntic.html',
  },
];

const CATEGORIES = ['all', 'divisibility', 'modular', 'equations', 'functions', 'theorems', 'residues'];

export default function TheoryWiki() {
  const { t } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredEntries = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();

    return WIKI_ENTRIES.filter((entry) => {
      if (activeCategory !== 'all' && entry.category !== activeCategory) return false;
      if (!needle) return true;

      // Search the *localised* text so Turkish queries match Turkish content.
      const haystack = [
        t(`wiki.entries.${entry.id}.title`),
        t(`wiki.entries.${entry.id}.summary`),
        t(`wiki.entries.${entry.id}.details`),
        t(`wiki.categories.${entry.category}`),
      ]
        .join(' ')
        .toLocaleLowerCase();

      return haystack.includes(needle);
    });
  }, [activeCategory, query, t]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          <h2 className="text-base font-bold text-indigo-200 serif-font">{t('wiki.title')}</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">{t('wiki.subtitle')}</p>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('wiki.searchPlaceholder')}
            aria-label={t('wiki.searchPlaceholder')}
            className="math-input w-full pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1" role="tablist">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                activeCategory === category
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {category === 'all' ? t('wiki.allTopics') : t(`wiki.categories.${category}`)}
            </button>
          ))}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400">{t('wiki.noResults', { query })}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {t(`wiki.categories.${entry.category}`)}
                </span>
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  {t('wiki.reference')}
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>

              <h3 className="text-sm font-bold text-slate-100">
                {t(`wiki.entries.${entry.id}.title`)}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(`wiki.entries.${entry.id}.summary`)}
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center overflow-x-auto">
                <MathRender math={entry.latex} block />
              </div>

              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                {t(`wiki.entries.${entry.id}.details`)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
