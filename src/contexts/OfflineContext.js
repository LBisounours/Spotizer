import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from './ToastContext';
import { offlineSupported, listDownloads, downloadAudio, removeAudio, clearAudio, urlFor } from '../offline';

const OfflineContext = createContext(null);
export const useOffline = () => useContext(OfflineContext);

const CONCURRENCY = 2;

export const OfflineProvider = ({ tracks, children }) => {
  const { toast } = useToast();
  const supported = offlineSupported();
  const [downloaded, setDownloaded] = useState({});
  const [progress, setProgress] = useState({});
  const [ready, setReady] = useState(!supported);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine !== false);
  const [storage, setStorage] = useState(null);

  const queueRef = useRef([]);
  const activeRef = useRef(new Map()); // id -> AbortController
  const batchRef = useRef({ ok: 0, fail: 0, silent: true });
  const downloadedRef = useRef(downloaded);
  downloadedRef.current = downloaded;
  const tracksById = useMemo(() => new Map(tracks.map((t) => [t.id, t])), [tracks]);

  const refreshStorage = useCallback(async () => {
    try {
      if (navigator.storage?.estimate) {
        const e = await navigator.storage.estimate();
        setStorage({ usage: e.usage || 0, quota: e.quota || 0 });
      }
    } catch (err) { /* ignore */ }
  }, []);

  // État initial : ce qui est déjà en cache
  useEffect(() => {
    let alive = true;
    (async () => {
      if (supported) {
        try {
          const urls = await listDownloads();
          const map = {};
          tracks.forEach((t) => { const s = urls[urlFor(t)]; if (s !== undefined) map[t.id] = s || 1; });
          if (alive) setDownloaded(map);
        } catch (e) { /* ignore */ }
      }
      if (alive) { setReady(true); refreshStorage(); }
    })();
    return () => { alive = false; };
  }, [tracks, supported, refreshStorage]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const finishBatchIfIdle = useCallback(() => {
    if (queueRef.current.length || activeRef.current.size) return;
    const b = batchRef.current;
    if (!b.silent && (b.ok || b.fail)) {
      toast(b.fail ? `${b.ok} téléchargé(s), ${b.fail} échec(s)` : `${b.ok} titre${b.ok > 1 ? 's' : ''} disponible${b.ok > 1 ? 's' : ''} hors-ligne`, b.fail ? '⚠️' : '✅');
    }
    batchRef.current = { ok: 0, fail: 0, silent: true };
    refreshStorage();
  }, [toast, refreshStorage]);

  const pump = useCallback(() => {
    while (activeRef.current.size < CONCURRENCY && queueRef.current.length) {
      const track = queueRef.current.shift();
      const ctrl = new AbortController();
      activeRef.current.set(track.id, ctrl);
      setProgress((p) => ({ ...p, [track.id]: 0.001 }));
      downloadAudio(track, {
        signal: ctrl.signal,
        onProgress: (f) => setProgress((p) => (p[track.id] === undefined ? p : { ...p, [track.id]: f }))
      }).then((size) => {
        setDownloaded((d) => ({ ...d, [track.id]: size }));
        batchRef.current.ok += 1;
      }).catch((err) => {
        if (err?.name !== 'AbortError') {
          batchRef.current.fail += 1;
          if (batchRef.current.silent) toast(`Téléchargement impossible : « ${track.title} »`, '⚠️');
        }
      }).finally(() => {
        activeRef.current.delete(track.id);
        setProgress((p) => { const n = { ...p }; delete n[track.id]; return n; });
        pump();
        finishBatchIfIdle();
      });
    }
  }, [toast, finishBatchIfIdle]);

  const downloadMany = useCallback((list, { silent = false } = {}) => {
    if (!supported) { toast('Hors-ligne indisponible (HTTPS ou localhost requis)', '⚠️'); return 0; }
    if (!online) { toast('Tu es hors-ligne : impossible de télécharger', '📡'); return 0; }
    const todo = list.filter((t) => t && !downloadedRef.current[t.id] && !activeRef.current.has(t.id) && !queueRef.current.some((q) => q.id === t.id));
    if (!todo.length) { if (!silent) toast('Tout est déjà téléchargé', '✅'); return 0; }
    if (batchRef.current.silent) batchRef.current = { ok: 0, fail: 0, silent: list.length === 1 || silent };
    else if (list.length > 1) batchRef.current.silent = false;
    queueRef.current.push(...todo);
    setProgress((p) => { const n = { ...p }; todo.forEach((t) => { if (n[t.id] === undefined) n[t.id] = 0; }); return n; });
    if (!silent && todo.length > 1) toast(`Téléchargement de ${todo.length} titres…`, '⬇️');
    pump();
    return todo.length;
  }, [supported, online, toast, pump]);

  const download = useCallback((t) => downloadMany([t]), [downloadMany]);

  const cancel = useCallback((id) => {
    queueRef.current = queueRef.current.filter((t) => t.id !== id);
    const c = activeRef.current.get(id);
    if (c) c.abort();
    setProgress((p) => { const n = { ...p }; delete n[id]; return n; });
  }, []);

  const cancelAll = useCallback(() => {
    queueRef.current = [];
    activeRef.current.forEach((c) => c.abort());
    setProgress({});
  }, []);

  const remove = useCallback(async (t) => {
    await removeAudio(t);
    setDownloaded((d) => { const n = { ...d }; delete n[t.id]; return n; });
    refreshStorage();
  }, [refreshStorage]);

  const clearAll = useCallback(async () => {
    cancelAll();
    await clearAudio();
    setDownloaded({});
    refreshStorage();
  }, [cancelAll, refreshStorage]);

  const requestPersist = useCallback(async () => {
    try { if (navigator.storage?.persist) await navigator.storage.persist(); } catch (e) { /* ignore */ }
  }, []);

  const value = useMemo(() => ({
    supported, ready, online, downloaded, progress, storage,
    isDownloaded: (id) => !!downloaded[id],
    isDownloading: (id) => progress[id] !== undefined,
    canPlay: (t) => online || !!downloaded[t.id],
    totalBytes: Object.values(downloaded).reduce((a, b) => a + b, 0),
    count: Object.keys(downloaded).length,
    activeCount: Object.keys(progress).length,
    tracksById,
    download, downloadMany, cancel, cancelAll, remove, clearAll, requestPersist
  }), [supported, ready, online, downloaded, progress, storage, tracksById, download, downloadMany, cancel, cancelAll, remove, clearAll, requestPersist]);

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};
