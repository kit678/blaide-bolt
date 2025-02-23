import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getMode } from './utils/env';

// Service worker registration with proper configuration
if ('serviceWorker' in navigator && getMode() === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      type: 'module' // Must match workbox mode
    }).then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.error('SW registration failed:', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register the Service Worker
registerSW();