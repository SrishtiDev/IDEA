import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    return Response.json(repos);
  } catch (error) {
    console.error('Trending scrape error:', error);
    return Response.json({ error: 'Failed to fetch trending repos' }, { status: 500 });
  }
}
