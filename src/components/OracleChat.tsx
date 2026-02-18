
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { getSpiritualResponse, generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

interface OracleChatProps {
  language: Language;
}

const OracleChat: React.FC<OracleChatProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const texts = {
    fr: {
      welcome: 'Exhumez les vérités enfouies sous les sables du temps.',
      placeholder: 'Chuchotez votre question...',
      error: 'Signal perdu dans l\'abysse.',
    },
    en: {
      welcome: 'Exhume the truths buried beneath the sands of time.',
      placeholder: 'Whisper your question...',
      error: 'Signal lost in the abyss.',
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const playAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const data = decodeBase64(base64Audio);
      const buffer = await decodeAudioData(data, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      setIsSpeaking(true);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getSpiritualResponse(input, messages.map(m => ({ role: m.role, content: m.content })), language);
      const modelMsg: ChatMessage = { role: 'model', content: response || '', timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
      
      if (response) {
        const audioData = await generateSpeech(response, language);
        if (audioData) {
          await playAudio(audioData);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: texts[language].error, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Zone de messages avec padding interne suffisant */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 pb-32 pr-2 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-6">
            <span className="text-5xl grayscale animate-pulse">🏺</span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto leading-loose">{texts[language].welcome}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[90%] sm:max-w-[80%] p-6 sm:p-8 rounded-[2rem] glass-tile relative border ${msg.role === 'user' ? 'bg-black text-white dark:bg-zinc-100 dark:text-black rounded-tr-none border-transparent' : 'rounded-tl-none border-white/5'}`}>
              <p className="text-sm sm:text-base leading-loose whitespace-pre-wrap font-medium">{msg.content}</p>
              {msg.role === 'model' && i === messages.length - 1 && isSpeaking && (
                <div className="absolute -bottom-3 left-6 flex space-x-1 px-4 py-1.5 bg-black/40 dark:bg-white/40 rounded-full backdrop-blur-xl">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-tile px-8 py-5 rounded-[2rem] flex items-center space-x-2 border border-white/5 shadow-inner">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Barre d'entrée flottante ancrée au bas de son conteneur */}
      <div className="absolute bottom-0 left-0 right-0 pt-10 pb-4 bg-gradient-to-t from-slate-100 dark:from-[#0f0f0f] via-transparent to-transparent">
        <div className="relative glass-tile rounded-[2rem] p-2 flex items-center shadow-2xl border border-white/10 bg-white/5 backdrop-blur-2xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={texts[language].placeholder}
            className="flex-1 bg-transparent px-6 py-4 focus:outline-none text-sm font-bold placeholder:opacity-30 uppercase tracking-widest"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-black dark:bg-zinc-100 dark:text-black rounded-full flex items-center justify-center text-white hover:scale-105 transition-all active:scale-90 disabled:opacity-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleChat;
