import { useEffect, useCallback } from 'react';export const useKeyboardShortcuts = ({
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onShuffle,
  onRepeat,
  onToggleQueue,
  isEnabled = true
}) => {
  const handleKeyDown = useCallback((e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }        if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onPlayPause?.();
      return;
    }        if (e.code === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onNext?.();
      return;
    }        if (e.code === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onPrevious?.();
      return;
    }        if ((e.code === 'ArrowUp' || e.code === 'Equal' || e.code === 'NumpadAdd') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onVolumeUp?.();
      return;
    }        if ((e.code === 'ArrowDown' || e.code === 'Minus' || e.code === 'NumpadSubtract') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onVolumeDown?.();
      return;
    }        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyM') {
      e.preventDefault();
      onMute?.();
      return;
    }        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
      onShuffle?.();
      return;
    }        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyR') {
      e.preventDefault();
      onRepeat?.();
      return;
    }        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyQ') {
      e.preventDefault();
      onToggleQueue?.();
      return;
    }
  }, [onPlayPause, onNext, onPrevious, onVolumeUp, onVolumeDown, onMute, onShuffle, onRepeat, onToggleQueue]);  useEffect(() => {
    if (!isEnabled) return;    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isEnabled]);
};export default useKeyboardShortcuts;
