import { getEnv, getMode } from '../utils/env';

const getEnvironmentConfig = () => {
  const isDev = getMode() !== 'production';
  return {
    apiBaseUrl: isDev ? 'http://localhost:3001' : '/api',
    emailService: {
      from: 'Blaide <noreply@blaidelabs.com>',
      adminEmail: getEnv('VITE_CONTACT_EMAIL'),
      resendApiKey: getEnv('VITE_RESEND_API_KEY')
    }
  };
};

export const config = getEnvironmentConfig();