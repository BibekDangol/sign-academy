export function safeReturnPath(from) {
  const path = typeof from === 'string' ? from : from && `${from.pathname || ''}${from.search || ''}${from.hash || ''}`;
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\') ||
      [...path].some(character => character.charCodeAt(0) <= 32)) return '/';
  if (['/login', '/register'].includes(path.split(/[?#]/)[0])) return '/';
  return path;
}
