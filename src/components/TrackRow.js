import React from 'react';
import { HeartButton, EqBars } from './Common';
import { primaryArtist } from '../utils';

// Ligne de titre réutilisable (collections, recherche...)
const TrackRow = React.memo(({
  track, index, isCurrent, isPlaying, currentTheme,
  onPlay, onAddToPlaylist, onAddToQueue, onContextMenu, onOpenArtist, onOpenGenre
}) => (
  <div
    className={`track-item ${isCurrent ? 'is-current' : ''}`}
    onClick={() => onPlay(track)}
    onContextMenu={onContextMenu ? (e) => { e.preventDefault(); onContextMenu(e, track); } : undefined}
    style={{ cursor: 'pointer', background: currentTheme.gradient }}
    title="Cliquer pour jouer • clic droit pour plus d'options"
  >
    <div className="track-number">
      {isCurrent && isPlaying ? <EqBars /> : index + 1}
    </div>
    <button
      className="track-play-btn"
      onClick={(e) => { e.stopPropagation(); onPlay(track); }}
      aria-label={isCurrent && isPlaying ? 'Pause' : 'Lecture'}
    >
      {isCurrent && isPlaying ? '⏸️' : '▶️'}
    </button>
    <img src={track.cover} alt={track.title} className="track-cover" loading="lazy" decoding="async" />
    <div className="track-info">
      <div className="track-title">{track.title}</div>
      <div className="track-artist">
        {onOpenArtist ? (
          <span
            className="link-artist"
            onClick={(e) => { e.stopPropagation(); onOpenArtist(primaryArtist(track.artist)); }}
          >
            {track.artist}
          </span>
        ) : track.artist}
        {track.album ? ` • ${track.album}` : ''}
      </div>
    </div>
    {onOpenGenre ? (
      <div
        className="track-genre link-artist"
        onClick={(e) => { e.stopPropagation(); onOpenGenre(track.genre); }}
      >
        {track.genre}
      </div>
    ) : (
      <div className="track-genre">{track.genre}</div>
    )}
    <HeartButton track={track} />
    <button
      className="add-to-playlist-btn-small"
      onClick={(e) => { e.stopPropagation(); onAddToPlaylist(track); }}
      title="Ajouter à une playlist"
      aria-label="Ajouter à une playlist"
    >
      ➕
    </button>
    <button
      className="add-to-queue-btn-small"
      onClick={(e) => { e.stopPropagation(); onAddToQueue(track); }}
      title="Ajouter à la file d'attente"
      aria-label="Ajouter à la file d'attente"
    >
      📋
    </button>
    {onContextMenu && (
      <button
        className="add-to-queue-btn-small more-btn"
        onClick={(e) => { e.stopPropagation(); onContextMenu(e, track); }}
        title="Plus d'options"
        aria-label="Plus d'options"
      >
        ⋯
      </button>
    )}
    <div className="track-duration">{track.duration}</div>
  </div>
));

export default TrackRow;
