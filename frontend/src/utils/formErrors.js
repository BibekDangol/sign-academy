export const errorMessage = value => Array.isArray(value) ? value.join(' ') : String(value ?? '');

export function fieldErrors(data) {
  if (!data || typeof data !== 'object') return {};
  return Object.fromEntries(Object.entries(data).map(([field, value]) => [field, errorMessage(value)]));
}

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.';
}
