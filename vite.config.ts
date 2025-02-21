import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import express from 'express';
import cors from 'cors';
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import type { NextFunction } from 'express';
import { POST as sendEmailPOST } from './src/api/sendEmail.js';
import dotenv from 'dotenv';
import { getEnvironmentConfig } from './src/config/environment.ts';

export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    dotenv.config({ path: '.env.production' });
  }

  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  const config = getEnvironmentConfig();

  const apiServer = express();
  apiServer.use(cors());
  apiServer.use(express.json());

  apiServer.post('/api/sendEmail', async (req, res) => {
    const apiKey = config.emailService.resendApiKey;
    if (!apiKey) {
      return res.status(500).json({ error: 'Resend API key not configured' });
    }
    try {
      req.body.to = config.emailService.adminEmail;
      await sendEmailPOST(req, res, apiKey);
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  return {
    build: {
      target: 'esnext',
      outDir: 'dist',
      rollupOptions: {
        output: {
          format: 'esm'
        }
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Blaide - AI-Driven Innovation',
          short_name: 'Blaide',
          description: 'AI-driven holding company pioneering the future of technology',
          theme_color: '#1a1a2e',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
          swDest: 'dist/sw.js',
          clientsClaim: true,
          skipWaiting: true,
        },
      }),
      {
        name: 'configure-server',
        configureServer(server: ViteDevServer) {
          server.middlewares.use('/api', apiServer);
        }
      }
    ],
    server: {
      port: 5173,
      strictPort: true
    },
    optimizeDeps: {
      exclude: ['lucide-react']
    },
    define: {
      'process.env.MODE': JSON.stringify(mode),
    },
  };
});