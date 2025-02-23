import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);