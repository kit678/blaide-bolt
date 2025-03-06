import { defineConfig, loadEnv, PluginOption } from 'vite';
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
import fs from 'fs';
import path from 'path';

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

  // Determine if we're in development or production mode
  const isDevelopment = mode === 'development';

  // Create the plugin for fixing service worker type
  const fixSwTypePlugin = {
    name: 'fix-sw-type',
    enforce: 'post' as const,
    apply: 'build',
    closeBundle: async () => {
      try {
        // Path to the generated service worker
        const swPath = path.resolve(__dirname, 'dist', 'sw.js');
        
        // Check if it exists
        if (fs.existsSync(swPath)) {
          // Read the content of the SW file
          let swContent = fs.readFileSync(swPath, 'utf8');
          
          // Add a classic script type pragma to the top
          if (!swContent.includes('//# sourceType=script')) {
            swContent = '//# sourceType=script\n' + swContent;
          }
          
          // Write it back
          fs.writeFileSync(swPath, swContent);
          console.log('✓ Service Worker fixed to use classic script type');
        }
      } catch (error) {
        console.error('Error fixing service worker script type:', error);
      }
    }
  };

  // Plugins array based on environment - explicitly type as PluginOption[]
  const plugins: PluginOption[] = [
    react(),
    VitePWA({
      // Use auto registration only in development
      registerType: 'prompt',
      // Don't auto-inject the service worker registration
      injectRegister: 'auto', 
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
      // Use simple config for development, full config for production
      strategies: isDevelopment ? 'injectManifest' : 'generateSW',
      workbox: {
        // Configure workbox options
        globDirectory: isDevelopment ? '.' : 'dist',
        globPatterns: isDevelopment 
          ? ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'] 
          : ['**/*.{js,css,html,png,svg,ico}'],
        clientsClaim: true,
        skipWaiting: true,
        // Add caching strategies only in production
        ...(isDevelopment ? {} : {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
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
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
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
        })
      },
      // Configure for both development and production
      devOptions: {
        enabled: true,
        type: isDevelopment ? 'module' : 'classic',
        navigateFallback: 'index.html',
        // For development mode, don't look for files that don't exist
        ...(isDevelopment ? { suppressWarnings: true } : {})
      },
      // For injectManifest mode (development)
      injectManifest: isDevelopment ? {
        swSrc: './public/sw-dev.js',
        swDest: isDevelopment ? 'dev-dist/sw.js' : 'dist/sw.js',
        injectionPoint: 'self.__WB_MANIFEST',
      } : undefined
    }),
    {
      name: 'configure-server',
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/api', apiServer);
      }
    }
  ];

  // Add production-only plugins
  if (!isDevelopment) {
    plugins.push(fixSwTypePlugin as PluginOption);
  }

  return {
    build: {
      target: 'esnext',
      outDir: 'dist',
      rollupOptions: {
        output: {
          format: 'esm',
          entryFileNames(chunkInfo) {
            return chunkInfo.name.includes('sw') ? '[name].js' : 'assets/[name]-[hash].js';
          },
          // Force SW to be a different format than ESM
          banner(chunk) {
            if (chunk.fileName === 'sw.js') {
              return '//# sourceType=script';
            }
            return '';
          }
        }
      }
    },
    plugins,
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