import { jwtDecode } from 'jwt-decode';

// Decoding supplies display state only; the API verifies JWT signatures.
export function decodeSession(tokens, { allowExpired = false } = {}) {
  if (!tokens || typeof tokens.access !== 'string' ||
      typeof tokens.refresh !== 'string' || !tokens.refresh.trim()) {
    throw new Error('Missing session tokens');
  }
  const user = jwtDecode(tokens.access);
  if (!user || typeof user !== 'object' || !Number.isFinite(user.exp) || (!allowExpired && user.exp * 1000 <= Date.now())) {
    throw new Error('Invalid or expired access token');
  }
  return user;
}

export function removeStoredSession() {
  try { localStorage.removeItem('authTokens'); } catch { /* Storage may be blocked. */ }
}

export function restoreSession(options) {
  try {
    const stored = localStorage.getItem('authTokens');
    if (!stored) return null;
    const tokens = JSON.parse(stored);
    decodeSession(tokens, options);
    return tokens;
  } catch {
    removeStoredSession();
    return null;
  }
}
