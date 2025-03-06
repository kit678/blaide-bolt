/// <reference types="vite-plugin-pwa/client" />

// Required Workbox manifest injection point
self.__WB_MANIFEST;

console.log('Custom service worker loaded');

// Add explicit type declaration to avoid module processing issues
/** @type {ServiceWorkerGlobalScope} */ 
const sw = self;

sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim());
});

// Add error handling for any potential issues
sw.addEventListener('error', (event) => {
  console.error('Service worker error:', event.message);
});