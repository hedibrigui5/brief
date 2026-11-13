const CACHE = 'brief-v11';
const CORE = ['./', 'index.html', 'study.json', 'sat.json', 'brief.enc', 'defaults.enc', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'hero-poster.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (/\.mp4$/.test(u.pathname)) return;
  if (u.origin === location.origin) {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const copy = res.clone(); const key = new Request(u.origin + u.pathname); caches.open(CACHE).then(c => c.put(key, copy)); } return res; })
      .catch(() => caches.match(new Request(u.origin + u.pathname)).then(m => m || caches.match('index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res; })));
  }
});
