// Titres likés, recherches récentes, réglages, sauvegarde complète
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadJSON, saveJSON } from '../utils_storage';

const LibraryContext = createContext(null);

export const DEFAULT_SETTINGS = {
  autoplaySimilar: true, // enchaîne des titres similaires quand la file est terminée
  ducking: true,         // baisse la musique pendant un son du soundboard
  duckLevel: 0.3,        // volume de la musique pendant un son (30 %)
  compact: false,        // listes plus denses
  reduceMotion: false,   // coupe les animations
  playerBackdrop: true,  // pochette floue en fond du lecteur
  viewMode: 'list'       // 'list' | 'grid' dans les collections
};

const BACKUP_EXCLUDED = ['spotizer-session', 'spotizer-now-playing'];
const isBackupKey = (k) =>
  (k.startsWith('spotizer-') || k === 'deezer-playlists') && !BACKUP_EXCLUDED.includes(k);

export const LibraryProvider = ({ children }) => {
  const [likedIds, setLikedIds] = useState(() => {
    const saved = loadJSON('spotizer-likes', []);
    return Array.isArray(saved) ? saved : [];
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = loadJSON('spotizer-recent-searches', []);
    return Array.isArray(saved) ? saved : [];
  });
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...(loadJSON('spotizer-settings', {}) || {})
  }));

  useEffect(() => { saveJSON('spotizer-likes', likedIds); }, [likedIds]);
  useEffect(() => { saveJSON('spotizer-recent-searches', recentSearches); }, [recentSearches]);
  useEffect(() => { saveJSON('spotizer-settings', settings); }, [settings]);

  const isLiked = useCallback((id) => likedIds.includes(id), [likedIds]);

  const toggleLike = useCallback((id) => {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const addRecentSearch = useCallback((query) => {
    const q = (query || '').trim();
    if (q.length < 2) return;
    setRecentSearches((prev) => [q, ...prev.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8));
  }, []);

  const removeRecentSearch = useCallback((query) => {
    setRecentSearches((prev) => prev.filter((x) => x !== query));
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Sauvegarde complète (playlists, likes, stats, soundboards, réglages...) en un fichier JSON
  const exportAll = useCallback(() => {
    const data = {};
    Object.keys(localStorage).filter(isBackupKey).forEach((k) => { data[k] = localStorage.getItem(k); });
    const payload = { app: 'spotizer', version: 1, exportedAt: new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spotizer-sauvegarde-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return Object.keys(data).length;
  }, []);

  // Restaure une sauvegarde. Retourne le nombre d'éléments restaurés (lance une erreur si le fichier est invalide)
  const importAll = useCallback((text) => {
    const parsed = JSON.parse(text);
    if (!parsed || parsed.app !== 'spotizer' || typeof parsed.data !== 'object') {
      throw new Error('Format invalide');
    }
    let count = 0;
    Object.entries(parsed.data).forEach(([k, v]) => {
      if (isBackupKey(k) && typeof v === 'string') {
        localStorage.setItem(k, v);
        count += 1;
      }
    });
    return count;
  }, []);

  const value = useMemo(() => ({
    likedIds, isLiked, toggleLike,
    recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches,
    settings, updateSetting,
    exportAll, importAll
  }), [likedIds, isLiked, toggleLike, recentSearches, addRecentSearch, removeRecentSearch,
    clearRecentSearches, settings, updateSetting, exportAll, importAll]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within a LibraryProvider');
  return ctx;
};
