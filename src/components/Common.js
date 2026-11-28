import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { useToast } from '../contexts/ToastContext';

// Petites barres animées "en cours de lecture" (style Spotify)
export const EqBars = ({ active = true }) => (
  <span className={`eq-bars ${active ? '' : 'paused'}`} aria-hidden="true">
    <i /><i /><i />
  </span>
);

// Bouton cœur (titres likés)
export const HeartButton = ({ track, variant = 'small' }) => {
  const { isLiked, toggleLike } = useLibrary();
  const { toast } = useToast();
  if (!track) return null;
  const liked = isLiked(track.id);
  return (
    <button
      type="button"
      className={`heart-btn ${variant} ${liked ? 'liked' : ''}`}
      aria-pressed={liked}
      aria-label={liked ? 'Retirer des titres likés' : 'Ajouter aux titres likés'}
      title={liked ? 'Retirer des titres likés (L)' : 'Liker ce titre (L)'}
      onClick={(e) => {
        e.stopPropagation();
        toggleLike(track.id);
        toast(liked ? `« ${track.title} » retiré des titres likés` : `« ${track.title} » ajouté aux titres likés`, liked ? '💔' : '💜');
      }}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
};
