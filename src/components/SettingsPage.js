import React, { useEffect, useRef, useState } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLibrary } from '../contexts/LibraryContext';
import { useMusic } from '../contexts/MusicContext';
import { useToast } from '../contexts/ToastContext';
import { copyText } from '../utils';

const Switch = ({ checked, onChange, label, hint }) => (
  <label className="setting-row">
    <span className="setting-text">
      <strong>{label}</strong>
      {hint && <small>{hint}</small>}
    </span>
    <span className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-slider" />
    </span>
  </label>
);

const SettingsPage = ({ onShowShortcuts }) => {
  const { currentTheme, customColor, setCustomColor, colorTheme, setColorTheme } = useTheme();
  const { settings, updateSetting, exportAll, importAll, clearRecentSearches, likedIds } = useLibrary();
  const { resetStats, clearHistory } = useMusic();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const off = useOffline();
  const [installable, setInstallable] = useState(!!window.__installPrompt);
  useEffect(() => {
    const f = () => setInstallable(!!window.__installPrompt);
    window.addEventListener('spotizer-installable', f);
    return () => window.removeEventListener('spotizer-installable', f);
  }, []);
  const install = async () => {
    const p = window.__installPrompt; if (!p) return;
    p.prompt(); try { await p.userChoice; } catch (e) { /* ignore */ }
    window.__installPrompt = null; setInstallable(false);
  };

  const overlayUrl = `${window.location.origin}${window.location.pathname}?overlay=1`;

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const n = importAll(ev.target.result);
        toast(`${n} éléments restaurés, rechargement...`, '📥');
        setTimeout(() => window.location.reload(), 900);
      } catch (err) {
        toast('Fichier de sauvegarde invalide', '⚠️');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmThen = (message, fn) => { if (window.confirm(message)) fn(); };

  return (
    <div className="page-container settings-page">
      <h1 className="page-title">⚙️ Réglages</h1>
      <p className="page-subtitle">Personnalise Spotizer à ton goût</p>

      <div className="settings-section">
        <h2 className="section-title">🎨 Apparence</h2>
        <div className="setting-row">
          <span className="setting-text">
            <strong>Couleur personnalisée</strong>
            <small>Crée ton propre thème à partir d'une couleur</small>
          </span>
          <input
            type="color"
            className="color-picker"
            value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); setColorTheme('custom'); }}
            aria-label="Couleur personnalisée"
          />
        </div>
        {colorTheme === 'custom' && (
          <div className="setting-row">
            <span className="setting-text"><small>Thème personnalisé actif</small></span>
            <span className="theme-preview" style={{ background: currentTheme.gradient }} />
          </div>
        )}
        <Switch checked={settings.compact} onChange={(v) => updateSetting('compact', v)}
          label="Affichage compact" hint="Des listes plus denses pour voir plus de titres" />
        <Switch checked={settings.playerBackdrop} onChange={(v) => updateSetting('playerBackdrop', v)}
          label="Pochette en fond du lecteur" hint="Fond flouté aux couleurs du titre en cours" />
        <Switch checked={settings.oled} onChange={(v) => updateSetting('oled', v)}
          label="Mode OLED (noir pur)" hint="Fond 100 % noir, parfait pour économiser la batterie" />
        <Switch checked={settings.dynamicColor} onChange={(v) => updateSetting('dynamicColor', v)}
          label="Couleurs dynamiques" hint="Le lecteur prend les couleurs de la pochette en cours" />
        <Switch checked={settings.vinyl} onChange={(v) => updateSetting('vinyl', v)}
          label="Pochette vinyle" hint="La pochette tourne en plein écran pendant la lecture" />
        <Switch checked={settings.reduceMotion} onChange={(v) => updateSetting('reduceMotion', v)}
          label="Réduire les animations" hint="Pour un site plus sobre (et plus léger)" />
      </div>

      <div className="settings-section">
        <h2 className="section-title">🎧 Lecture</h2>
        <Switch checked={settings.autoplaySimilar} onChange={(v) => updateSetting('autoplaySimilar', v)}
          label="Lecture automatique" hint="Quand la file est terminée, enchaîne des titres similaires" />
        <Switch checked={settings.ducking} onChange={(v) => updateSetting('ducking', v)}
          label="Baisse automatique de la musique" hint="Pendant un son du SoundBoard, la musique baisse puis remonte" />
        {settings.ducking && (
          <div className="setting-row">
            <span className="setting-text">
              <strong>Volume de la musique pendant un son</strong>
              <small>{Math.round(settings.duckLevel * 100)} % du volume normal</small>
            </span>
            <input type="range" min="0" max="1" step="0.05" value={settings.duckLevel}
              onChange={(e) => updateSetting('duckLevel', parseFloat(e.target.value))}
              aria-label="Niveau de la baisse automatique" />
          </div>
        )}
        <Switch checked={settings.wakeLock} onChange={(v) => updateSetting('wakeLock', v)}
          label="Écran toujours allumé" hint="Empêche la veille pendant l'écoute (si le navigateur le permet)" />
        <Switch checked={settings.haptics} onChange={(v) => updateSetting('haptics', v)}
          label="Vibrations" hint="Retour tactile léger sur mobile" />
        <div className="setting-row">
          <span className="setting-text">
            <strong>Raccourcis clavier</strong>
            <small>Voir tous les raccourcis (touche ?)</small>
          </span>
          <button className="btn btn-secondary" onClick={onShowShortcuts}>⌨️ Afficher</button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">📥 Hors-ligne & application</h2>
        <Switch checked={settings.autoDownloadLikes} onChange={(v) => updateSetting('autoDownloadLikes', v)}
          label="Télécharger automatiquement mes likés" hint="Chaque titre liké devient disponible sans connexion" />
        <div className="setting-row">
          <span className="setting-text">
            <strong>Stockage protégé</strong>
            <small>Demande au navigateur de ne pas effacer tes téléchargements</small>
          </span>
          <button className="btn btn-secondary" disabled={!off.supported}
            onClick={async () => { await off.requestPersist(); toast('Demande envoyée au navigateur', '🔒'); }}>🔒 Protéger</button>
        </div>
        <div className="setting-row">
          <span className="setting-text">
            <strong>Installer Spotizer</strong>
            <small>{installable ? 'Ajoute l\'appli à ton écran d\'accueil, elle marche aussi hors-ligne' : 'Déjà installée, ou propose-le via le menu de ton navigateur (« Ajouter à l\'écran d\'accueil »)'}</small>
          </span>
          <button className="btn btn-secondary" disabled={!installable} onClick={install}>📲 Installer</button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">📺 Mode stream</h2>
        <div className="setting-row column">
          <span className="setting-text">
            <strong>Overlay « Now Playing » pour OBS</strong>
            <small>
              Dans OBS : ajoute une source « Navigateur » avec cette adresse (fond transparent). Garde Spotizer ouvert
              dans un dock navigateur OBS ou dans le même navigateur pour que le titre se mette à jour.
            </small>
          </span>
          <div className="copy-row">
            <input className="form-input" readOnly value={overlayUrl} onFocus={(e) => e.target.select()} aria-label="Adresse de l'overlay" />
            <button className="btn btn-primary" style={{ background: currentTheme.gradient }}
              onClick={async () => { await copyText(overlayUrl); toast('Adresse de l\'overlay copiée', '📋'); }}>
              Copier
            </button>
            <a className="btn btn-secondary" href={overlayUrl} target="_blank" rel="noopener noreferrer">Aperçu</a>
          </div>
        </div>
        <p className="setting-note">
          Astuce : <kbd>Échap</kbd> coupe instantanément tous les sons du SoundBoard, et le bouton 💬 du lecteur copie
          « 🎵 Titre – Artiste » pour ton chat.
        </p>
      </div>

      <div className="settings-section">
        <h2 className="section-title">💾 Données</h2>
        <p className="setting-note">
          Tout est stocké dans ce navigateur (playlists, likes : {likedIds.length}, stats, soundboards). Fais une sauvegarde
          pour ne rien perdre ou pour changer d'appareil.
        </p>
        <div className="settings-buttons">
          <button className="btn btn-primary" style={{ background: currentTheme.gradient }}
            onClick={() => { const n = exportAll(); toast(`Sauvegarde créée (${n} éléments)`, '📤'); }}>
            📤 Exporter une sauvegarde
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleImport} />
          <button className="btn btn-secondary" onClick={() => fileRef.current.click()}>📥 Importer une sauvegarde</button>
        </div>
        <div className="settings-buttons">
          <button className="btn btn-secondary" onClick={() => { clearRecentSearches(); toast('Recherches récentes effacées', '🧹'); }}>
            🧹 Effacer les recherches récentes
          </button>
          <button className="btn btn-secondary"
            onClick={() => confirmThen('Effacer l\'historique d\'écoute ?', () => { clearHistory(); toast('Historique effacé', '🧹'); })}>
            📜 Effacer l'historique
          </button>
          <button className="btn btn-danger"
            onClick={() => confirmThen('Remettre toutes les statistiques à zéro ?', () => { resetStats(); toast('Statistiques réinitialisées', '🧹'); })}>
            📊 Réinitialiser les stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
