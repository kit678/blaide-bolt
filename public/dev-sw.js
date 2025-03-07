// Extremely minimal development service worker
// This service worker does almost nothing to avoid interfering with development
console.log('[Dev SW] Active - This service worker is for development only');

// Basic lifecycle events
self.addEventListener('install', (event) => {
  console.log('[Dev SW] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Dev SW] Activating...');
  self.clients.claim();
});

// No fetch handler in development mode
// This ensures all requests go directly to the network
// and we don't have caching issues during development 