import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY_TRENDING,
    baseURL: process.env.NVIDIA_BASE_URL,
  });

  try {
    const prompt = `You are a tech industry analyst. List 8 trending project ideas that are currently hot in the tech market in 2025-2026. These should be real-world relevant projects that developers are building right now.

For each project, provide:
- title: A catchy project name
- description: 2-3 sentences describing what it does
- category: One of "AI", "Blockchain", "Cloud", "Cyber", "IoT", "DevOps", "Web3", "FinTech"
- techStack: A comma-separated string of 3-5 technologies commonly used
- trending: A short reason why it's trending (1 sentence)

Return ONLY a valid JSON array of 8 objects with these fields. No markdown, no extra text.`;

    const completion = await openai.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      top_p: 0.95,
      max_tokens: 4096,
    });

    const content = completion.choices[0].message.content;
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const projects = JSON.parse(cleanedContent);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Trending Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending projects' }, { status: 500 });
  }
}
