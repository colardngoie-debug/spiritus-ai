
import React, { useState } from 'react';
import { getSpiritualResponse } from '../services/geminiService';
import { Language } from '../types';

interface GodExplorerProps {
  language: Language;
}

const GodExplorer: React.FC<GodExplorerProps> = ({ language }) => {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const texts = {
    fr: { placeholder: 'ID DE LA DIVINITÉ...', seek: 'EXTRAIRE', record: 'DOSSIER ARCHEOLOGIQUE', status: 'SYNCHRONISATION...' },
    en: { placeholder: 'DEITY ID...', seek: 'EXTRACT', record: 'ARCHAEOLOGICAL RECORD', status: 'SYNCING...' }
  };

  const exploreGod = async (name?: string) => {
    const target = name || search;
    if (!target) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Profile the deity: ${target}. Focus on historical roots. Response in ${language === 'fr' ? 'French' : 'English'}. No asterisks. Format as a clean descriptive text.`;
      const response = await getSpiritualResponse(prompt, [], language);
      setResult(response);
    } catch (err) {
      setResult("Erreur d'accès aux archives.");
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = ["Yahweh", "Allah", "Zeus", "Enlil", "Osiris", "Quetzalcoatl"];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Barre de recherche style Terminal */}
      <div className="glass-tile rounded-[2rem] p-3 flex flex-col sm:flex-row items-center gap-3 border border-white/5 shadow-inner">
        <div className="flex-1 flex items-center px-4 w-full">
          <span className="text-zinc-500 font-black text-[10px] mr-3">ID:</span>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && exploreGod()}
            placeholder={texts[language].placeholder}
            className="w-full bg-transparent focus:outline-none font-bold text-sm tracking-widest uppercase placeholder:opacity-20"
          />
        </div>
        <button 
          onClick={() => exploreGod()}
          className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-80 transition-all active:scale-95"
        >
          {texts[language].seek}
        </button>
      </div>

      {/* Raccourcis de Panthéon */}
      <div className="flex flex-wrap gap-2 justify-center opacity-60">
        {quickLinks.map(g => (
          <button 
            key={g} 
            onClick={() => { setSearch(g); exploreGod(g); }} 
            className="px-4 py-2 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest hover:border-zinc-500 hover:opacity-100 transition-all"
          >
            {g}
          </button>
        ))}
      </div>

      {loading && (
        <div className="h-64 glass-tile rounded-[3rem] border border-white/5 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-zinc-500/20 border-t-zinc-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black tracking-widest uppercase opacity-40">{texts[language].status}</p>
        </div>
      )}

      {result && (
        <div className="glass-tile rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl fade-in">
          <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              {texts[language].record} — #{search.toUpperCase() || 'UNKNOWN'}
            </h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-sm sm:text-base leading-loose font-medium opacity-90 text-justify">
                {result}
              </p>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Digital Archive Extraction Complete</span>
              <div className="flex gap-4">
                <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-zinc-600 w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GodExplorer;
