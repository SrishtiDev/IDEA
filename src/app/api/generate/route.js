import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL,
  });

  try {
    const { techStack, theme, customTheme } = await req.json();
    
    const prompt = `Generate 4 project ideas for a developer with this tech stack: ${techStack}. 
    The theme category is: ${theme}. ${customTheme ? `Additional theme info: ${customTheme}.` : ''}
    Return exactly 4 ideas as a JSON array. Each idea must have a 'title' and a 'description'. 
    Make the descriptions concise but engaging.
    Return ONLY the JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "z-ai/glm4.7",
      messages: [{"role":"user","content": prompt}],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 2048,
    });

    const content = completion.choices[0].message.content;
    
    // Cleanup the response in case the model adds markdown code blocks
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const ideas = JSON.parse(cleanedContent);

    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
