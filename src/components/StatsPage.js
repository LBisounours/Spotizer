import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMusic } from '../contexts/MusicContext';
import { dayKey, splitArtists } from '../utils';const StatsPage = ({ musicDatabase, onPlayTrack }) => {
const { isDarkMode, currentTheme } = useTheme();
const { 
listeningHistory, 
playStats, 
listeningTime, 
getTopTracks, 
getTopGenres,
formatListeningTime 
} = useMusic();const topTracks = getTopTracks(musicDatabase, 10);
const topGenres = getTopGenres(musicDatabase, 5);
const totalPlays = Object.values(playStats).reduce((a, b) => a + b, 0);
const maxPlays = topTracks.length > 0 ? topTracks[0].playCount : 1;
const maxGenreCount = topGenres.length > 0 ? topGenres[0].count : 1;
const artistCounts = {};
Object.entries(playStats).forEach(([id, count]) => {
const t = musicDatabase.find(x => x.id === parseInt(id));
if (t) { const a = splitArtists(t.artist)[0] || t.artist; artistCounts[a] = (artistCounts[a] || 0) + count; }
});
const topArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
const maxArtist = topArtists.length ? topArtists[0][1] : 1;
const daily = listeningTime.daily || {};
const last7 = Array.from({ length: 7 }, (_, i) => {
const d = new Date(Date.now() - (6 - i) * 86400000);
return { key: dayKey(d), label: d.toLocaleDateString('fr-FR', { weekday: 'short' }), secs: daily[dayKey(d)] || 0 };
});
const maxDay = Math.max(60, ...last7.map(d => d.secs));
let streak = 0;
for (let i = daily[dayKey()] ? 0 : 1; i < 400; i++) {
if (daily[dayKey(new Date(Date.now() - i * 86400000))] > 0) streak++; else break;
}
const distinctTracks = Object.keys(playStats).length;return (
<div className={`stats-page ${isDarkMode ? 'dark' : 'light'}`}>
<h1 className="page-title">📊 Mes Statistiques</h1>{}
<div className="stats-time-cards">
<div className="stat-card" style={{ borderColor: currentTheme.primary }}>
<span className="stat-icon">📅</span>
<div className="stat-content">
<span className="stat-value">{formatListeningTime(listeningTime.weekly)}</span>
<span className="stat-label">Cette semaine</span>
</div>
</div>
<div className="stat-card" style={{ borderColor: currentTheme.primary }}>
<span className="stat-icon">📆</span>
<div className="stat-content">
<span className="stat-value">{formatListeningTime(listeningTime.monthly)}</span>
<span className="stat-label">Ce mois</span>
</div>
</div>
<div className="stat-card" style={{ borderColor: currentTheme.primary }}>
<span className="stat-icon">🗓️</span>
<div className="stat-content">
<span className="stat-value">{formatListeningTime(listeningTime.yearly)}</span>
<span className="stat-label">Cette année</span>
</div>
</div>
<div className="stat-card" style={{ borderColor: currentTheme.primary }}>
<span className="stat-icon">🎵</span>
<div className="stat-content">
<span className="stat-value">{totalPlays}</span>
<span className="stat-label">Écoutes totales</span>
</div>
</div>
</div><div className="stats-grid">
{}
<div className="stats-section">
<h2 className="section-title">🏆 Top 10 Musiques</h2>
{topTracks.length === 0 ? (
<p className="no-stats">Écoutez de la musique pour voir vos statistiques !</p>
) : (
<div className="top-tracks-list">
{topTracks.map((track, index) => (
<div 
key={track.id} 
className="top-track-item"
onClick={() => onPlayTrack(track)}
>
<span className="track-rank" style={{ 
background: index < 10 ? currentTheme.gradient : 'rgba(255,255,255,0.1)' 
}}>
{index + 1}
</span>
<img src={track.cover} alt={track.title} className="track-cover" />
<div className="track-info">
<span className="track-title">{track.title}</span>
<span className="track-artist">{track.artist}</span>
</div>
<div className="track-stats">
<div 
className="play-bar"
style={{ 
width: `${(track.playCount / maxPlays) * 100}%`,
background: currentTheme.gradient
}}
/>
<span className="play-count">{track.playCount} écoutes</span>
</div>
</div>
))}
</div>
)}
</div>{}
<div className="stats-section">
<h2 className="section-title">🎸 Top Genres</h2>
{topGenres.length === 0 ? (
<p className="no-stats">Pas encore de données de genres.</p>
) : (
<div className="top-genres-list" >
{topGenres.map((item, index) => (
<div key={item.genre} className="genre-item" >
<div className="genre-info">
<span className="genre-rank">{index + 1}</span>
<span className="genre-name">{item.genre || 'Non défini'}</span>
</div>
<div className="genre-bar-container">
<div 
className="genre-bar"
style={{ 
width: `${(item.count / maxGenreCount) * 100}%`,
background: currentTheme.gradient
}}
/>
</div>
<span className="genre-count">{item.count} écoutes</span>
</div>
))}
</div>
)}
</div>
</div>{}
<div className="stats-grid">
<div className="stats-section">
<h2 className="section-title">🎤 Top Artistes</h2>
{topArtists.length === 0 ? (
<p className="no-stats">Pas encore de données d'artistes.</p>
) : (
<div className="top-genres-list">
{topArtists.map(([name, count], index) => (
<div key={name} className="genre-item">
<div className="genre-info">
<span className="genre-rank">{index + 1}</span>
<span className="genre-name">{name}</span>
</div>
<div className="genre-bar-container">
<div className="genre-bar" style={{ width: `${(count / maxArtist) * 100}%`, background: currentTheme.gradient }} />
</div>
<span className="genre-count">{count} écoutes</span>
</div>
))}
</div>
)}
</div>
<div className="stats-section">
<h2 className="section-title">📈 7 derniers jours</h2>
<div className="week-chart" role="img" aria-label="Temps d'écoute des 7 derniers jours">
{last7.map(d => (
<div key={d.key} className="week-col" title={`${Math.round(d.secs / 60)} min`}>
<div className="week-bar-wrap">
<div className="week-bar" style={{ height: `${Math.max(d.secs ? 6 : 0, (d.secs / maxDay) * 100)}%`, background: currentTheme.gradient }} />
</div>
<span>{d.label}</span>
</div>
))}
</div>
<p className="stats-streak">🔥 Série : <strong>{streak}</strong> jour{streak > 1 ? 's' : ''} d'affilée • 🎼 <strong>{distinctTracks}</strong> titres différents écoutés • ⏱️ Total : <strong>{formatListeningTime(listeningTime.total || 0)}</strong></p>
</div>
</div><div className="stats-section full-width">
<h2 className="section-title">📜 Historique récent</h2>
{listeningHistory.length === 0 ? (
<p className="no-stats">Aucune musique écoutée récemment.</p>
) : (
<div className="history-list" >
{listeningHistory.slice(0, 20).map((entry, index) => (
<div 
key={entry.playId} 
className="history-item " style={{ background: currentTheme.gradient }}
onClick={() => onPlayTrack(entry)}
>
<img src={entry.cover} alt={entry.title} className="history-cover" />
<div className="history-info">
<span className="history-title">{entry.title}</span>
<span className="history-artist">{entry.artist}</span>
</div>
<div className="history-time">
<span>{new Date(entry.playedAt).toLocaleDateString('fr-FR')}</span>
<span>{new Date(entry.playedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
</div>
</div>
))}
</div>
)}
</div>
</div>
);
};export default StatsPage;
