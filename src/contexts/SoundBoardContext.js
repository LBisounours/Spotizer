// /src/contexts/SoundBoardContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadJSON, saveJSON } from '../utils_storage';

const SoundBoardContext = createContext();

export const useSoundBoard = () => {
  const context = useContext(SoundBoardContext);
  if (!context) {
    throw new Error('useSoundBoard must be used within a SoundBoardProvider');
  }
  return context;
};

export const SoundBoardProvider = ({ children }) => {
  const [soundBoards, setSoundBoards] = useState(() => {
    const saved = loadJSON('spotizer-soundboards', []);
    return Array.isArray(saved) ? saved : [];
  });
  const [soundBoardHistory, setSoundBoardHistory] = useState(() => {
    const saved = loadJSON('spotizer-soundboard-history', []);
    return Array.isArray(saved) ? saved : [];
  });
  const [selectedSoundBoardForShortcuts, setSelectedSoundBoardForShortcuts] = useState(() => {
    try { return localStorage.getItem('spotizer-selected-soundboard-shortcuts'); } catch (e) { return null; }
  });

  // Sauvegardes (même quand la liste est vide, sinon un board supprimé réapparaît)
  useEffect(() => { saveJSON('spotizer-soundboards', soundBoards); }, [soundBoards]);
  useEffect(() => { saveJSON('spotizer-soundboard-history', soundBoardHistory); }, [soundBoardHistory]);
  useEffect(() => {
    try {
      if (selectedSoundBoardForShortcuts) {
        localStorage.setItem('spotizer-selected-soundboard-shortcuts', selectedSoundBoardForShortcuts);
      } else {
        localStorage.removeItem('spotizer-selected-soundboard-shortcuts');
      }
    } catch (e) {}
  }, [selectedSoundBoardForShortcuts]);

  const addToSoundBoardHistory = (sound) => {
    const newEntry = {
      ...sound,
      playedAt: new Date().toISOString(),
      playId: `${sound.id}-${Date.now()}`
    };
    setSoundBoardHistory(prev => [newEntry, ...prev].slice(0, 50));
  };

  const createSoundBoard = (name, description, cover) => {
    const newSoundBoard = {
      id: Date.now().toString(),
      name,
      description,
      cover: cover || "SoundBoard/Images/default.png",
      sounds: [],
      createdAt: new Date().toISOString()
    };
    setSoundBoards(prev => [...prev, newSoundBoard]);
    return newSoundBoard;
  };

  const deleteSoundBoard = (soundBoardId) => {
    setSoundBoards(prev => prev.filter(sb => sb.id !== soundBoardId));
    if (selectedSoundBoardForShortcuts === soundBoardId) {
      setSelectedSoundBoardForShortcuts(null);
      localStorage.removeItem('spotizer-selected-soundboard-shortcuts');
    }
  };

  const updateSoundBoard = (updatedSoundBoard) => {
    setSoundBoards(prev => prev.map(sb => 
      sb.id === updatedSoundBoard.id ? updatedSoundBoard : sb
    ));
  };

  const addSoundToBoard = (soundBoardId, sound) => {
    setSoundBoards(prev => prev.map(sb => {
      if (sb.id === soundBoardId) {
        if (!sb.sounds.find(s => s.id === sound.id)) {
          return { ...sb, sounds: [...sb.sounds, sound] };
        }
      }
      return sb;
    }));
  };

  const removeSoundFromBoard = (soundBoardId, soundId) => {
    setSoundBoards(prev => prev.map(sb => {
      if (sb.id === soundBoardId) {
        return { ...sb, sounds: sb.sounds.filter(s => s.id !== soundId) };
      }
      return sb;
    }));
  };

  const importSoundBoard = (importedSoundBoard) => {
    const newSoundBoard = {
      ...importedSoundBoard,
      name: importedSoundBoard?.name || 'SoundBoard importé',
      description: importedSoundBoard?.description || '',
      cover: importedSoundBoard?.cover || "SoundBoard/Images/default.png",
      sounds: Array.isArray(importedSoundBoard?.sounds) ? importedSoundBoard.sounds : [],
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSoundBoards(prev => [...prev, newSoundBoard]);
    return newSoundBoard;
  };

  const exportSoundBoard = (board) => {
    const dataStr = JSON.stringify(board, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${board.name.replace(/[^a-z0-9]/gi, '_')}_soundboard.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    soundBoards,
    soundBoardHistory,
    selectedSoundBoardForShortcuts,
    setSelectedSoundBoardForShortcuts,
    createSoundBoard,
    deleteSoundBoard,
    updateSoundBoard,
    addSoundToBoard,
    removeSoundFromBoard,
    importSoundBoard,
    exportSoundBoard,
    addToSoundBoardHistory
  };

  return (
    <SoundBoardContext.Provider value={value}>
      {children}
    </SoundBoardContext.Provider>
  );
};