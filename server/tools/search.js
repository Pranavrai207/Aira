let search;
try {
  search = require('duckduckgo-search').search;
} catch (e) {
  console.warn('duckduckgo-search package not found. Web search will be disabled.');
}

async function webSearch(query) {
  if (!search) {
    return [{ title: 'Search Disabled', snippet: 'Please install a search package to enable this feature.', url: '#' }];
  }
  try {
    const results = await search(query, {
      safeSearch: 1, 
      time: 'y', 
    });
    return results.slice(0, 5).map(r => ({
      title: r.title,
      snippet: r.description,
      url: r.url
    }));
  } catch (error) {
    console.error('Search error:', error.message);
    return [];
  }
}

module.exports = { webSearch };
