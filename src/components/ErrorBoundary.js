import React from 'react';

// Évite l'écran blanc : propose de recharger ou de réparer (sans effacer les playlists)
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error('Spotizer a rencontré une erreur :', error); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: '#1a0a1f', color: '#fff', padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 56 }}>🧸💥</div>
        <h1 style={{ fontSize: 22 }}>Oups, Spotizer a planté</h1>
        <p style={{ opacity: .75, maxWidth: 420 }}>Tes playlists et tes likes sont intacts. Recharge la page ; si ça recommence, utilise « Réparer » (vide uniquement la session en cours).</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 18px', borderRadius: 999, border: 0, background: '#9333ea', color: '#fff', cursor: 'pointer' }}>Recharger</button>
          <button onClick={() => { try { localStorage.removeItem('spotizer-session'); localStorage.removeItem('spotizer-now-playing'); } catch (e) { /* ignore */ } window.location.reload(); }}
            style={{ padding: '10px 18px', borderRadius: 999, border: 0, background: 'rgba(255,255,255,.15)', color: '#fff', cursor: 'pointer' }}>Réparer</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
