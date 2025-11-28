import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMusic } from '../contexts/MusicContext';

const SleepTimerModal = ({ isOpen, onClose, audioRef, onStop }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const { startSleepTimer, stopSleepTimer, sleepTimerActive, sleepTimerRemaining, isFadingOut, formatListeningTime } = useMusic();
  const [customMinutes, setCustomMinutes] = useState(30);

  const presetTimes = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 heure', value: 60 },
    { label: '1h30', value: 90 },
    { label: '2 heures', value: 120 }
  ];

  const handleStart = (minutes) => {
    startSleepTimer(minutes, onStop, audioRef);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal sleep-timer-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">⏰ Minuteur de sommeil</h2>

        {sleepTimerActive ? (
          <div className="timer-active">
            <div className="timer-display" style={{ color: currentTheme.primary }}>
              <span className="timer-icon">{isFadingOut ? '🔉' : '⏳'}</span>
              <span className="timer-remaining">
                {Math.floor(sleepTimerRemaining / 60)}:{(sleepTimerRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
            {isFadingOut && (
              <p className="fade-notice">Le volume diminue progressivement...</p>
            )}
            <button 
              className="btn btn-danger"
              onClick={() => { stopSleepTimer(); onClose(); }}
            >
              Annuler le minuteur
            </button>
          </div>
        ) : (
          <>
            <div className="timer-presets">
              {presetTimes.map(preset => (
                <button
                  key={preset.value}
                  className="timer-preset-btn"
                  onClick={() => handleStart(preset.value)}
                  style={{ borderColor: currentTheme.primary }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="timer-custom">
              <label>Durée personnalisée (minutes)</label>
              <div className="custom-input-group">
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                  className="form-input"
                />
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStart(customMinutes)}
                  style={{ background: currentTheme.gradient }}
                >
                  Démarrer
                </button>
              </div>
            </div>

            <p className="timer-info">
              💡 Le volume diminuera progressivement 30 secondes avant l'arrêt.
            </p>
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepTimerModal;
