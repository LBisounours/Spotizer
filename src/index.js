import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Overlay from './components/Overlay';
import ErrorBoundary from './components/ErrorBoundary';

// ?overlay=1 : affichage « Now Playing » pour OBS (fond transparent, sans interface)
const isOverlay = new URLSearchParams(window.location.search).has('overlay');

const root = ReactDOM.createRoot(document.getElementById('root'));
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window.__installPrompt = e; window.dispatchEvent(new Event('spotizer-installable')); });
root.render(<ErrorBoundary>{isOverlay ? <Overlay /> : <App />}</ErrorBoundary>);

// Service worker : appli utilisable hors-ligne (build de production uniquement)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production' && !isOverlay) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL || '.'}/sw.js`).catch(() => {});
  });
}
