import React, { useMemo, useState } from 'react';
import TrackRow from './TrackRow';
import TrackCard from './TrackCard';
import { useLibrary } from '../contexts/LibraryContext';
import { normalize, parseDuration, formatTotal } from '../utils';

const SORTS = [
  { id: 'default', label: 'Ordre d\'origine' },
  { id: 'title', label: 'Titre (A → Z)' },
  { id: 'artist', label: 'Artiste (A → Z)' },
  { id: 'genre', label: 'Genre' },
  { id: 'duration-asc', label: 'Durée (courte → longue)' },
  { id: 'duration-desc', label: 'Durée (longue → courte)' }
];

// Vue générique d'une liste de titres : en-tête, lecture, tri, filtre, chips de genres, liste/grille
const CollectionView = ({
  title, subtitle, emoji, tracks, emptyMessage, showGenreChips = false,
  currentTrack, isPlaying, currentTheme,
  onPlay, onPlayAll, onShuffleAll, onAddToPlaylist, onAddToQueue, onContextMenu, onOpenArtist, onOpenGenre,
  onBack
}) => {
  const { settings, updateSetting } = useLibrary();
  const [sort, setSort] = useState('default');
  const [filter, setFilter] = useState('');
  const [genre, setGenre] = useState(null);

  const genres = useMemo(() => {
    const counts = {};
    tracks.forEach((t) => { if (t.genre) counts[t.genre] = (counts[t.genre] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [tracks]);

  const visible = useMemo(() => {
    let list = tracks;
    if (genre) list = list.filter((t) => t.genre === genre);
    const tokens = normalize(filter).split(/\s+/).filter(Boolean);
    if (tokens.length) {
      list = list.filter((t) => {
        const hay = normalize(`${t.title} ${t.artist} ${t.genre}`);
        return tokens.every((tok) => hay.includes(tok));
      });
    }
    const sorted = [...list];
    switch (sort) {
      case 'title': sorted.sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })); break;
      case 'artist': sorted.sort((a, b) => a.artist.trim().localeCompare(b.artist.trim(), 'fr', { sensitivity: 'base' })); break;
      case 'genre': sorted.sort((a, b) => (a.genre || '').localeCompare(b.genre || '', 'fr', { sensitivity: 'base' })); break;
      case 'duration-asc': sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration)); break;
      case 'duration-desc': sorted.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration)); break;
      default: break;
    }
    return sorted;
  }, [tracks, genre, filter, sort]);

  const totalSeconds = useMemo(
    () => visible.reduce((sum, t) => sum + parseDuration(t.duration), 0),
    [visible]
  );

  const collage = tracks.slice(0, 4);
  const viewMode = settings.viewMode === 'grid' ? 'grid' : 'list';

  return (
    <div className="collection-view">
      {onBack && (
        <button className="back-btn" onClick={onBack}>← Retour</button>
      )}
      <div className="collection-header">
        <div className="collection-cover" style={{ background: currentTheme.gradient }}>
          {collage.length >= 4 ? (
            collage.map((t) => <img key={t.id} src={t.cover} alt="" />)
          ) : collage.length > 0 ? (
            <img className="single" src={collage[0].cover} alt="" />
          ) : (
            <span className="collection-emoji">{emoji || '🎵'}</span>
          )}
        </div>
        <div className="collection-meta">
          <p className="playlist-type">{subtitle || 'Collection'}</p>
          <h1 className="playlist-title-large">{emoji ? `${emoji} ` : ''}{title}</h1>
          <p className="playlist-stats">
            {visible.length} titre{visible.length > 1 ? 's' : ''}
            {visible.length > 0 ? ` • ${formatTotal(totalSeconds)}` : ''}
          </p>
          <div className="playlist-actions">
            <button
              className="play-playlist-btn"
              onClick={() => onPlayAll(visible)}
              disabled={visible.length === 0}
              style={{ background: currentTheme.primary }}
            >
              ▶️ Lecture
            </button>
            <button
              className="shuffle-playlist-btn"
              onClick={() => onShuffleAll(visible)}
              disabled={visible.length === 0}
              style={{ background: currentTheme.gradient }}
            >
              🔀 Aléatoire
            </button>
          </div>
        </div>
      </div>

      <div className="collection-toolbar">
        <input
          type="search"
          className="form-input collection-filter"
          placeholder="Filtrer dans cette liste..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filtrer dans cette liste"
        />
        <select
          className="form-input collection-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Trier"
        >
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <div className="view-toggle" role="group" aria-label="Affichage">
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => updateSetting('viewMode', 'list')}
            title="Affichage en liste"
            aria-label="Affichage en liste"
          >
            ☰
          </button>
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => updateSetting('viewMode', 'grid')}
            title="Affichage en grille"
            aria-label="Affichage en grille"
          >
            ▦
          </button>
        </div>
      </div>

      {showGenreChips && genres.length > 1 && (
        <div className="chip-row">
          <button className={`chip ${genre === null ? 'active' : ''}`} onClick={() => setGenre(null)}>Tous</button>
          {genres.map(([g, count]) => (
            <button
              key={g}
              className={`chip ${genre === g ? 'active' : ''}`}
              onClick={() => setGenre(genre === g ? null : g)}
            >
              {g} <small>{count}</small>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty-state">
          <p>{tracks.length === 0 ? (emptyMessage || 'Rien ici pour le moment.') : 'Aucun titre ne correspond au filtre.'}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-6">
          {visible.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTheme={currentTheme}
              onPlay={(t) => onPlay(t, visible)}
              onAddToPlaylist={onAddToPlaylist}
              onAddToQueue={onAddToQueue}
              onContextMenu={onContextMenu}
              onOpenArtist={onOpenArtist}
            />
          ))}
        </div>
      ) : (
        <div className="track-list">
          {visible.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              isCurrent={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              currentTheme={currentTheme}
              onPlay={(t) => onPlay(t, visible)}
              onAddToPlaylist={onAddToPlaylist}
              onAddToQueue={onAddToQueue}
              onContextMenu={onContextMenu}
              onOpenArtist={onOpenArtist}
              onOpenGenre={onOpenGenre}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionView;
