import dotenv from 'dotenv';
dotenv.config();

export const serverConfig = {
  port: 3001,
  emailService: {
    adminEmail: process.env.VITE_CONTACT_EMAIL,
    resendApiKey: process.env.VITE_RESEND_API_KEY
  }
};