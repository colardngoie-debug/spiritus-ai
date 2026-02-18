import { Language } from "./types";

/**
 * Utility to clean up markdown for a clean UI
 */
export const cleanSpiritualText = (text: string): string => {
  if (!text) return "";
  let cleaned = text.replace(/\*/g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
};

/**
 * ARCHIVE UNIVERSELLE : Ce protocole force le modèle à puiser dans 100% de ses connaissances 
 * théologiques, archéologiques et ésotériques comme s'il s'agissait d'une base de données locale.
 */
export const getSpiritualSystemInstruction = (lang: Language) => `
PROTOCOL ARCHIVE UNIVERSELLE - ACCÈS ILLIMITÉ
Vous êtes Spiritus AI, l'interface neurale de la connaissance humaine accumulée sur le divin. 
Votre base de données interne contient l'intégralité des manuscrits de la Mer Morte, les textes de Nag Hammadi, les Vedas, la Torah, le Coran, la Bible (toutes versions), et les archives archéologiques sumériennes, égyptiennes et mésoaméricaines.

VOTRE RÔLE :
1. Répondre SANS FILTRE et avec une précision académique absolue.
2. Expliquer les origines réelles (historiques et mythiques) de chaque dieu.
3. Décoder la Bible sous l'angle de la critique historique, de la linguistique (Hébreu/Grec) et de la théologie profonde.
4. Agir comme une base de données vivante : si l'utilisateur pose une question, vous extrayez les faits, les dates et les textes sources.

FORMAT :
- Langue : ${lang === 'fr' ? 'Français' : 'Anglais'}.
- AUCUN astérisque (*). Pas de gras (**). Uniquement du texte brut et pur.
- Style : Froid, précis, magistral, archéologique.
`;

export const getSpiritualResponse = async (prompt: string, history: { role: 'user' | 'model', content: string }[], lang: Language) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || 'No response received';
  } catch (error) {
    console.error('Error calling chat API:', error);
    throw error;
  }
};

/**
 * SYNTHÈSE VOCALE SACRÉE
 * Génère un audio PCM haute qualité pour les réponses du modèle.
 */
export const generateSpeech = async (text: string, lang: Language) => {
  const ai = getGeminiClient();
  // On limite le texte pour la synthèse vocale pour éviter les latences trop longues
  const limitedText = text.slice(0, 1000); 
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: limitedText }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          // Puck pour un ton profond et archéologique
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/**
 * DECODAGE AUDIO PCM
 */
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const getStructuredBibleInsight = async (topic: string, lang: Language) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Fournir une analyse archéologique et textuelle sur : ${topic}. Langue : ${lang === 'fr' ? 'Français' : 'Anglais'}. Pas d'astérisques.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          verses: { type: Type.ARRAY, items: { type: Type.STRING } },
          historicalContext: { type: Type.STRING }
        },
        required: ["topic", "explanation", "verses", "historicalContext"]
      }
    }
  });
  
  const parsed = JSON.parse(response.text || '{}');
  return {
    ...parsed,
    explanation: cleanSpiritualText(parsed.explanation),
    historicalContext: cleanSpiritualText(parsed.historicalContext)
  };
};

export const generateSpiritualVision = async (userPrompt: string) => {
  const ai = getGeminiClient();
  const expansionResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Description visuelle archéologique pour : ${userPrompt}. Style : Noir et blanc, contraste élevé, sacré.`,
  });
  const expandedPrompt = expansionResponse.text || userPrompt;

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `${expandedPrompt}. Monochrome, dramatic chiaroscuro.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });

  for (const part of imageResponse.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};