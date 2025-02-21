/// <reference types="vite-plugin-pwa/client" />

// Required Workbox manifest injection point
self.__WB_MANIFEST;

console.log('Custom service worker loaded');

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});