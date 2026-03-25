const BLOCKED_PATTERNS = [
  /rm\s+-rf\s+\//,
  /sudo/,
  /chmod\s+777/,
  />\s*\/etc/,
  /curl.*\|\s*bash/,
  /eval\s*\(/,
  /process\.env\.(?!AIRA)/,
  /require\(['"]\.\.?\//,
];

function isCommandSafe(command) {
  return !BLOCKED_PATTERNS.some(pattern => pattern.test(command));
}

module.exports = { isCommandSafe };
