import React, { useMemo } from 'react';
import CollectionView from './CollectionView';
import { useOffline } from '../contexts/OfflineContext';
import { useLibrary } from '../contexts/LibraryContext';

const fmt = (b) => (b >= 1e9 ? `${(b / 1e9).toFixed(2)} Go` : b >= 1e6 ? `${(b / 1e6).toFixed(1)} Mo` : `${Math.round(b / 1e3)} Ko`);

const DownloadsPage = ({ musicDatabase, collectionProps }) => {
  const off = useOffline();
  const { likedIds } = useLibrary();
  const tracks = useMemo(() => musicDatabase.filter((t) => off.downloaded[t.id]), [musicDatabase, off.downloaded]);
  const likes = useMemo(() => likedIds.map((id) => off.tracksById.get(id)).filter(Boolean), [likedIds, off.tracksById]);
  const pct = off.storage && off.storage.quota ? Math.min(100, (off.storage.usage / off.storage.quota) * 100) : 0;
  const active = Object.keys(off.progress);

  return (
    <div>
      <div className="page-container dl-page-top">
        <h1 className="page-title">⬇️ Téléchargements</h1>
        {!off.supported && (
          <div className="dl-warn">Le mode hors-ligne nécessite une connexion sécurisée (HTTPS) ou localhost, et un navigateur récent.</div>
        )}
        <div className="dl-stats">
          <div><strong>{off.count}</strong><span>titre{off.count > 1 ? 's' : ''} hors-ligne</span></div>
          <div><strong>{fmt(off.totalBytes)}</strong><span>utilisés par la musique</span></div>
          <div><strong className={off.online ? 'ok' : 'ko'}>{off.online ? 'En ligne' : 'Hors-ligne'}</strong><span>connexion</span></div>
        </div>
        {off.storage && off.storage.quota > 0 && (
          <div className="dl-storage" title={`${fmt(off.storage.usage)} / ${fmt(off.storage.quota)}`}>
            <div style={{ width: `${Math.max(1, pct)}%` }} />
          </div>
        )}
        <div className="dl-actions">
          <button className="dl-action" disabled={!likes.length} onClick={() => off.downloadMany(likes)}>♥ Télécharger mes likés ({likes.length})</button>
          <button className="dl-action" onClick={() => off.downloadMany(musicDatabase)}>📥 Tout télécharger ({musicDatabase.length})</button>
          {active.length > 0 && <button className="dl-action" onClick={off.cancelAll}>✖ Annuler ({active.length})</button>}
          {off.count > 0 && <button className="dl-action danger" onClick={() => { if (window.confirm('Supprimer tous les téléchargements ?')) off.clearAll(); }}>🗑 Tout supprimer</button>}
        </div>
        {active.length > 0 && (
          <div className="dl-active">
            {active.map((id) => {
              const t = off.tracksById.get(Number(id));
              return t ? (
                <div key={id} className="dl-active-row">
                  <span>{t.title}</span>
                  <div className="dl-bar"><div style={{ width: `${Math.round((off.progress[id] || 0) * 100)}%` }} /></div>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
      <div className="page-container">
      <CollectionView
        {...collectionProps}
        title="Disponibles hors-ligne" emoji="📥" subtitle="Écoutables sans connexion"
        tracks={tracks}
        emptyMessage="Aucun titre téléchargé. Appuie sur ⬇ à côté d'un titre pour l'écouter sans internet."
      />
      </div>
    </div>
  );
};

export default DownloadsPage;
