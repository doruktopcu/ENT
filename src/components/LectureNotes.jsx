import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, GraduationCap, HelpCircle, Lightbulb } from 'lucide-react';
import MathRender from './MathRender';
import { useApp } from '../context/AppContext';

/** The free online edition of the reference textbook. */
const BOOK_URL = 'https://math.gordon.edu/ntic/ntic/ntic.html';

const NOTE_TABS = [
  { id: 'pedagogy', labelKey: 'notes.intuition', Icon: Lightbulb },
  { id: 'theorem', labelKey: 'notes.theorem', Icon: CheckCircle2 },
  { id: 'history', labelKey: 'notes.history', Icon: HelpCircle },
];

/**
 * The lecture notes used to be a hard-coded English object inside this
 * component, so the Turkish UI silently fell back to English prose. They now
 * come from the translation tree like everything else.
 */
export default function LectureNotes({ activeTopic }) {
  const { t } = useApp();
  const [showNotes, setShowNotes] = useState(true);
  const [activeNote, setActiveNote] = useState('pedagogy');

  const topicId = activeTopic?.id ?? 'gcd_lcm';

  return (
    <section className="mb-6 glass-panel-gold rounded-2xl p-4 md:p-5 relative overflow-hidden">
      <div
        className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <GraduationCap className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-amber-200 serif-font">
                {t('notes.title')}
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {t(`topics.${topicId}.title`)}
              </span>
            </div>
            <p className="text-xs text-slate-400">{t('notes.subtitle')}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNotes((current) => !current)}
          aria-expanded={showNotes}
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors shrink-0 font-medium"
        >
          {showNotes ? t('notes.hideNotes') : t('notes.showNotes')}
        </button>
      </div>

      {showNotes && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 mb-3" role="tablist">
            {NOTE_TABS.map(({ id, labelKey, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeNote === id}
                onClick={() => setActiveNote(id)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  activeNote === id
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {t(labelKey)}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            {activeNote === 'pedagogy' && (
              <p className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t(`insights.${topicId}.pedagogy`)}</span>
              </p>
            )}
            {activeNote === 'theorem' && (
              <div className="flex items-center justify-center p-2 text-amber-200 overflow-x-auto">
                <MathRender math={t(`insights.${topicId}.theorem`)} block />
              </div>
            )}
            {activeNote === 'history' && (
              <p className="italic text-slate-300">{t(`insights.${topicId}.history`)}</p>
            )}
          </div>

          {activeTopic?.book && (
            <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{t('notes.bookReference', { sections: activeTopic.book })}</span>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                {t('notes.readOnline')}
              </a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
