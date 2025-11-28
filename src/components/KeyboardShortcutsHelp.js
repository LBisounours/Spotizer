import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const { isDarkMode, currentTheme } = useTheme();

  if (!isOpen) return null;

  const shortcuts = [
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal shortcuts-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">⌨️ Raccourcis clavier</h2>
        
        <div className="shortcuts-list">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item">
              <kbd className="shortcut-key" style={{ borderColor: currentTheme.primary }}>
                {shortcut.keys}
              </kbd>
              <span className="shortcut-action">{shortcut.action}</span>
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-primary" style={{ background: currentTheme.gradient }}>
            Compris !
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
