
import React from 'react';
import { Section, Language } from '../types';

interface SidebarProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  isDark: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setSection, isDark, toggleTheme, language, setLanguage }) => {
  const labels = {
    fr: {
      oracle: 'Oracle',
      pantheon: 'Panthéon',
      scriptures: 'Écritures',
      visions: 'Visions',
      light: 'Voie Lumineuse',
      dark: 'Voie Sombre',
      sync: 'Synchronisation',
    },
    en: {
      oracle: 'Oracle',
      pantheon: 'Pantheon',
      scriptures: 'Scriptures',
      visions: 'Visions',
      light: 'Light Path',
      dark: 'Dark Path',
      sync: 'Knowledge Sync',
    }
  };

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'oracle', label: labels[language].oracle, icon: '✨' },
    { id: 'pantheon', label: labels[language].pantheon, icon: '🏛️' },
    { id: 'scriptures', label: labels[language].scriptures, icon: '📜' },
    { id: 'visions', label: labels[language].visions, icon: '👁️' },
  ];

  return (
    <div className="w-full md:w-64 glass h-screen sticky top-0 flex flex-col p-8 z-50 transition-all border-r border-white/5">
      <div className="mb-12">
        <h1 className="font-cinzel text-2xl font-black tracking-tighter bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
          SPIRITUS
        </h1>
        <div className="h-px w-12 bg-violet-500/50 mt-2"></div>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-500 ${
              currentSection === item.id
                ? 'bg-violet-600/10 text-violet-500 scale-105 shadow-sm'
                : 'text-gray-400 hover:text-violet-400 hover:bg-violet-500/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold text-sm tracking-wide uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex glass rounded-2xl p-1">
          <button 
            onClick={() => setLanguage('en')}
            className={`flex-1 py-2 text-[10px] font-black tracking-widest rounded-xl transition-all ${language === 'en' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-500'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('fr')}
            className={`flex-1 py-2 text-[10px] font-black tracking-widest rounded-xl transition-all ${language === 'fr' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-500'}`}
          >
            FR
          </button>
        </div>

        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl glass hover:bg-violet-500/10 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <span>{isDark ? labels[language].light : labels[language].dark}</span>
          <span>{isDark ? '☀️' : '🌙'}</span>
        </button>

        <div className="p-4 rounded-2xl bg-violet-600/5 border border-violet-500/10">
          <p className="text-[10px] uppercase tracking-widest text-violet-500/60 font-bold mb-1">{labels[language].sync}</p>
          <div className="flex space-x-1">
            <div className="h-1 flex-1 bg-violet-500/40 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-[70%] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
