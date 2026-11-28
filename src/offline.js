// Stockage hors-ligne des musiques (Cache API). Nécessite HTTPS ou localhost.
export const AUDIO_CACHE = 'spotizer-audio-v1';
export const STATIC_CACHE = 'spotizer-static-v1';

export const offlineSupported = () =>
  typeof window !== 'undefined' && 'caches' in window && window.isSecureContext !== false;

export const urlFor = (track) => new URL(track.audioUrl, document.baseURI).href;
const keyFor = (track) => urlFor(track);

export async function listDownloads() {
  if (!offlineSupported()) return {};
  const cache = await caches.open(AUDIO_CACHE);
  const reqs = await cache.keys();
  const out = {};
  await Promise.all(reqs.map(async (r) => {
    const res = await cache.match(r);
    out[new URL(r.url).href] = Number(res?.headers.get('content-length')) || (res ? (await res.clone().blob()).size : 0);
  }));
  return out;
}

export async function downloadAudio(track, { signal, onProgress } = {}) {
  const res = await fetch(urlFor(track), { signal });
  const type = res.headers.get('content-type') || '';
  if (!res.ok) throw new Error('HTTP ' + res.status);
  if (/text\/html/i.test(type)) throw new Error('Fichier introuvable');
  const total = Number(res.headers.get('content-length')) || 0;
  let received = 0;
  const chunks = [];
  if (res.body && res.body.getReader) {
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (onProgress && total) onProgress(Math.min(0.99, received / total));
    }
  } else {
    const buf = new Uint8Array(await res.arrayBuffer());
    chunks.push(buf); received = buf.length;
  }
  if (received < 1024) throw new Error('Fichier invalide');
  const blob = new Blob(chunks, { type: /audio|octet/i.test(type) ? type : 'audio/mpeg' });
  const cache = await caches.open(AUDIO_CACHE);
  await cache.put(keyFor(track), new Response(blob, {
    headers: { 'Content-Type': blob.type, 'Content-Length': String(blob.size) }
  }));
  if (onProgress) onProgress(1);
  cacheCover(track);
  return blob.size;
}

export async function cacheCover(track) {
  try {
    if (!track.cover) return;
    const cache = await caches.open(STATIC_CACHE);
    const u = new URL(track.cover, document.baseURI).href;
    if (!(await cache.match(u))) await cache.add(u);
  } catch (e) { /* pas grave */ }
}

export async function removeAudio(track) {
  if (!offlineSupported()) return;
  const cache = await caches.open(AUDIO_CACHE);
  await cache.delete(keyFor(track));
}

export async function clearAudio() {
  if (!offlineSupported()) return;
  await caches.delete(AUDIO_CACHE);
}

export async function getBlobUrl(track) {
  if (!offlineSupported()) return null;
  const cache = await caches.open(AUDIO_CACHE);
  const res = await cache.match(keyFor(track));
  if (!res) return null;
  return URL.createObjectURL(await res.blob());
}
