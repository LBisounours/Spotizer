import React from 'react';
import { HeartButton } from './Common';
import { formatClock, primaryArtist } from '../utils';

// Lecteur plein écran : grande pochette, fond flouté, contrôles, prochains titres
const NowPlayingFull = ({
  track, isPlaying, currentTime, duration, currentTheme,
  isShuffle, repeatMode, playbackRate, upcoming,
  onClose, onToggle, onNext, onPrev, onSeek, onShuffle, onRepeat, onCycleRate, onCopy, onOpenArtist
}) => {
  if (!track) return null;
  const pct = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(((e.clientX - rect.left) / rect.width) * (duration || 0));
  };

  return (
    <div className="np-full" role="dialog" aria-label="Lecture en cours">
      <div className="np-backdrop" style={{ backgroundImage: `url("${track.cover}")` }} />
      <div className="np-overlay" />
      <button className="np-close" onClick={onClose} aria-label="Fermer" title="Fermer (Échap)">⌄</button>
      <div className="np-content">
        <img
          src={track.cover}
          alt={track.title}
          className={`np-cover ${isPlaying ? 'playing' : ''}`}
          style={{ boxShadow: `0 20px 60px ${currentTheme.primary}66` }}
        />
        <div className="np-side">
          <p className="np-label">En cours de lecture</p>
          <h1 className="np-title">{track.title}</h1>
          <p className="np-artist">
            <span className="link-artist" onClick={() => onOpenArtist(primaryArtist(track.artist))}>{track.artist}</span>
            {' • '}{track.genre}
          </p>

          <div className="np-progress">
            <span>{formatClock(currentTime)}</span>
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: currentTheme.gradient }} />
            </div>
            <span>{formatClock(duration)}</span>
          </div>

          <div className="np-controls">
            <button className={`player-btn ${isShuffle ? 'active' : ''}`} onClick={onShuffle}
              style={isShuffle ? { color: currentTheme.primary } : {}} title="Aléatoire">🔀</button>
            <button className="player-btn" onClick={onPrev} title="Précédent">⏮️</button>
            <button className="player-play-btn np-play" onClick={onToggle} title="Lecture / Pause">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="player-btn" onClick={onNext} title="Suivant">⏭️</button>
            <button className={`player-btn ${repeatMode > 0 ? 'active' : ''}`} onClick={onRepeat}
              style={repeatMode > 0 ? { color: currentTheme.primary } : {}} title="Répétition">
              {repeatMode === 2 ? '🔂' : '🔁'}
            </button>
          </div>

          <div className="np-actions">
            <HeartButton track={track} variant="large" />
            <button className="chip" onClick={onCycleRate} title="Vitesse de lecture">⏩ {playbackRate}x</button>
            <button className="chip" onClick={() => onCopy(track)} title="Copier le titre pour le chat">💬 Copier pour le chat</button>
          </div>

          {upcoming.length > 0 && (
            <div className="np-upcoming">
              <h4>À suivre</h4>
              {upcoming.slice(0, 3).map((t) => (
                <div key={t.id} className="np-up-item">
                  <img src={t.cover} alt="" />
                  <span>{t.title}</span>
                  <small>{t.artist}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NowPlayingFull;
