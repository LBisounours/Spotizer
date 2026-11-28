import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Overlay from './components/Overlay';

// ?overlay=1 : affichage « Now Playing » pour OBS (fond transparent, sans interface)
const isOverlay = new URLSearchParams(window.location.search).has('overlay');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(isOverlay ? <Overlay /> : <App />);
