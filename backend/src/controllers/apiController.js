const OpenAI = require('openai');
const cheerio = require('cheerio');

const generateProject = async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL,
    });
    const { techStack, theme, customTheme } = req.body;
    
    const prompt = `Generate 4 project ideas for a developer with this tech stack: ${techStack}. 
    The theme category is: ${theme}. ${customTheme ? `Additional theme info: ${customTheme}.` : ''}
    Return exactly 4 ideas as a JSON array. Each idea must have a 'title' and a 'description'. 
    Make the descriptions concise but engaging.
    Return ONLY the JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [{"role":"user","content": prompt}],
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
};

const exploreProject = async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY_TRENDING,
      baseURL: process.env.NVIDIA_BASE_URL,
    });
    const { title, description, techStack } = req.body;

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

    res.json(breakdown);
  } catch (error) {
    console.error('Explore Error:', error);
    res.status(500).json({ error: 'Failed to generate project breakdown' });
  }
};

const getTrending = async (req, res) => {
  try {
    const response = await fetch('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const repos = [];

    $('article.Box-row').each((i, el) => {
      if (repos.length >= 12) return false;

      const $el = $(el);
      const repoLink = $el.find('h2 a').attr('href')?.trim();
      const fullName = repoLink ? repoLink.replace(/^\//, '') : '';
      const [owner, name] = fullName.split('/').map(s => s?.trim());
      const description = $el.find('p.col-9').text().trim() || 'No description provided.';
      const language = $el.find('[itemprop="programmingLanguage"]').text().trim() || 'Unknown';
      const starsText = $el.find('a[href$="/stargazers"]').first().text().trim().replace(/,/g, '');
      const stars = parseInt(starsText, 10) || 0;
      const forksText = $el.find('a[href$="/forks"]').first().text().trim().replace(/,/g, '');
      const forks = parseInt(forksText, 10) || 0;
      const todayText = $el.find('span.d-inline-block.float-sm-right').text().trim();
      const starsToday = todayText || '';

      if (owner && name) {
        repos.push({ owner, name, fullName, description, language, stars, forks, starsToday, url: `https://github.com/${fullName}` });
      }
    });

    res.json(repos);
  } catch (error) {
    console.error('Trending scrape error:', error);
    res.status(500).json({ error: 'Failed to fetch trending repos' });
  }
};

module.exports = {
  generateProject,
  exploreProject,
  getTrending
};
