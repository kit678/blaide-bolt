export const getEnv = (key: string): string => {
  // Use import.meta.env in the browser (client-side)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
  }

  // Fallback to process.env for server-side
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export function getMode(): string {
  // Try to get the mode from Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.MODE || 'development';
  }

  // Fallback to Node.js process.env
  return process.env.NODE_ENV || 'development';
} 