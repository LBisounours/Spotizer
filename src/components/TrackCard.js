import React from 'react';
import { HeartButton, EqBars } from './Common';
import { primaryArtist } from '../utils';

const TrackCard = React.memo(({
  track, currentTrack, isPlaying, currentTheme,
  onPlay, onAddToPlaylist, onAddToQueue, onContextMenu, onOpenArtist
}) => {
  const isCurrent = currentTrack?.id === track.id;
  return (
    <div
      className={`card ${isCurrent ? 'is-current' : ''}`}
      onClick={() => onPlay(track)}
      onContextMenu={onContextMenu ? (e) => { e.preventDefault(); onContextMenu(e, track); } : undefined}
      style={{
        background: currentTheme.gradient,
        cursor: 'pointer',
        boxShadow: isCurrent && isPlaying ? `0 0 20px 10px ${currentTheme.primary}80` : 'none'
      }}
      title="Cliquer pour jouer • clic droit pour plus d'options"
    >
      <img src={track.cover} alt={track.title} className="card-image" loading="lazy" decoding="async" />
      {isCurrent && isPlaying && <div className="card-eq"><EqBars /></div>}
      <button
        className="add-to-playlist-btn"
        onClick={(e) => { e.stopPropagation(); onAddToPlaylist(track); }}
        title="Ajouter à une playlist"
        aria-label="Ajouter à une playlist"
      >
        ➕
      </button>
      <HeartButton track={track} variant="overlay" />
      <button
        className="add-to-queue-btn"
        onClick={(e) => { e.stopPropagation(); onAddToQueue(track); }}
        title="Ajouter à la file d'attente"
        aria-label="Ajouter à la file d'attente"
        style={{ background: currentTheme.primary }}
      >
        📋
      </button>
      <h3 className="card-title">{track.title}</h3>
      {onOpenArtist ? (
        <p
          className="card-subtitle link-artist"
          onClick={(e) => { e.stopPropagation(); onOpenArtist(primaryArtist(track.artist)); }}
        >
          {track.artist}
        </p>
      ) : (
        <p className="card-subtitle">{track.artist}</p>
      )}
      <p className="card-info">{track.genre} • {track.duration}</p>
    </div>
  );
});

export default TrackCard;
