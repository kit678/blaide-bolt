// This is a development service worker
// It's designed to be minimal and avoid conflicts

// This will be replaced with the list of assets to precache
self.__WB_MANIFEST;

console.log('[Dev Service Worker] Loaded');

self.addEventListener('install', (event) => {
  console.log('[Dev Service Worker] Install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Dev Service Worker] Activate');
  self.clients.claim();
});

// Minimal fetch handler that doesn't interfere with development
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Passthrough all requests in development
  event.respondWith(fetch(event.request));
}); 