import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import express from 'express';
import cors from 'cors';
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import type { NextFunction } from 'express';
import { POST as sendEmailPOST } from './src/api/sendEmail.local.ts';
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
          format: 'esm',
          entryFileNames(chunkInfo) {
            return chunkInfo.name.includes('sw') ? '[name].js' : 'assets/[name]-[hash].js';
          }
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
              src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRhOTBlMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiA1YTMgMyAwIDEgMC01Ljk5Ny4xMjVhNCA0IDAgMCAwLTIuNTI2IDUuNzdhNCA0IDAgMCAwIC41NTYgNi41ODhBNCA0IDAgMSAwIDEyIDE4WiIvPjxwYXRoIGQ9Ik0xMiA1YTMgMyAwIDEgMSA1Ljk5Ny4xMjVhNCA0IDAgMCAxIDIuNTI2IDUuNzdhNCA0IDAgMCAxLS41NTYgNi41ODhBNCA0IDAgMSAxIDEyIDE4WiIvPjxwYXRoIGQ9Ik0xNSAxM2E0LjUgNC41IDAgMCAxLTMtNGE0LjUgNC41IDAgMCAxLTMgNG04LjU5OS02LjVhMyAzIDAgMCAwIC4zOTktMS4zNzVtLTExLjk5NSAwQTMgMyAwIDAgMCA2LjQwMSA2LjVtLTIuOTI0IDQuMzk2YTQgNCAwIDAgMSAuNTg1LS4zOTZtMTUuODc2IDBhNCA0IDAgMCAxIC41ODUuMzk2TTYgMThhNCA0IDAgMCAxLTEuOTY3LS41MTZtMTUuOTM0IDBBNCA0IDAgMCAxIDE4IDE4Ii8+PC9nPjwvc3ZnPg==',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRhOTBlMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiA1YTMgMyAwIDEgMC01Ljk5Ny4xMjVhNCA0IDAgMCAwLTIuNTI2IDUuNzdhNCA0IDAgMCAwIC41NTYgNi41ODhBNCA0IDAgMSAwIDEyIDE4WiIvPjxwYXRoIGQ9Ik0xMiA1YTMgMyAwIDEgMSA1Ljk5Ny4xMjVhNCA0IDAgMCAxIDIuNTI2IDUuNzdhNCA0IDAgMCAxLS41NTYgNi41ODhBNCA0IDAgMSAxIDEyIDE4WiIvPjxwYXRoIGQ9Ik0xNSAxM2E0LjUgNC41IDAgMCAxLTMtNGE0LjUgNC41IDAgMCAxLTMgNG04LjU5OS02LjVhMyAzIDAgMCAwIC4zOTktMS4zNzVtLTExLjk5NSAwQTMgMyAwIDAgMCA2LjQwMSA2LjVtLTIuOTI0IDQuMzk2YTQgNCAwIDAgMSAuNTg1LS4zOTZtMTUuODc2IDBhNCA0IDAgMCAxIC41ODUuMzk2TTYgMThhNCA0IDAgMCAxLTEuOTY3LS41MTZtMTUuOTM0IDBBNCA0IDAgMCAxIDE4IDE4Ii8+PC9nPjwvc3ZnPg==',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
          ],
        },
        strategies: 'generateSW',
        workbox: {
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                }
              }
            },
            {
              urlPattern: /\.(?:js|css)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources'
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html'
        }
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