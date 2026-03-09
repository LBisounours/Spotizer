// /src/contexts/SoundBoardContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundBoardContext = createContext();

export const useSoundBoard = () => {
  const context = useContext(SoundBoardContext);
  if (!context) {
    throw new Error('useSoundBoard must be used within a SoundBoardProvider');
  }
  return context;
};

export const SoundBoardProvider = ({ children }) => {
  const [soundBoards, setSoundBoards] = useState([]);
  const [soundBoardHistory, setSoundBoardHistory] = useState([]);
  const [selectedSoundBoardForShortcuts, setSelectedSoundBoardForShortcuts] = useState(null);

  // Charger les soundboards depuis le localStorage
  useEffect(() => {
    const savedSoundBoards = localStorage.getItem('spotizer-soundboards');
    if (savedSoundBoards) {
      setSoundBoards(JSON.parse(savedSoundBoards));
    }

    const savedHistory = localStorage.getItem('spotizer-soundboard-history');
    if (savedHistory) {
      setSoundBoardHistory(JSON.parse(savedHistory));
    }

    const savedSelectedBoard = localStorage.getItem('spotizer-selected-soundboard-shortcuts');
    if (savedSelectedBoard) {
      setSelectedSoundBoardForShortcuts(savedSelectedBoard);
    }
  }, []);

  // Sauvegarder les soundboards
  useEffect(() => {
    if (soundBoards.length > 0) {
      localStorage.setItem('spotizer-soundboards', JSON.stringify(soundBoards));
    }
  }, [soundBoards]);

  // Sauvegarder l'historique
  useEffect(() => {
    if (soundBoardHistory.length > 0) {
      localStorage.setItem('spotizer-soundboard-history', JSON.stringify(soundBoardHistory));
    }
  }, [soundBoardHistory]);

  // Sauvegarder le soundboard sélectionné pour les raccourcis
  useEffect(() => {
    if (selectedSoundBoardForShortcuts) {
      localStorage.setItem('spotizer-selected-soundboard-shortcuts', selectedSoundBoardForShortcuts);
    }
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
    setSoundBoards([...soundBoards, newSoundBoard]);
    return newSoundBoard;
  };

  const deleteSoundBoard = (soundBoardId) => {
    setSoundBoards(soundBoards.filter(sb => sb.id !== soundBoardId));
    if (selectedSoundBoardForShortcuts === soundBoardId) {
      setSelectedSoundBoardForShortcuts(null);
      localStorage.removeItem('spotizer-selected-soundboard-shortcuts');
    }
  };

  const updateSoundBoard = (updatedSoundBoard) => {
    setSoundBoards(soundBoards.map(sb => 
      sb.id === updatedSoundBoard.id ? updatedSoundBoard : sb
    ));
  };

  const addSoundToBoard = (soundBoardId, sound) => {
    setSoundBoards(soundBoards.map(sb => {
      if (sb.id === soundBoardId) {
        if (!sb.sounds.find(s => s.id === sound.id)) {
          return { ...sb, sounds: [...sb.sounds, sound] };
        }
      }
      return sb;
    }));
  };

  const removeSoundFromBoard = (soundBoardId, soundId) => {
    setSoundBoards(soundBoards.map(sb => {
      if (sb.id === soundBoardId) {
        return { ...sb, sounds: sb.sounds.filter(s => s.id !== soundId) };
      }
      return sb;
    }));
  };

  const importSoundBoard = (importedSoundBoard) => {
    const newSoundBoard = {
      ...importedSoundBoard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSoundBoards([...soundBoards, newSoundBoard]);
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