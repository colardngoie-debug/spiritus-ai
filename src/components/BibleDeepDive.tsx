
import React, { useState } from 'react';
import { getStructuredBibleInsight } from '../services/geminiService';
import { BibleInsight, Language } from '../types';

interface BibleDeepDiveProps {
  language: Language;
}

const BibleDeepDive: React.FC<BibleDeepDiveProps> = ({ language }) => {
  const [topic, setTopic] = useState('');
  const [insight, setInsight] = useState<BibleInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const texts = {
    fr: {
      research: 'PARAMÈTRES DE RECHERCHE',
      placeholder: 'MOT-CLÉ OU VERSET...',
      button: 'DÉCODER',
      loading: 'DÉCRYPTAGE DU CANON...',
      references: 'FRAGMENTS TEXTUELS',
      history: 'STRATES HISTORIQUES',
      select: 'INITIALISEZ UNE RECHERCHE POUR VOIR LES DONNÉES',
    },
    en: {
      research: 'SEARCH PARAMETERS',
      placeholder: 'KEYWORD OR VERSE...',
      button: 'DECODE',
      loading: 'DECRYPTING CANON...',
      references: 'TEXTUAL FRAGMENTS',
      history: 'HISTORICAL STRATA',
      select: 'INITIALIZE SEARCH TO VIEW DATA',
    }
  };

  const fetchInsight = async (t?: string) => {
    const finalTopic = t || topic;
    if (!finalTopic) return;
    setLoading(true);
    try {
      const data = await getStructuredBibleInsight(finalTopic, language);
      setInsight(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const commonTopics = language === 'fr' 
    ? ["Évangiles Perdus", "Le Mystère des Elohim", "Origines du Lévitique", "Apocalypse de Jean"]
    : ["Lost Gospels", "The Elohim Mystery", "Leviticus Origins", "Revelation of John"];

  return (
    <div className="w-full space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Panneau de Contrôle à Gauche (Tableau d'options) */}
        <div className="lg:col-span-4 space-y-6 sticky top-0">
          <div className="glass-tile p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">{texts[language].research}</h3>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchInsight()}
                  placeholder={texts[language].placeholder}
                  className="w-full bg-black/10 dark:bg-white/5 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-zinc-500/50 font-bold text-xs uppercase tracking-widest mb-2"
                />
              </div>
              <button 
                onClick={() => fetchInsight()}
                disabled={loading}
                className="w-full bg-black text-white dark:bg-zinc-100 dark:text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-20"
              >
                {texts[language].button}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {commonTopics.map(t => (
              <button 
                key={t}
                onClick={() => { setTopic(t); fetchInsight(t); }}
                className="w-full text-left px-5 py-4 glass-tile rounded-2xl hover:bg-zinc-500/10 transition-all flex items-center justify-between group border border-transparent hover:border-white/10"
              >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">{t}</span>
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-all text-xs">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panneau de Résultats à Droite (Tableau de données) */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="h-full min-h-[500px] glass-tile rounded-[3rem] border border-white/5 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-2 border-zinc-500/20 border-t-zinc-500 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{texts[language].loading}</p>
            </div>
          ) : insight ? (
            <div className="glass-tile rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl animate-fade-in">
              {/* Header du Tableau */}
              <div className="bg-white/5 px-10 py-8 border-b border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-black tracking-tight">{insight.topic}</h3>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Classification: Sacred Architecture / Level 9</p>
                </div>
                <div className="h-10 w-10 glass-tile rounded-xl flex items-center justify-center font-black text-xs">
                  {insight.topic.charAt(0)}
                </div>
              </div>

              {/* Corps du Tableau */}
              <div className="p-8 sm:p-12 space-y-12">
                <section>
                  <p className="text-base sm:text-lg leading-relaxed font-medium opacity-90 text-justify">{insight.explanation}</p>
                </section>
                
                {/* Sous-tableau : Fragments */}
                <section className="space-y-6">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 border-l-2 border-zinc-500 pl-4">{texts[language].references}</h4>
                  <div className="grid gap-4">
                    {insight.verses.map((v, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 font-medium italic opacity-80 hover:bg-white/10 transition-colors">
                        <span className="text-[9px] block mb-2 font-black not-italic opacity-30">REF_{i+102}</span>
                        "{v}"
                      </div>
                    ))}
                  </div>
                </section>

                {/* Sous-tableau : Histoire */}
                <section className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6">{texts[language].history}</h4>
                  <p className="text-sm leading-relaxed opacity-70 font-medium italic">
                    {insight.historicalContext}
                  </p>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] glass-tile rounded-[3rem] border border-white/5 border-dashed flex flex-col items-center justify-center opacity-20 text-center px-10">
              <span className="text-5xl mb-6">📜</span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-xs">{texts[language].select}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleDeepDive;
