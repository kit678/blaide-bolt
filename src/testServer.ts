import express from 'express';
import cors from 'cors';
import { POST as sendEmailPOST } from './api/sendEmail.local.ts';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEnvironmentConfig } from './config/environment.ts';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/sendEmail', async (_req, res) => {
  const config = getEnvironmentConfig();
  const apiKey = config.emailService.resendApiKey;
  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }
  try {
    _req.body.to = config.emailService.adminEmail;
    await sendEmailPOST(_req, res, apiKey);
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Add your routes here
app.get('/', (_req, res) => {
  res.send('Test server is running');
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
