import express from 'express';
import { POST } from './api/sendEmail';
import { loadEnv } from 'vite';

const app = express();
app.use(express.json());

const env = loadEnv('development', process.cwd(), 'VITE_');

app.post('/sendEmail', (req, res) => POST(req, res, env.VITE_RESEND_API_KEY));

const PORT = 3001; // Port for test server
app.listen(PORT, () => {
  console.log(`Test Express server running on port ${PORT}`);
});
