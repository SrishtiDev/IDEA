import OpenAI from 'openai';

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY_TRENDING,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    const { title, description, techStack } = await req.json();

    const prompt = `You are a senior software architect. A developer wants to build this project:

**Title:** ${title}
**Description:** ${description}
**Developer's Tech Stack:** ${techStack}

Provide a detailed project breakdown in this exact JSON format:
{
  "title": "${title}",
  "overview": "A 2-3 sentence expanded overview of the project",
  "techStack": [
    { "name": "Technology Name", "role": "What it's used for in this project", "icon": "appropriate material symbol name" }
  ],
  "features": [
    { "title": "Feature name", "description": "Brief description" }
  ],
  "architecture": "A paragraph describing the high-level architecture and how components connect",
  "steps": [
    { "phase": "Phase name", "title": "Step title", "description": "What to do in this step", "tasks": ["task1", "task2", "task3"] }
  ],
  "estimatedTime": "Estimated development time",
  "difficulty": "Beginner/Intermediate/Advanced"
}

Include 4-6 tech stack items, 4-6 features, and 4-5 implementation phases.
Return ONLY valid JSON, no markdown.`;

    const completion = await openai.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 4096,
    });

    const content = completion.choices[0].message.content;
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const breakdown = JSON.parse(cleanedContent);

    return Response.json(breakdown);
  } catch (error) {
    console.error('Explore Error:', error);
    return Response.json({ error: 'Failed to generate project breakdown' }, { status: 500 });
  }
}
