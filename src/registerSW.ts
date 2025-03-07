// Service worker registration file
// This provides a simpler approach than the PWA plugin

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Different approach for dev vs production
      const swPath = import.meta.env.DEV ? '/dev-sw.js' : '/sw.js';
      
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