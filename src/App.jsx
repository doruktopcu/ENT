import React from 'react';
import { Calculator, Globe, Layers, Maximize2 } from 'lucide-react';

import { AppProvider, useApp } from './context/AppContext';
import { DEFAULT_TOPIC_ID, TOPICS } from './config/topics';

import SearchHeader from './components/SearchHeader';
import ProfessorAssistant from './components/ProfessorAssistant';
import SettingsModal from './components/SettingsModal';
import HistoryTab from './components/HistoryTab';
import CustomFormulaWorkbench from './components/CustomFormulaWorkbench';
import TheoryWiki from './components/TheoryWiki';

import GcdLcmSolver from './components/Solvers/GcdLcmSolver';
import DiophantineSolver from './components/Solvers/DiophantineSolver';
import LinearCongruenceSolver from './components/Solvers/LinearCongruenceSolver';
import ModularPolynomialSolver from './components/Solvers/ModularPolynomialSolver';
import EulerPhiSolver from './components/Solvers/EulerPhiSolver';
import PrimeFactorizationSolver from './components/Solvers/PrimeFactorizationSolver';
import ChineseRemainderSolver from './components/Solvers/ChineseRemainderSolver';
import ModularExponentiationSolver from './components/Solvers/ModularExponentiationSolver';
import QuadraticResidueSolver from './components/Solvers/QuadraticResidueSolver';

const APP_VERSION = '1.0.0';

/** A lookup table beats nine chained `&&` expressions in the render tree. */
const SOLVERS = {
  gcd_lcm: GcdLcmSolver,
  diophantine: DiophantineSolver,
  linear_congruence: LinearCongruenceSolver,
  modular_poly: ModularPolynomialSolver,
  euler_phi: EulerPhiSolver,
  prime_factor: PrimeFactorizationSolver,
  crt: ChineseRemainderSolver,
  mod_exp: ModularExponentiationSolver,
  quadratic_residue: QuadraticResidueSolver,
};

const TAB_PANELS = {
  workbench: CustomFormulaWorkbench,
  history: HistoryTab,
  wiki: TheoryWiki,
};

/** Open the full lab page, both as an extension and from a plain dev server. */
function openFullLabView() {
  const isExtension = typeof chrome !== 'undefined' && chrome?.runtime?.getURL;
  const url = isExtension ? chrome.runtime.getURL('index.html') : 'index.html';
  window.open(url, '_blank', 'noopener,noreferrer');
}

function MainAppShell() {
  const { activeTab, setActiveTab, selectedTopicId, setSelectedTopicId, setIsSettingsOpen, language, t } =
    useApp();

  const activeTopic = TOPICS.find((topic) => topic.id === selectedTopicId) ?? TOPICS[0];
  const ActiveSolver = SOLVERS[activeTopic.id] ?? SOLVERS[DEFAULT_TOPIC_ID];
  const ActivePanel = TAB_PANELS[activeTab];

  const handleSelectTopicFromSearch = (topic) => {
    setSelectedTopicId(topic.id);
    setActiveTab('solvers');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto selection:bg-amber-500/30">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 shrink-0">
            ENT
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black tracking-tight serif-font gold-gradient-text">
              {t('appTitle')}
            </h1>
            <p className="text-xs text-slate-400">{t('appSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label={t('settings.language')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="uppercase font-bold">{language}</span>
          </button>

          <button
            type="button"
            onClick={openFullLabView}
            title={t('labFullViewTitle')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t('labFullView')}</span>
          </button>
        </div>
      </header>

      <SearchHeader topics={TOPICS} onSelectTopic={handleSelectTopicFromSearch} />

      <ProfessorAssistant activeTopic={activeTopic} />

      <main>
        {activeTab === 'solvers' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <nav aria-label={t('nav.solverList')} className="lg:col-span-4 space-y-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                {t('solverListHeading', { count: TOPICS.length })}
              </h2>
              <ul className="space-y-1.5 list-none">
                {TOPICS.map((topic) => {
                  const isActive = selectedTopicId === topic.id;
                  return (
                    <li key={topic.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedTopicId(topic.id)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center gap-2 ${
                          isActive
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        <Calculator
                          className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`}
                          aria-hidden="true"
                        />
                        <span>{t(`topics.${topic.id}.title`)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="lg:col-span-8 min-w-0">
              <ActiveSolver />
            </div>
          </div>
        ) : (
          ActivePanel && <ActivePanel />
        )}
      </main>

      <SettingsModal />

      <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2 font-mono">
        <span>{t('footerTagline', { version: APP_VERSION })}</span>
        <span>EN / TR • Manifest V3</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
