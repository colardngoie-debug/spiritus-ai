
import React, { useState } from 'react';
import { generateSpiritualVision } from '../services/geminiService';
import { Language } from '../types';

interface DivineVisionsProps {
  language: Language;
}

const DivineVisions: React.FC<DivineVisionsProps> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const texts = {
    fr: {
      title: 'Visions Divines',
      subtitle: 'Manifestations calibrées sur l\'histoire et l\'iconographie sacrée.',
      label: 'Décrivez la vision...',
      placeholder: 'ex: La déesse Isis avec ses attributs traditionnels dans un temple égyptien...',
      button: 'Générer Vision Sacrée',
      manifesting: 'Recherche des archives célestes...',
      brewing: 'Expansion du contexte historique et manifestation...',
      save: 'Conserver dans votre royaume',
    },
    en: {
      title: 'Divine Visions',
      subtitle: 'Manifestations calibrated with historical and sacred iconography.',
      label: 'Describe the vision...',
      placeholder: 'e.g. The goddess Isis with traditional attributes in an Egyptian temple...',
      button: 'Generate Sacred Vision',
      manifesting: 'Scanning celestial archives...',
      brewing: 'Expanding historical context and manifesting...',
      save: 'Save to your realm',
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);
    try {
      const url = await generateSpiritualVision(prompt);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="font-cinzel text-4xl font-black mb-4 tracking-tighter text-black dark:text-white">{texts[language].title}</h2>
        <p className="text-sm font-medium opacity-50 uppercase tracking-[0.3em]">{texts[language].subtitle}</p>
      </div>

      <div className="glass-tile p-8 rounded-[2.5rem] backdrop-blur-md mb-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity grayscale">
          <span className="text-6xl">🏛️</span>
        </div>
        
        <div className="flex flex-col space-y-4 relative z-10">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500">{texts[language].label}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={texts[language].placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-zinc-500/50 resize-none h-32 font-medium transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-black dark:bg-zinc-800 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all disabled:opacity-50 shadow-xl shadow-black/30 active:scale-[0.98]"
          >
            {loading ? texts[language].manifesting : texts[language].button}
          </button>
        </div>
      </div>

      {loading && (
        <div className="aspect-video glass-tile rounded-[2.5rem] flex flex-col items-center justify-center animate-pulse border border-white/10 space-y-6">
          <div className="relative">
            <div className="text-4xl animate-bounce grayscale">✨</div>
            <div className="absolute inset-0 bg-zinc-500/20 blur-xl rounded-full"></div>
          </div>
          <div className="text-center px-8">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{texts[language].brewing}</p>
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="space-y-6 animate-fade-in">
          <div className="relative group">
            <img 
              src={imageUrl} 
              alt="Spiritual Vision" 
              className="w-full rounded-[2.5rem] shadow-2xl border border-white/10 transition-transform duration-700 group-hover:scale-[1.01] grayscale" 
            />
            <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
          </div>
          
          <div className="flex justify-between items-center px-6 py-4 glass-tile rounded-3xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Neural Reconstruction</span>
              <p className="text-[10px] font-bold opacity-30 italic">Iconographically Verified Output</p>
            </div>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `spiritus-vision-${Date.now()}.png`;
                link.click();
              }}
              className="px-6 py-2 glass-tile rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-black hover:text-white transition-all"
            >
              {texts[language].save}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivineVisions;
