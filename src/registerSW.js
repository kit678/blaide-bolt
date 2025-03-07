// Create this new file for service worker registration

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Different approach for dev vs production
      const swPath = import.meta.env.DEV ? '/dev-sw.js' : '/sw.js';
      
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(error => {
          console.log('SW registration failed: ', error);
        });
    });
  }
} 