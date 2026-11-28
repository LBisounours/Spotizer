// /src/hooks/useKeyBoardShortcuts.js
import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = ({
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onShuffle,
  onRepeat,
  onToggleQueue,
  onPlaySoundBoardSound, // Nouvelle fonction pour jouer les sons
  onSeekForward,
  onSeekBack,
  onLike,
  onFullscreen,
  onFocusSearch,
  onEscape,
  onShowHelp,
  onSpeedUp,
  onSpeedDown,
  onAbLoop,
  onSeekPercent,
  isEnabled = true
}) => {
  const handleKeyDown = useCallback((e) => {
    // Échap : stoppe les sons du soundboard / ferme les panneaux (même dans un champ texte)
    if (e.code === 'Escape') {
      onEscape?.();
      return;
    }

    // Ctrl+K : recherche (même dans un champ texte)
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
      e.preventDefault();
      onFocusSearch?.();
      return;
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) {
      return;
    }

    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onFocusSearch?.();
      return;
    }

    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key === ']') { e.preventDefault(); onSpeedUp?.(); return; }
      if (e.key === '[') { e.preventDefault(); onSpeedDown?.(); return; }
      if (e.code === 'KeyB') { e.preventDefault(); onAbLoop?.(); return; }
      if (/^Digit[0-9]$/.test(e.code) && !e.shiftKey) { e.preventDefault(); onSeekPercent?.(Number(e.code.slice(5)) / 10); return; }
    }

    if (e.key === '?') {
      e.preventDefault();
      onShowHelp?.();
      return;
    }

    if (e.code === 'KeyL' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      onLike?.();
      return;
    }

    if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      onFullscreen?.();
      return;
    }

    if (e.code === 'ArrowRight' && e.shiftKey) {
      e.preventDefault();
      onSeekForward?.();
      return;
    }

    if (e.code === 'ArrowLeft' && e.shiftKey) {
      e.preventDefault();
      onSeekBack?.();
      return;
    }

    // Raccourcis pour les soundboards (Ctrl + 1-0)
    if ((e.ctrlKey || e.metaKey) && onPlaySoundBoardSound) {
      // Mapping des touches pour Ctrl+& (1) à Ctrl+à (0)
      const soundBoardKeys = {
        'Digit1': 0,  // Ctrl + & (1)
        'Digit2': 1,  // Ctrl + é (2)
        'Digit3': 2,  // Ctrl + " (3)
        'Digit4': 3,  // Ctrl + ' (4)
        'Digit5': 4,  // Ctrl + ( (5)
        'Digit6': 5,  // Ctrl + - (6)
        'Digit7': 6,  // Ctrl + è (7)
        'Digit8': 7,  // Ctrl + _ (8)
        'Digit9': 8,  // Ctrl + ç (9)
        'Digit0': 9,  // Ctrl + à (0)
      };

      if (soundBoardKeys.hasOwnProperty(e.code)) {
        e.preventDefault();
        onPlaySoundBoardSound(soundBoardKeys[e.code]);
        return;
      }
    }

    if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onPlayPause?.();
      return;
    }

    if (e.code === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onNext?.();
      return;
    }

    if (e.code === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onPrevious?.();
      return;
    }

    if ((e.code === 'ArrowUp' || e.code === 'Equal' || e.code === 'NumpadAdd') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onVolumeUp?.();
      return;
    }

    if ((e.code === 'ArrowDown' || e.code === 'Minus' || e.code === 'NumpadSubtract') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onVolumeDown?.();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyM') {
      e.preventDefault();
      onMute?.();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
      onShuffle?.();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyR') {
      e.preventDefault();
      onRepeat?.();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyQ') {
      e.preventDefault();
      onToggleQueue?.();
      return;
    }
  }, [onPlayPause, onNext, onPrevious, onVolumeUp, onVolumeDown, onMute, onShuffle, onRepeat, onToggleQueue, onPlaySoundBoardSound, onSeekForward, onSeekBack, onLike, onFullscreen, onFocusSearch, onEscape, onShowHelp, onSpeedUp, onSpeedDown, onAbLoop, onSeekPercent]);

  useEffect(() => {
    if (!isEnabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isEnabled]);
};

export default useKeyboardShortcuts;