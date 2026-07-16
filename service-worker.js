const CACHE_NAME='hazari-pwa-28';
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

self.addEventListener('fetch',event=>{
 event.respondWith(
   caches.match(event.request).then(resp=>{
     return resp || fetch(event.request).then(networkResp=>{
       const clone=networkResp.clone();
       caches.open(CACHE_NAME).then(cache=>cache.put(event.request,clone));
       return networkResp;
     }).catch(()=>caches.match('./index.html'));
   })
 );
});
