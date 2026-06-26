export async function POST(req) {
  try {
    const { techStack, theme, customTheme } = await req.json();
    
    const prompt = `Generate 4 project ideas for a developer with this tech stack: ${techStack}. 
    The theme category is: ${theme}. ${customTheme ? `Additional theme info: ${customTheme}.` : ''}
    Return exactly 4 ideas as a JSON array. Each idea must have a 'title' and a 'description'. 
    Make the descriptions concise but engaging.
    Return ONLY the JSON array.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [{"role":"user","content": prompt}],
        temperature: 0.7,
        top_p: 1,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', response.status, response.statusText, errorText);
      return Response.json({ error: `NVIDIA API Error: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const ideas = JSON.parse(cleanedContent);

    return Response.json(ideas);
  } catch (error) {
    console.error('Generation Error:', error);
    return Response.json({ error: `Failed to generate ideas: ${error.message}` }, { status: 500 });
  }
}
