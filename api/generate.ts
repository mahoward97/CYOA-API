export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI storyteller. Generate immersive, interactive choose-your-own-adventure story sections. Always end with 2 numbered choices.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await openaiRes.json();

    const story = data.choices?.[0]?.message?.content || 'No story generated.';

    return res.status(200).json({ story });
  } catch (err) {
    console.error('Error generating story:', err);
    return res.status(500).json({ error: 'Failed to generate story.' });
  }
}