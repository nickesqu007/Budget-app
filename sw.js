const CACHE_VERSION = 'v1.4.6';
const CACHE_NAME = 'budget-cache-' + CACHE_VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k=>k.startsWith('budget-cache-') && k!==CACHE_NAME)
        .map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((res)=>{
        if (event.request.method === 'GET' && new URL(event.request.url).origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c=>c.put(event.request, clone));
        }
        return res;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});
