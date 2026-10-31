/* Service worker cho app QC (ban_do_qc.html?app=1).
   CHI xu ly cac file cua app duoi day; moi request khac (qc.html, app.html, Google Sheets…) di thang mang nhu cu.
   - Du lieu (qcdata.js, phan_bo_qc.js): MANG TRUOC, mat mang thi dung ban luu lan truoc.
   - Giao dien / anh: dung ban luu ngay, cap nhat ngam tu mang. */
var CACHE='qc-app-v1';
var VO=['ban_do_qc.html','qc_khoa.js','so_do_nha_may.webp','logo_daidung.png','app/qc.webmanifest','app/icon-192.png','app/icon-512.png','app/apple-touch-icon.png'];
var DULIEU=['qcdata.js','phan_bo_qc.js'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(VO.concat(DULIEU));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k.indexOf('qc-app-')===0;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
function ten(u){var p=new URL(u).pathname,base=new URL(self.registration.scope).pathname;return p.indexOf(base)===0?p.slice(base.length):'';}
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  var f=ten(e.request.url);
  if(DULIEU.indexOf(f)>=0){
    e.respondWith(fetch(e.request).then(function(r){if(r.ok){var c=r.clone();caches.open(CACHE).then(function(ca){ca.put(f,c);});}return r;}).catch(function(){return caches.match(f);}));return;}
  if(VO.indexOf(f)>=0){
    e.respondWith(caches.match(f).then(function(hit){var net=fetch(e.request).then(function(r){if(r.ok){var c=r.clone();caches.open(CACHE).then(function(ca){ca.put(f,c);});}return r;}).catch(function(){return hit;});return hit||net;}));}
});
