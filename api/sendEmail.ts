import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { getEnvironmentConfig } from '../src/config/environment.js';

type EmailRequestBody = {
  to: string;
  from_email: string;
  from_name: string;
  subject: string;
  message: string;
  phone?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Request received:', req.body);

  const config = getEnvironmentConfig();

  return res.status(200).json({ success: true });
}