import dotenv from 'dotenv';
import { getEnvironmentConfig } from './environment';
dotenv.config();

const config = getEnvironmentConfig();

export const serverConfig = {
  port: 3001,
  emailService: {
    adminEmail: config.emailService.adminEmail,
    resendApiKey: config.emailService.resendApiKey
  }
};