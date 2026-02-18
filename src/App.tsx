
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import OracleChat from './components/OracleChat';
import GodExplorer from './components/GodExplorer';
import BibleDeepDive from './components/BibleDeepDive';
import DivineVisions from './components/DivineVisions';
import { Section, Language } from './types';

const App: React.FC = () => {
  const [section, setSection] = useState<Section>('oracle');
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const headers = {
    fr: { title: 'ARCHIVES SPIRITUELLES', subtitle: 'Base de données universelle' },
    en: { title: 'SPIRITUAL ARCHIVES', subtitle: 'Universal Database' }
  };

  const renderContent = () => {
    switch (section) {
      case 'oracle': return <OracleChat language={language} />;
      case 'pantheon': return <GodExplorer language={language} />;
      case 'scriptures': return <BibleDeepDive language={language} />;
      case 'visions': return <DivineVisions language={language} />;
      default: return <OracleChat language={language} />;
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#050505] transition-colors duration-500">
      {/* Cercle mystique en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zinc-500/5 blur-[120px] rounded-full -z-10 pointer-events-none animate-pulse"></div>

      <div className="w-full sm:max-w-6xl h-full sm:h-[90vh] sm:mx-6 glass-panel sm:rounded-[3rem] flex flex-col relative overflow-hidden fade-in shadow-2xl border-x border-white/5">
        {/* En-tête fixe */}
        <header className="shrink-0 p-6 sm:px-10 sm:py-8 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl z-20">
          <div className="flex flex-col">
            <h1 className="text-[9px] font-black tracking-[0.6em] text-zinc-500 uppercase mb-1">
              {headers[language].title}
            </h1>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-tighter text-black dark:text-white flex items-center gap-3">
              <span className="opacity-20">/</span> {section.toUpperCase()}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              aria-label="Mode Sombre"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl glass-tile flex items-center justify-center hover:bg-zinc-500/10 transition-transform active:scale-90"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              aria-label="Changer Langue"
              className="px-4 h-10 sm:h-12 rounded-2xl glass-tile flex items-center justify-center font-black text-[10px] tracking-widest hover:bg-zinc-500/10 transition-transform active:scale-90"
            >
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        {/* Zone de contenu avec scroll sécurisé */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          <div className="max-w-5xl mx-auto px-6 py-8 sm:px-10 sm:py-12 min-h-full flex flex-col">
            <div className="flex-1 pb-32 sm:pb-24">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Navigation Flottante sécurisée */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none h-48 bg-gradient-to-t from-black/20 to-transparent z-40 hidden sm:block"></div>
      <Navigation 
        currentSection={section} 
        setSection={setSection} 
        language={language}
      />
    </div>
  );
};

export default App;
