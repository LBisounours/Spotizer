import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLibrary } from '../contexts/LibraryContext';

// Menu contextuel (clic droit ou bouton ⋯) sur un titre
const ContextMenu = ({ menu, onClose, actions }) => {
  const ref = useRef(null);
  const { isLiked } = useLibrary();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!menu) return;
    const w = ref.current?.offsetWidth || 230;
    const h = ref.current?.offsetHeight || 300;
    setPos({
      x: Math.max(8, Math.min(menu.x, window.innerWidth - w - 8)),
      y: Math.max(8, Math.min(menu.y, window.innerHeight - h - 8))
    });
  }, [menu]);

  useEffect(() => {
    if (!menu) return undefined;
    const close = () => onClose();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    // Différé : le clic qui a ouvert le menu ne doit pas le refermer aussitôt
    const timer = setTimeout(() => {
      window.addEventListener('click', close);
      window.addEventListener('scroll', close, true);
    }, 0);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [menu, onClose]);

  if (!menu) return null;
  const { track } = menu;
  const liked = isLiked(track.id);

  const items = [
    { icon: '▶️', label: 'Lire maintenant', run: () => actions.play(track) },
    { icon: '⏭️', label: 'Lire ensuite', run: () => actions.playNext(track) },
    { icon: '📋', label: 'Ajouter à la file d\'attente', run: () => actions.queue(track) },
    { icon: '➕', label: 'Ajouter à une playlist', run: () => actions.playlist(track) },
    { icon: liked ? '💔' : '💜', label: liked ? 'Retirer des titres likés' : 'Liker', run: () => actions.like(track) },
    { sep: true },
    { icon: '🎤', label: 'Voir l\'artiste', run: () => actions.artist(track) },
    { icon: '🏷️', label: `Plus de « ${track.genre} »`, run: () => actions.genre(track) },
    { sep: true },
    { icon: '💬', label: 'Copier pour le chat', run: () => actions.copy(track) },
    ...(actions.canShare ? [{ icon: '📤', label: 'Partager', run: () => actions.share(track) }] : []),
    ...(actions.download ? [{ icon: actions.isDownloaded(track) ? '🗑️' : '⬇️', label: actions.isDownloaded(track) ? 'Supprimer le téléchargement' : 'Télécharger (hors-ligne)', run: () => actions.download(track) }] : [])
  ];

  return ReactDOM.createPortal(
    <div
      ref={ref}
      className="ctx-menu"
      style={{ left: pos.x, top: pos.y }}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="ctx-header">
        <img src={track.cover} alt="" />
        <div>
          <strong>{track.title}</strong>
          <span>{track.artist}</span>
        </div>
      </div>
      {items.map((it, i) =>
        it.sep ? (
          <div key={`s${i}`} className="ctx-sep" />
        ) : (
          <button
            key={it.label}
            role="menuitem"
            className="ctx-item"
            onClick={() => { it.run(); onClose(); }}
          >
            <span>{it.icon}</span>{it.label}
          </button>
        )
      )}
    </div>,
    document.body
  );
};

export default ContextMenu;
