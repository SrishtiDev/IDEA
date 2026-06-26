import OpenAI from 'openai';

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    const { techStack, theme, customTheme } = await req.json();
    
    const prompt = `Generate 4 project ideas for a developer with this tech stack: ${techStack}. 
    The theme category is: ${theme}. ${customTheme ? `Additional theme info: ${customTheme}.` : ''}
    Return exactly 4 ideas as a JSON array. Each idea must have a 'title' and a 'description'. 
    Make the descriptions concise but engaging.
    Return ONLY the JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{"role":"user","content": prompt}],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 2048,
    });

    const content = completion.choices[0].message.content;
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const ideas = JSON.parse(cleanedContent);

    return Response.json(ideas);
  } catch (error) {
    console.error('Generation Error:', error);
    return Response.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
