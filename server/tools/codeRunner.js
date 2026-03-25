const { spawn } = require('child_process');
const path = require('path');
const { isCommandSafe } = require('../security/commandGuard');
const { isPathSafe } = require('../security/pathGuard');

function executeCode(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    if (!isCommandSafe(command)) {
      return reject(new Error(`Command '${command}' is blocked for security reasons.`));
    }

    const workspace = path.resolve(process.env.AIRA_WORKSPACE || './aira-workspace');
    const cwd = options.cwd ? path.resolve(workspace, options.cwd) : workspace;

    if (!isPathSafe(cwd)) {
      return reject(new Error('Working directory must be within the workspace.'));
    }

    const process = spawn(command, args, {
      cwd,
      env: { ...process.env, AIRA_WORKSPACE: workspace }, // Sanitize further if needed
      shell: true,
      timeout: 30000 // 30s timeout
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject({ stdout, stderr, code, error: `Process exited with code ${code}` });
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { executeCode };
