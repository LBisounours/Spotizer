// /src/components/KeyboardShortcutsHelp.js
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSoundBoard } from '../contexts/SoundBoardContext';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const { soundBoards, selectedSoundBoardForShortcuts } = useSoundBoard();

  if (!isOpen) return null;

  const musicShortcuts = [
    { keys: 'Espace', action: 'Lecture / Pause' },
    { keys: '←', action: 'Musique précédente' },
    { keys: '→', action: 'Musique suivante' },
    { keys: '↑ ou +', action: 'Augmenter le volume' },
    { keys: '↓ ou -', action: 'Diminuer le volume' },
    { keys: 'Ctrl + M', action: 'Activer / Désactiver le son' },
    { keys: 'Ctrl + S', action: 'Mode aléatoire' },
    { keys: 'Ctrl + R', action: 'Mode répétition' },
    { keys: 'Ctrl + Q', action: 'Ouvrir la file d\'attente' }
  ];

  const soundBoardShortcuts = [
    { keys: 'Ctrl + 1 (&)', action: 'Son 1' },
    { keys: 'Ctrl + 2 (é)', action: 'Son 2' },
    { keys: 'Ctrl + 3 (")', action: 'Son 3' },
    { keys: 'Ctrl + 4 (\')', action: 'Son 4' },
    { keys: 'Ctrl + 5 (()', action: 'Son 5' },
    { keys: 'Ctrl + 6 (-)', action: 'Son 6' },
    { keys: 'Ctrl + 7 (è)', action: 'Son 7' },
    { keys: 'Ctrl + 8 (_)', action: 'Son 8' },
    { keys: 'Ctrl + 9 (ç)', action: 'Son 9' },
    { keys: 'Ctrl + 0 (à)', action: 'Son 10' }
  ];

  const selectedBoard = soundBoards.find(b => b.id === selectedSoundBoardForShortcuts);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal shortcuts-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <h2 className="modal-title">⌨️ Raccourcis clavier</h2>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: currentTheme.primary }}>
            🎵 Contrôles musique
          </h3>
          <div className="shortcuts-list">
            {musicShortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <kbd className="shortcut-key" style={{ borderColor: currentTheme.primary }}>
                  {shortcut.keys}
                </kbd>
                <span className="shortcut-action">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: currentTheme.primary }}>
            🔊 SoundBoard
          </h3>
          {selectedBoard ? (
            <>
              <p style={{ marginBottom: '12px', opacity: 0.8 }}>
                SoundBoard actif : <strong>{selectedBoard.name}</strong>
              </p>
              <div className="shortcuts-list">
                {soundBoardShortcuts.map((shortcut, index) => {
                  const sound = selectedBoard.sounds[index];
                  return (
                    <div key={index} className="shortcut-item">
                      <kbd className="shortcut-key" style={{ borderColor: currentTheme.primary }}>
                        {shortcut.keys}
                      </kbd>
                      <span className="shortcut-action">
                        {sound ? sound.title : <span style={{ opacity: 0.5 }}>Non assigné</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{ opacity: 0.7, fontStyle: 'italic' }}>
              Aucun SoundBoard sélectionné. Ouvrez un SoundBoard pour activer les raccourcis.
            </p>
          )}
        </div>

        <div className="modal-buttons" style={{ marginTop: '24px' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ background: currentTheme.gradient }}>
            Compris !
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;