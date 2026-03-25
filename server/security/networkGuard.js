function isUrlSafe(url) {
  const blockedIps = [
    '127.0.0.1',
    'localhost',
    '192.168.',
    '10.',
    '172.16.',
    '169.254.'
  ];
  
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return !blockedIps.some(ip => hostname.startsWith(ip) || hostname === ip);
  } catch (e) {
    return false;
  }
}

module.exports = { isUrlSafe };
