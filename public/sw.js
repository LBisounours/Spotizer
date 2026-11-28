/* Spotizer service worker : coque de l'appli hors-ligne (la musique est gérée par le cache audio côté appli) */
const STATIC = 'spotizer-static-v1';
const AUDIO_CACHE = 'spotizer-audio-v1';
const AUDIO_RE = /\.(mp3|wav|ogg|m4a|flac|aac)(\?|$)/i;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC);
    const base = self.registration.scope;
    const urls = [base, base + 'index.html', base + 'manifest.json', base + 'favicon.png', base + 'icon-192.png', base + 'icon-512.png'];
    try {
      const res = await fetch(base + 'asset-manifest.json', { cache: 'no-store' });
      const man = await res.json();
      Object.values(man.files || {}).forEach((f) => { if (!/\.map$/.test(f)) urls.push(new URL(f, base).href); });
    } catch (e) { /* dev ou manifeste absent */ }
    await Promise.all(urls.map((u) => cache.add(u).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('spotizer-static-') && k !== STATIC).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Audio : géré par l'appli (Cache API) — on laisse passer, y compris les requêtes Range
  if (AUDIO_RE.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const hit = await cache.match(url.href, { ignoreSearch: true });
      if (hit && !req.headers.has('range')) return hit;
      if (hit && req.headers.has('range')) {
        const buf = await hit.arrayBuffer();
        const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range'));
        const start = m && m[1] ? parseInt(m[1], 10) : 0;
        const end = m && m[2] ? Math.min(parseInt(m[2], 10), buf.byteLength - 1) : buf.byteLength - 1;
        return new Response(buf.slice(start, end + 1), {
          status: 206,
          headers: {
            'Content-Type': hit.headers.get('content-type') || 'audio/mpeg',
            'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
            'Content-Length': String(end - start + 1),
            'Accept-Ranges': 'bytes'
          }
        });
      }
      return fetch(req);
    })());
    return;
  }

  if (req.headers.has('range')) return;

  // Navigation : réseau d'abord (3,5 s), sinon la page en cache
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC);
      try {
        const res = await Promise.race([fetch(req), timeout(3500)]);
        if (res && res.ok) cache.put(self.registration.scope + 'index.html', res.clone());
        return res;
      } catch (e) {
        return (await cache.match(self.registration.scope + 'index.html', { ignoreSearch: true }))
          || (await cache.match(self.registration.scope, { ignoreSearch: true }))
          || Response.error();
      }
    })());
    return;
  }

  // Fichiers versionnés de la build : cache d'abord
  if (url.pathname.includes('/static/')) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    })());
    return;
  }

  // Le reste (images, manifest…) : cache puis mise à jour en arrière-plan
  event.respondWith((async () => {
    const cache = await caches.open(STATIC);
    const hit = await cache.match(req);
    const net = fetch(req).then((res) => { if (res.ok && res.type === 'basic') cache.put(req, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
