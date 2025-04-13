// Service worker registration file
// This provides a simpler approach than the PWA plugin

export function registerServiceWorker(): void {
  // In development mode, we'll skip service worker registration
  // to avoid MIME type errors and unnecessary complications
  if (import.meta.env.DEV) {
    console.log('Service worker registration skipped in development mode');
    return;
  }
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Only use sw.js in production
      const swPath = '/sw.js';
      
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(error => {
          console.error('SW registration failed: ', error);
        });
    });
  }
} 