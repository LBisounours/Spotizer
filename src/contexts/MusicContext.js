import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  // Historique d'écoute (50 dernières)
  const [listeningHistory, setListeningHistory] = useState(() => {
    const saved = localStorage.getItem('spotizer-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Statistiques d'écoute
  const [playStats, setPlayStats] = useState(() => {
    const saved = localStorage.getItem('spotizer-play-stats');
    return saved ? JSON.parse(saved) : {};
  });

  // Temps d'écoute par période
  const [listeningTime, setListeningTime] = useState(() => {
    const saved = localStorage.getItem('spotizer-listening-time');
    return saved ? JSON.parse(saved) : {
      daily: {},
      weekly: 0,
      monthly: 0,
      yearly: 0,
      total: 0
    };
  });

  // Sleep Timer
  const [sleepTimer, setSleepTimer] = useState(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Sauvegarder l'historique
  useEffect(() => {
    localStorage.setItem('spotizer-history', JSON.stringify(listeningHistory));
  }, [listeningHistory]);

  // Sauvegarder les stats
  useEffect(() => {
    localStorage.setItem('spotizer-play-stats', JSON.stringify(playStats));
  }, [playStats]);

  // Sauvegarder le temps d'écoute
  useEffect(() => {
    localStorage.setItem('spotizer-listening-time', JSON.stringify(listeningTime));
  }, [listeningTime]);

  // Ajouter à l'historique
  const addToHistory = useCallback((track) => {
    const historyEntry = {
      ...track,
      playedAt: new Date().toISOString(),
      playId: Date.now()
    };

    setListeningHistory(prev => {
      const newHistory = [historyEntry, ...prev].slice(0, 50);
      return newHistory;
    });

    // Mettre à jour les stats de lecture
    setPlayStats(prev => ({
      ...prev,
      [track.id]: (prev[track.id] || 0) + 1
    }));
  }, []);

  // Ajouter du temps d'écoute (en secondes)
  const addListeningTime = useCallback((seconds) => {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const weekStart = getWeekStart(now);
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const yearKey = now.getFullYear().toString();

    setListeningTime(prev => {
      const newDaily = { ...prev.daily };
      newDaily[dateKey] = (newDaily[dateKey] || 0) + seconds;

      // Calculer les totaux
      const weeklyTotal = Object.entries(newDaily)
        .filter(([date]) => new Date(date) >= weekStart)
        .reduce((sum, [, time]) => sum + time, 0);

      const monthlyTotal = Object.entries(newDaily)
        .filter(([date]) => {
          const d = new Date(date);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((sum, [, time]) => sum + time, 0);

      const yearlyTotal = Object.entries(newDaily)
        .filter(([date]) => new Date(date).getFullYear() === now.getFullYear())
        .reduce((sum, [, time]) => sum + time, 0);

      return {
        daily: newDaily,
        weekly: weeklyTotal,
        monthly: monthlyTotal,
        yearly: yearlyTotal,
        total: prev.total + seconds
      };
    });
  }, []);

  // Obtenir le début de la semaine
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Top 10 musiques
  const getTopTracks = useCallback((musicDatabase, limit = 10) => {
    const sorted = Object.entries(playStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);

    return sorted.map(([id, count]) => {
      const track = musicDatabase.find(t => t.id === parseInt(id));
      return { ...track, playCount: count };
    }).filter(t => t.id);
  }, [playStats]);

  // Top genres
  const getTopGenres = useCallback((musicDatabase, limit = 3) => {
    const genreCounts = {};
    
    Object.entries(playStats).forEach(([id, count]) => {
      const track = musicDatabase.find(t => t.id === parseInt(id));
      if (track && track.genre) {
        genreCounts[track.genre] = (genreCounts[track.genre] || 0) + count;
      }
    });

    return Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([genre, count]) => ({ genre, count }));
  }, [playStats]);

  // Recommandations basiques
  const getRecommendations = useCallback((musicDatabase, currentTrack, limit = 10) => {
    if (!currentTrack && listeningHistory.length === 0) {
      // Si pas d'historique, retourner des musiques aléatoires
      return [...musicDatabase].sort(() => Math.random() - 0.5).slice(0, limit);
    }

    const topGenres = getTopGenres(musicDatabase, 5).map(g => g.genre);
    const topArtists = getTopArtists(musicDatabase, 5);
    const recentlyPlayed = new Set(listeningHistory.slice(0, 20).map(h => h.id));

    // Score chaque musique
    const scored = musicDatabase
      .filter(track => !recentlyPlayed.has(track.id))
      .map(track => {
        let score = 0;
        
        // Bonus pour genre similaire
        if (topGenres.includes(track.genre)) {
          score += 3 * (topGenres.length - topGenres.indexOf(track.genre));
        }
        
        // Bonus pour artiste similaire
        if (topArtists.includes(track.artist)) {
          score += 5;
        }
        
        // Bonus aléatoire pour diversité
        score += Math.random() * 2;
        
        return { ...track, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }, [listeningHistory, getTopGenres]);

  // Top artistes
  const getTopArtists = useCallback((musicDatabase, limit = 5) => {
    const artistCounts = {};
    
    Object.entries(playStats).forEach(([id, count]) => {
      const track = musicDatabase.find(t => t.id === parseInt(id));
      if (track) {
        artistCounts[track.artist] = (artistCounts[track.artist] || 0) + count;
      }
    });

    return Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([artist]) => artist);
  }, [playStats]);

  // Sleep Timer - Démarrer
const startSleepTimer = useCallback((minutes, onStop, audioRef) => {
  if (sleepTimer) clearInterval(sleepTimer);

  const endTime = Date.now() + minutes * 60 * 1000;
  const fadeDuration = 30000; // 30 secondes
  let fadeStarted = false;
  let startVolume = null;

  setSleepTimerRemaining(minutes * 60);
  setIsFadingOut(false);

  const timer = setInterval(() => {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setSleepTimerRemaining(remaining);

    if (remaining <= fadeDuration / 1000 && audioRef?.current) {
      if (!fadeStarted) {
        fadeStarted = true;
        startVolume = audioRef.current.volume; // <- volume actuel au début du fade
      }
      const fadeProgress = (fadeDuration / 1000 - remaining) / (fadeDuration / 1000);
      audioRef.current.volume = Math.max(0, startVolume * (1 - fadeProgress));
      setIsFadingOut(true);
    }

    if (remaining <= 0) {
      clearInterval(timer);
      setSleepTimer(null);
      setSleepTimerRemaining(0);
      setIsFadingOut(false);
      if (audioRef?.current) {
        audioRef.current.pause();
        audioRef.current.volume = startVolume || 0.7; // reset volume initial
      }
      if (onStop) onStop();
    }
  }, 200); // interval plus petit pour fondu plus fluide

  setSleepTimer(timer);
}, [sleepTimer]);


  // Sleep Timer - Arrêter
  const stopSleepTimer = useCallback(() => {
    if (sleepTimer) {
      clearInterval(sleepTimer);
      setSleepTimer(null);
      setSleepTimerRemaining(0);
      setIsFadingOut(false);
    }
  }, [sleepTimer]);

  // Formater le temps
  const formatListeningTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <MusicContext.Provider value={{
      listeningHistory,
      addToHistory,
      playStats,
      listeningTime,
      addListeningTime,
      getTopTracks,
      getTopGenres,
      getTopArtists,
      getRecommendations,
      formatListeningTime,
      sleepTimerRemaining,
      isFadingOut,
      startSleepTimer,
      stopSleepTimer,
      sleepTimerActive: sleepTimer !== null
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
