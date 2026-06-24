/* Service worker ขั้นต่ำ — ให้ติดตั้งเป็นแอป (PWA) ได้ + network-first */
var CACHE = 'repair-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(function(){ return caches.match(e.request); })
  );
});
