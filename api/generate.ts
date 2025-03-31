export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req: Request) {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
  
    const { prompt } = await req.json();
  
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });
    }
  
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
  
    return new Response(JSON.stringify({ story }), { status: 200 });
  }
  