import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import express from 'express';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // Create an Express server
  const apiServer = express();
  apiServer.use(express.json());

  // Import and use our API endpoint
  const { POST } = require('./src/api/sendEmail');
  apiServer.post('/api/sendEmail', (req, res) => POST(req, res, env.VITE_RESEND_API_KEY));

  return {
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
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Ensure this matches the Express server port
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error('Proxy error:', err);
            });
          }
        },
      },
    },
    },
    optimizeDeps: {
      exclude: ['lucide-react']
    }
  };
});
