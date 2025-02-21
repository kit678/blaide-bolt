import express from 'express';
import cors from 'cors';
import { POST } from './api/sendEmail.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const apiKey = process.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }
  try {
    _req.body.to = process.env.VITE_CONTACT_EMAIL;
    await POST(_req, res, apiKey);
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
