import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { getEnvironmentConfig } from '../../src/config/environment';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const config = getEnvironmentConfig();
  const apiKey = config.emailService.resendApiKey;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }

  try {
    const resend = new Resend(apiKey);
    const body = req.body;

    // Send email logic here...

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 