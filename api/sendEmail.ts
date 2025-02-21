import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Request, Response } from 'express';
import { POST } from '../src/api/sendEmail';
import { config } from '../src/config/environment';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Convert VercelRequest to Express Request
  const expressReq = {
    ...req,
    get: (name: string) => req.headers[name],
    header: (name: string) => req.headers[name],
    accepts: () => true,
    acceptsCharsets: () => true,
  } as unknown as Request;

  // Convert VercelResponse to Express Response
  const expressRes = {
    ...res,
    sendStatus: (statusCode: number) => res.status(statusCode).send(''),
    links: () => res,
    jsonp: (body: any) => res.json(body),
    sendFile: () => res,
  } as unknown as Response;
  const apiKey = config.emailService.resendApiKey;
  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }
  req.body.to = config.emailService.adminEmail;
  return POST(expressReq, expressRes, apiKey);
}