
import React, { useState, useEffect, useRef } from 'react';
import { Section, Language } from '../types';

interface NavigationProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  language: Language;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, setSection, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const labels = {
    fr: { oracle: 'Oracle', pantheon: 'Panthéon', scriptures: 'Écritures', visions: 'Visions' },
    en: { oracle: 'Oracle', pantheon: 'Pantheon', scriptures: 'Scriptures', visions: 'Visions' }
  };

  // Fermer si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: Section; icon: React.ReactNode; label: string }[] = [
    { 
      id: 'oracle', 
      label: labels[language].oracle,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3c-1.1 0-2 .9-2 2 0 .56.23 1.07.61 1.44L8 10h8l-2.61-3.56c.38-.37.61-.88.61-1.44 0-1.1-.9-2-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 10c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2" />
        </svg>
      )
    },
    { 
      id: 'pantheon', 
      label: labels[language].pantheon,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M3 10l9-7 9 7M5 10v11M9 10v11M15 10v11M19 10v11" />
        </svg>
      )
    },
    { 
      id: 'scriptures', 
      label: labels[language].scriptures,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'visions', 
      label: labels[language].visions,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5c-4.478 0-8.268 2.943-9.542 7 1.274 4.057 5.064 7 9.542 7s8.268-2.943 9.542-7c-1.274-4.057-5.064-7-9.542-7z" />
          <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
        </svg>
      )
    },
  ];

  return (
    <div 
      ref={navRef}
      className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center"
    >
      {/* Menu déployé */}
      <div 
        className={`nav-pill mb-4 px-2 py-2 rounded-[2.5rem] flex items-center space-x-2 sm:space-x-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl origin-bottom ${
          isOpen 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSection(item.id);
              setIsOpen(false);
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-full transition-all duration-300 relative group ${
              currentSection === item.id 
              ? 'bg-black text-white dark:bg-white dark:text-black scale-105' 
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {item.icon}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black dark:bg-zinc-100 text-white dark:text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-xl">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Bulle de commande (Toggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu de navigation"
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl glass-panel border border-white/10 group ${
          isOpen ? 'rotate-[135deg] scale-90' : 'hover:scale-110 active:scale-95'
        }`}
      >
        <div className="relative">
          {/* Symbole mystique central */}
          <svg 
            className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500 ${isOpen ? 'text-zinc-400' : 'text-black dark:text-white'}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          
          {/* Ornementation rotative */}
          {!isOpen && (
            <div className="absolute inset-0 -m-2 border border-zinc-500/20 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-500/40 rounded-full"></div>
            </div>
          )}
        </div>
      </button>
      
      {/* Label de la section active quand le menu est fermé */}
      {!isOpen && (
        <span className="mt-2 text-[8px] font-black uppercase tracking-[0.5em] opacity-40 animate-pulse text-black dark:text-white">
          {labels[language][currentSection]}
        </span>
      )}
    </div>
  );
};

export default Navigation;
