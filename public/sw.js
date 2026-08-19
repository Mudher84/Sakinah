const CACHE='sakinah-v1';
const APP_SHELL=['/','/index.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 const cacheable=event.request.method==='GET'&&(u.origin===self.location.origin||u.hostname==='api.alquran.cloud'||u.hostname==='api.aladhan.com'||u.hostname==='www.mp3quran.net');
 if(!cacheable)return;
 event.respondWith(caches.match(event.request).then(hit=>{
   const network=fetch(event.request).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return res}).catch(()=>hit);
   return hit||network;
 }));
});
