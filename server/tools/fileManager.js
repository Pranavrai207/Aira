const fs = require('fs-extra');
const path = require('path');
const { isPathSafe } = require('../security/pathGuard');

async function createFile(relativePath, content) {
  const workspace = path.resolve(process.env.AIRA_WORKSPACE || './aira-workspace');
  const fullPath = path.resolve(workspace, relativePath);

  if (!isPathSafe(fullPath)) {
    throw new Error('File path must be within the workspace.');
  }

  await fs.ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content);
  return { status: 'success', path: relativePath };
}

async function readFile(relativePath) {
  const workspace = path.resolve(process.env.AIRA_WORKSPACE || './aira-workspace');
  const fullPath = path.resolve(workspace, relativePath);

  if (!isPathSafe(fullPath)) {
    throw new Error('File path must be within the workspace.');
  }

  if (!(await fs.exists(fullPath))) {
    throw new Error(`File '${relativePath}' not found.`);
  }

  const content = await fs.readFile(fullPath, 'utf-8');
  return { content };
}

module.exports = { createFile, readFile };
