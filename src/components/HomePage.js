import React, { useMemo, useState } from 'react';
import TrackCard from './TrackCard';
import { useMusic } from '../contexts/MusicContext';
import { useLibrary } from '../contexts/LibraryContext';
import { greeting, MOODS, moodTracks, primaryArtist } from '../utils';

const Row = ({ title, onSeeAll, children }) => (
  <div className="section">
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {onSeeAll && <button className="see-all-btn" onClick={onSeeAll}>Tout voir ›</button>}
    </div>
    <div className="hscroll">{children}</div>
  </div>
);

const HomePage = ({
  musicDatabase, currentTrack, isPlaying, currentTheme,
  onPlay, onPlayAll, onShuffleAll, onAddToPlaylist, onAddToQueue, onContextMenu,
  onOpenArtist, onOpenMood, onOpenGenre, onOpenLiked, onOpenLibrary
}) => {
  const { listeningHistory, getRecommendations, getTopArtists } = useMusic();
  const { likedIds } = useLibrary();
  const [surpriseSeed, setSurpriseSeed] = useState(0);

  // Calculé une fois à l'ouverture (la recommandation contient de l'aléatoire)
  const recommended = useMemo(
    () => getRecommendations(musicDatabase, currentTrack, 12),
    [musicDatabase]
  );

  const recent = useMemo(() => {
    const seen = new Set();
    const out = [];
    listeningHistory.forEach((h) => {
      if (seen.has(h.id)) return;
      seen.add(h.id);
      const t = musicDatabase.find((x) => x.id === h.id);
      if (t) out.push(t);
    });
    return out.slice(0, 12);
  }, [listeningHistory, musicDatabase]);

  const favArtists = useMemo(
    () => getTopArtists(musicDatabase, 8).map((name) => ({
      name,
      cover: musicDatabase.find((t) => t.artist === name)?.cover
    })),
    [getTopArtists, musicDatabase]
  );

  const liked = useMemo(
    () => likedIds.map((id) => musicDatabase.find((t) => t.id === id)).filter(Boolean),
    [likedIds, musicDatabase]
  );

  const sections = useMemo(() => ([
    {
      title: 'Rock & Alternative', genre: 'Rock',
      tracks: musicDatabase.filter((t) => ['Rock', 'Indie Rock', 'Pop Rock', 'Alternative Rock', 'Alternative', 'Indie', 'Metal'].includes(t.genre))
    },
    {
      title: 'Rap & Pop', genre: 'Rap',
      tracks: musicDatabase.filter((t) => ['Pop', 'Rap', 'Pop Rap'].includes(t.genre))
    },
    {
      title: 'Anime & Film', genre: 'Opening',
      tracks: musicDatabase.filter((t) => ['Opening', 'Film', 'OST'].includes(t.genre))
    }
  ]), [musicDatabase]);

  const surprise = () => {
    const t = musicDatabase[Math.floor(Math.random() * musicDatabase.length)];
    setSurpriseSeed((n) => n + 1);
    onPlay(t, musicDatabase);
  };

  const card = (track, list) => (
    <TrackCard
      key={track.id}
      track={track}
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      currentTheme={currentTheme}
      onPlay={(t) => onPlay(t, list)}
      onAddToPlaylist={onAddToPlaylist}
      onAddToQueue={onAddToQueue}
      onContextMenu={onContextMenu}
      onOpenArtist={onOpenArtist}
    />
  );

  return (
    <div className="page-container home-page" data-surprise={surpriseSeed}>
      <div className="hero-section" style={{ background: currentTheme.gradient }}>
        <p className="hero-greeting">{greeting()},</p>
        <h2 className="section-title2">
          <a href="https://twitch.tv/le_bisounours_" target="_blank" rel="noopener noreferrer"
            style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
            Le_Bisounours_
          </a>
        </h2>
        <div className="hero-actions">
          <button className="hero-btn" onClick={() => onShuffleAll(musicDatabase)}>🔀 Tout en aléatoire</button>
          <button className="hero-btn" onClick={surprise}>🎲 Surprends-moi</button>
          <button className="hero-btn" onClick={onOpenLiked}>♥ Titres likés ({liked.length})</button>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Mixes par humeur</h2>
        <div className="mood-grid">
          {MOODS.map((mood) => {
            const count = moodTracks(mood, musicDatabase).length;
            if (count === 0) return null;
            return (
              <button key={mood.id} className="mood-card" onClick={() => onOpenMood(mood.id)}
                style={{ background: currentTheme.gradient }}>
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-name">{mood.name}</span>
                <span className="mood-desc">{mood.desc} • {count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {recent.length > 0 && (
        <Row title="Écoutés récemment">{recent.map((t) => card(t, recent))}</Row>
      )}

      {favArtists.length > 0 && (
        <div className="section">
          <h2 className="section-title">Tes artistes favoris</h2>
          <div className="artist-row">
            {favArtists.map((a) => (
              <button key={a.name} className="artist-chip" onClick={() => onOpenArtist(primaryArtist(a.name))}>
                <img src={a.cover} alt="" loading="lazy" />
                <span>{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Row title="Recommandé pour toi">{recommended.map((t) => card(t, recommended))}</Row>

      {liked.length > 0 && (
        <Row title="Tes titres likés" onSeeAll={onOpenLiked}>
          {liked.slice(0, 12).map((t) => card(t, liked))}
        </Row>
      )}

      <Row title="Toute la bibliothèque" onSeeAll={onOpenLibrary}>
        {musicDatabase.slice(0, 24).map((t) => card(t, musicDatabase))}
      </Row>

      {sections.map((s) => (
        <Row key={s.title} title={s.title} onSeeAll={() => onOpenGenre(s.genre)}>
          {s.tracks.slice(0, 24).map((t) => card(t, s.tracks))}
        </Row>
      ))}
    </div>
  );
};

export default HomePage;
