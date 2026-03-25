const { chromium } = require('playwright');
const cheerio = require('cheerio');
const { isUrlSafe } = require('../security/networkGuard');

async function webScrape(url) {
  if (!isUrlSafe(url)) {
    throw new Error('Access to local network or blocked IPs is forbidden.');
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Remove scripts and styles
    $('script, style, nav, footer, header').remove();
    
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    const title = $('title').text();
    
    return {
      title,
      url,
      content: text.slice(0, 10000) // Truncate for LLM
    };
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { webScrape };
