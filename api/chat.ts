import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, lang } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const client = new GoogleGenAI({ apiKey });

    const systemInstruction = `
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

    const chat = client.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text || '';
    
    // Clean up text
    text = text.replace(/\*/g, '');
    text = text.replace(/\n{3,}/g, '\n\n');

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
}
