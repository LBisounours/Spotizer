import React, { useMemo, useState } from 'react';
import TrackRow from './TrackRow';
import { useLibrary } from '../contexts/LibraryContext';
import { normalize, splitArtists, primaryArtist } from '../utils';

const GENRES = ['Rap', 'Pop', 'Rock', 'Electro', 'Alternative', 'Opening', 'Film', 'Théâtre', 'Remix', 'IA', 'Metal', 'Indie', 'Folk', 'J-Pop'];
const TABS = [
  { id: 'all', label: 'Tout' },
  { id: 'title', label: 'Titres' },
  { id: 'artist', label: 'Artistes' },
  { id: 'genre', label: 'Genres' }
];

const SearchPage = ({
  musicDatabase, query, onQuery, currentTrack, isPlaying, currentTheme,
  onPlay, onShuffleAll, onAddToPlaylist, onAddToQueue, onContextMenu, onOpenArtist, onOpenGenre
}) => {
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useLibrary();
  const [tab, setTab] = useState('all');

  const tokens = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);

  const results = useMemo(() => {
    if (!tokens.length) return [];
    return musicDatabase.filter((t) => {
      const fields = {
        all: `${t.title} ${t.artist} ${t.album} ${t.genre}`,
        title: t.title,
        artist: t.artist,
        genre: t.genre
      }[tab];
      const hay = normalize(fields);
      return tokens.every((tok) => hay.includes(tok));
    });
  }, [musicDatabase, tokens, tab]);

  // Artistes qui correspondent à la recherche
  const artists = useMemo(() => {
    if (!tokens.length || tab === 'title' || tab === 'genre') return [];
    const names = new Map();
    musicDatabase.forEach((t) => {
      splitArtists(t.artist).forEach((a) => {
        const key = normalize(a);
        if (tokens.every((tok) => key.includes(tok)) && !names.has(key)) {
          names.set(key, { name: a, cover: t.cover });
        }
      });
    });
    return [...names.values()].slice(0, 8);
  }, [musicDatabase, tokens, tab]);

  const play = (track) => {
    addRecentSearch(query);
    onPlay(track, results);
  };

  if (!tokens.length) {
    return (
      <div className="page-container">
        <div className="search-empty">
          <h2 className="search-empty-title">Rechercher dans {musicDatabase.length} musiques</h2>
          <p className="search-empty-subtitle">Trouvez vos artistes, albums et titres préférés (Ctrl+K ou / pour chercher partout)</p>

          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <div className="recent-head">
                <h3 className="genres-title">Recherches récentes</h3>
                <button className="see-all-btn" onClick={clearRecentSearches}>Tout effacer</button>
              </div>
              <div className="chip-row">
                {recentSearches.map((q) => (
                  <span key={q} className="chip recent-chip">
                    <button onClick={() => onQuery(q)}>🕘 {q}</button>
                    <button className="chip-x" onClick={() => removeRecentSearch(q)} aria-label={`Supprimer ${q}`}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="genres-section">
            <h3 className="genres-title">Rechercher par genre</h3>
            <div className="genres-grid">
              {GENRES.map((g) => (
                <div key={g} className="genre-card" onClick={() => onOpenGenre(g)}
                  style={{ background: currentTheme.gradient }}>
                  <h4 className="genre-name">{g}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="search-results-header">
        <h2 className="section-title">Résultats pour « {query} » ({results.length})</h2>
        {results.length > 0 && (
          <button className="shuffle-results-btn" onClick={() => onShuffleAll(results)}
            style={{ background: currentTheme.gradient }}>
            🔀 Lecture aléatoire
          </button>
        )}
      </div>

      <div className="chip-row">
        {TABS.map((t) => (
          <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {artists.length > 0 && (
        <div className="artist-row" style={{ marginBottom: 20 }}>
          {artists.map((a) => (
            <button key={a.name} className="artist-chip" onClick={() => { addRecentSearch(query); onOpenArtist(primaryArtist(a.name)); }}>
              <img src={a.cover} alt="" loading="lazy" />
              <span>{a.name}</span>
            </button>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div className="search-empty">
          <p>Aucun résultat trouvé pour « {query} »</p>
          <p style={{ opacity: 0.7, marginTop: 8 }}>Vérifiez l'orthographe ou essayez un autre onglet.</p>
        </div>
      ) : (
        <div className="track-list">
          {results.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              isCurrent={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              currentTheme={currentTheme}
              onPlay={play}
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

export default SearchPage;
