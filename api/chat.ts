import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, lang } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Google Gemini API directly via REST
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: `PROTOCOL ARCHIVE UNIVERSELLE - ACCÈS ILLIMITÉ
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
- Style : Froid, précis, magistral, archéologique.`,
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return res.status(500).json({ error: 'Failed to get response from Gemini', details: error });
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up text
    text = text.replace(/\*/g, '');
    text = text.replace(/\n{3,}/g, '\n\n');

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to process request', details: String(error) });
  }
}
