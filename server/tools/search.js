const { chromium } = require('playwright');

async function webSearch(query) {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Extract results using simple DOM selection
    const results = await page.$$eval('.result', items => {
      return items.slice(0, 5).map(item => {
        const titleEl = item.querySelector('.result__title a');
        const snippetEl = item.querySelector('.result__snippet');
        return {
          title: titleEl ? titleEl.innerText : '',
          url: titleEl ? titleEl.href : '',
          snippet: snippetEl ? snippetEl.innerText : ''
        }
      });
    });

    return results;
  } catch (error) {
    console.error('Search error:', error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { webSearch };
