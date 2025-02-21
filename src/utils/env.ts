export function getEnv(key: string, defaultValue?: string): string {
  // Try to get the environment variable from Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue || '';
  }

  // Fallback to Node.js process.env
  return process.env[key] || defaultValue || '';
}

export function getMode(): string {
  // Try to get the mode from Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.MODE || 'development';
  }

  // Fallback to Node.js process.env
  return process.env.NODE_ENV || 'development';
} 