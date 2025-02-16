import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import express from 'express';
import { ViteDevServer } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const apiServer = express();
  apiServer.use(express.json());

  const { POST } = require('./src/api/sendEmail');
  apiServer.post('/sendEmail', (req, res) => POST(req, res, env.VITE_RESEND_API_KEY));

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        strategies: 'injectManifest',
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
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          src: 'public/sw.js',
          swDest: 'dist/sw.js',
          mode: 'module',
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
          dontCacheBustURLsMatching: /.*/,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
        }
      })
    ],
    server: {
      port: 5173,
      strictPort: true,
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/api', apiServer);
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react']
    }
  };
});
