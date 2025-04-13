import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import type { ViteDevServer } from 'vite';
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
          banner(chunk) {
            if (chunk.fileName === 'sw.js') {
              return '//# sourceType=script';
            }
            return '';
          }
        }
      }
    },
    plugins: [
      react(),
      // API server configuration
      {
        name: 'configure-server',
        configureServer(server: ViteDevServer) {
          // Use middleware to serve API routes
          server.middlewares.use('/api', apiServer);
          
          // Add middleware to serve service worker files with correct MIME type
          server.middlewares.use((req, res, next) => {
            if (req.url === '/dev-sw.js' || req.url === '/sw.js') {
              const swPath = req.url === '/dev-sw.js' 
                ? path.resolve(__dirname, 'public/dev-sw.js')
                : path.resolve(__dirname, 'public/simple-sw.js');
                
              try {
                const content = fs.readFileSync(swPath, 'utf-8');
                res.setHeader('Content-Type', 'application/javascript');
                res.end(content);
              } catch (error) {
                console.error(`Error serving service worker: ${error}`);
                next();
              }
            } else {
              next();
            }
          });
        }
      },
      // Only in production: copy service worker file
      {
        name: 'copy-sw',
        apply: 'build',
        closeBundle() {
          try {
            // Copy the service worker to the dist folder
            fs.copyFileSync(
              path.resolve(__dirname, 'public/simple-sw.js'),
              path.resolve(__dirname, 'dist/sw.js')
            );
            console.log('✅ Service worker copied to dist/sw.js');
          } catch (error) {
            console.error('Error copying service worker:', error);
          }
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