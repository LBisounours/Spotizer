import React, { useState } from 'react';

const MAIN = [
  { id: 'home', icon: '🏠', label: 'Accueil' },
  { id: 'search', icon: '🔍', label: 'Recherche' },
  { id: 'library', icon: '📚', label: 'Biblio' },
  { id: 'liked', icon: '💜', label: 'Likés' }
];
const MORE = [
  { id: 'downloads', icon: '⬇️', label: 'Téléchargements' },
  { id: 'blindtest', icon: '🎯', label: 'Blind test' },
  { id: 'soundboard', icon: '🔊', label: 'SoundBoard' },
  { id: 'stats', icon: '📊', label: 'Statistiques' },
  { id: 'history', icon: '📜', label: 'Historique' },
  { id: 'settings', icon: '⚙️', label: 'Réglages' }
];

// Navigation du bas (mobile uniquement, via CSS) + feuille « Plus »
const BottomNav = ({ page, onNav, theme, offline }) => {
  const [more, setMore] = useState(false);
  const moreActive = MORE.some((m) => m.id === page);
  const go = (id) => { setMore(false); onNav(id); };
  return (
    <>
      {more && (
        <div className="sheet-backdrop" onClick={() => setMore(false)}>
          <div className="more-sheet" onClick={(e) => e.stopPropagation()} role="menu">
            <div className="sheet-grip" />
            {MORE.map((m) => (
              <button key={m.id} className={`more-item ${page === m.id ? 'active' : ''}`} onClick={() => go(m.id)}>
                <span>{m.icon}</span>{m.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <nav className={`bottom-nav${offline ? ' is-offline' : ''}`} aria-label="Navigation">
        {MAIN.map((m) => (
          <button key={m.id} className={page === m.id ? 'active' : ''} onClick={() => go(m.id)}
            style={page === m.id ? { color: theme.accent } : undefined}>
            <span>{m.icon}</span><small>{m.label}</small>
          </button>
        ))}
        <button className={moreActive || more ? 'active' : ''} onClick={() => setMore((v) => !v)}
          style={moreActive || more ? { color: theme.accent } : undefined}>
          <span>☰</span><small>Plus</small>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
