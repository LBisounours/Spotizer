import React from 'react';
import { useOffline } from '../contexts/OfflineContext';

// ⬇️ télécharger / anneau de progression (clic = annuler) / ✓ disponible hors-ligne (clic = supprimer)
const DownloadButton = ({ track, className = '' }) => {
  const off = useOffline();
  if (!off || !off.supported) return null;
  const done = off.isDownloaded(track.id);
  const p = off.progress[track.id];
  const stop = (e) => e.stopPropagation();

  if (p !== undefined) {
    return (
      <button className={`dl-btn busy ${className}`} title="Annuler le téléchargement" aria-label="Annuler le téléchargement"
        onClick={(e) => { stop(e); off.cancel(track.id); }}>
        <svg viewBox="0 0 36 36" width="22" height="22">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${Math.max(4, p * 88)} 88`} transform="rotate(-90 18 18)" />
        </svg>
      </button>
    );
  }
  if (done) {
    return (
      <button className={`dl-btn done ${className}`} title="Disponible hors-ligne (cliquer pour supprimer)" aria-label="Supprimer le téléchargement"
        onClick={(e) => { stop(e); off.remove(track); }}>✓</button>
    );
  }
  return (
    <button className={`dl-btn ${className}`} title="Télécharger pour écouter hors-ligne" aria-label="Télécharger"
      onClick={(e) => { stop(e); off.download(track); }}>⬇</button>
  );
};

export default DownloadButton;
