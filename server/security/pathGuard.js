const path = require('path');

function isPathSafe(targetPath) {
  const workspace = path.resolve(process.env.AIRA_WORKSPACE || './aira-workspace');
  const resolved = path.resolve(targetPath);
  return resolved.startsWith(workspace);
}

module.exports = { isPathSafe };
