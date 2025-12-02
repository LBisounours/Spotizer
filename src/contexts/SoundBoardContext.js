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

  // Charger les soundboards depuis le localStorage au démarrage
  useEffect(() => {
    const savedSoundBoards = localStorage.getItem('spotizer-soundboards');
    if (savedSoundBoards) {
      setSoundBoards(JSON.parse(savedSoundBoards));
    }

    const savedHistory = localStorage.getItem('spotizer-soundboard-history');
    if (savedHistory) {
      setSoundBoardHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder les soundboards dans le localStorage
  useEffect(() => {
    if (soundBoards.length > 0) {
      localStorage.setItem('spotizer-soundboards', JSON.stringify(soundBoards));
    }
  }, [soundBoards]);

  // Sauvegarder l'historique dans le localStorage
  useEffect(() => {
    if (soundBoardHistory.length > 0) {
      localStorage.setItem('spotizer-soundboard-history', JSON.stringify(soundBoardHistory));
    }
  }, [soundBoardHistory]);

  // Ajouter un son à l'historique
  const addToSoundBoardHistory = (sound) => {
    const newEntry = {
      ...sound,
      playedAt: new Date().toISOString(),
      playId: `${sound.id}-${Date.now()}`
    };

    setSoundBoardHistory(prev => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, 50);
    });
  };

  // Créer un nouveau soundboard
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

  // Supprimer un soundboard
  const deleteSoundBoard = (soundBoardId) => {
    setSoundBoards(soundBoards.filter(sb => sb.id !== soundBoardId));
  };

  // Mettre à jour un soundboard
  const updateSoundBoard = (updatedSoundBoard) => {
    setSoundBoards(soundBoards.map(sb => 
      sb.id === updatedSoundBoard.id ? updatedSoundBoard : sb
    ));
  };

  // Ajouter un son à un soundboard
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

  // Retirer un son d'un soundboard
  const removeSoundFromBoard = (soundBoardId, soundId) => {
    setSoundBoards(soundBoards.map(sb => {
      if (sb.id === soundBoardId) {
        return { ...sb, sounds: sb.sounds.filter(s => s.id !== soundId) };
      }
      return sb;
    }));
  };

// Importer un soundboard
  const importSoundBoard = (importedSoundBoard) => {
    const newSoundBoard = {
      ...importedSoundBoard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSoundBoards([...soundBoards, newSoundBoard]);
    return newSoundBoard;
  };

  // Exporter un soundboard
  const exportSoundBoard = (soundBoard) => {
    const dataStr = JSON.stringify(soundBoard, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${soundBoard.name.replace(/[^a-z0-9]/gi, '_')}_soundboard.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    soundBoards,
    soundBoardHistory,
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