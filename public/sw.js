/// <reference types="vite-plugin-pwa/client" />

//# sourceType=script
/* 
 * This is a classic JavaScript file, not an ES module
 * It should be loaded with type: 'classic' in the register call
 */

// Declare the workbox injection point but handle it without importScripts
self.__WB_MANIFEST;

// Cache name constants
const CACHE_NAME = 'blaide-cache-v1';
const STATIC_CACHE_NAME = 'blaide-static-v1';
const IMAGE_CACHE_NAME = 'blaide-images-v1';
const API_CACHE_NAME = 'blaide-api-v1';

// Resources to pre-cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  // Other core assets are added by the workbox manifest
];

// Log function for debugging
const log = (message) => {
  console.log(`[Service Worker] ${message}`);
};

// Handle installation
self.addEventListener('install', (event) => {
  log('Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        log('Caching app shell and static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Handle activation
self.addEventListener('activate', (event) => {
  log('Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              log('Deleting old cache: ' + cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Handle fetch events
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip browser extension requests and cross-origin requests 
  // that aren't for assets we want to cache
  if (url.origin !== self.location.origin && 
      !url.href.includes('unsplash.com') && 
      !url.href.includes('githubusercontent.com') && 
      !url.href.includes('fonts.googleapis.com')) {
    return;
  }
  
  // Handle image requests
  if (request.destination === 'image' || 
      url.href.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Handle all other requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fetch from network
      return fetch(request).then((networkResponse) => {
        // Don't cache non-successful responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        // Cache successful responses
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        
        return networkResponse;
      });
    }).catch(() => {
      // Fallback for navigations if offline
      if (request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return null;
    })
  );
});