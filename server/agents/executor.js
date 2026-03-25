const { webSearch } = require('../tools/search');
const { webScrape } = require('../tools/scraper');
const { executeCode } = require('../tools/codeRunner');
const { createFile, readFile } = require('../tools/fileManager');

async function executeStep(step) {
  const { tool, args } = step;
  console.log(`Executing tool: ${tool} with args:`, args);

  switch (tool) {
    case 'web_search':
      return await webSearch(args);
    case 'web_scrape':
      return await webScrape(args);
    case 'execute_code':
      const cmdParts = args.split(' ');
      return await executeCode(cmdParts[0], cmdParts.slice(1));
    case 'create_file':
      return await createFile(args.path, args.content);
    case 'read_file':
      return await readFile(args.path);
    default:
      return { error: `Unknown tool: ${tool}` };
  }
}

module.exports = { executeStep };
