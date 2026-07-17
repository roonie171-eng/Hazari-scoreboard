const CACHE_NAME='hazari-pwa-29';
const ASSETS=[
 './',
 './index.html',
 './manifest.json',
 './icon-192.png',
 './icon-512.png'
];

self.addEventListener('install',event=>{
 event.waitUntil(
   caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS))
 );
 self.skipWaiting();
});

self.addEventListener('activate',event=>{
 event.waitUntil(
   caches.keys().then(keys=>Promise.all(
     keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
   ))
 );
 self.clients.claim();
});

// Network-first: always try to get the latest file when online.
// Only fall back to the cached copy when the network request fails (offline).
self.addEventListener('fetch',event=>{
 event.respondWith(
   fetch(event.request).then(networkResp=>{
     const clone=networkResp.clone();
     caches.open(CACHE_NAME).then(cache=>cache.put(event.request,clone));
     return networkResp;
   }).catch(()=>
     caches.match(event.request).then(resp=>resp||caches.match('./index.html'))
   )
 );
});
