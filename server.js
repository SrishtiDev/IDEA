import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.post('/api/generate', async (req, res) => {
  try {
    const { techStack, theme, customTheme } = req.body;

    const prompt = `Generate 4 project ideas for a developer with this tech stack: ${techStack}. 
    The theme category is: ${theme}. ${customTheme ? `Additional theme info: ${customTheme}.` : ''}
    Return exactly 4 ideas as a JSON array. Each idea must have a 'title' and a 'description'. 
    Make the descriptions concise but engaging.
    Return ONLY the JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "z-ai/glm4.7",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 2048,
    });

    const content = completion.choices[0].message.content;
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const ideas = JSON.parse(cleanedContent);

    res.json(ideas);
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
