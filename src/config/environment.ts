import { getEnv, getMode } from '../utils/env.js';

function buildConfig() {
  const isDev = getMode() !== 'production';
  return {
    apiBaseUrl: isDev ? 'http://localhost:3001' : '/api',
    emailService: {
      from: getEnv('VITE_CONTACT_EMAIL'),
      adminEmail: getEnv('VITE_ADMIN_EMAIL'),
      resendApiKey: getEnv('VITE_RESEND_API_KEY')
    }
  };
}

export function getEnvironmentConfig() {
  return buildConfig();
}