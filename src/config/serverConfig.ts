import dotenv from 'dotenv';
import { getEnvironmentConfig } from './environment.js';
dotenv.config();

const config = getEnvironmentConfig();

export const serverConfig = {
  port: 3001,
  emailService: {
    adminEmail: config.emailService.adminEmail,
    resendApiKey: config.emailService.resendApiKey
  }
};