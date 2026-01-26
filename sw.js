const CACHE="fitness-plan-v4-15-30";
const ASSETS=[
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/przysiady.png",
  "./images/sklony.png",
  "./images/brzuszki.png",
  "./images/plank.png",
  "./images/pompki.png",
  "./images/unoszenie.png",
  "./images/skosne.png",
  "./images/pajacyki.png",
  "./images/climbers.png",
  "./images/marsz.png",
  "./images/stretch.png",
  "./images/spacer.png",
  "./images/abwheel.png",
  "./images/legraise.png",
  "./images/hollow.png",
  "./images/sideplank.png",
  "./images/russian.png",
  "./images/jacks.png"
];

self.addEventListener("install",(e)=>{
  e.waitUntil(caches.open(CACHE).then((c)=>c.addAll(ASSETS)));
});

self.addEventListener("activate",(e)=>{
  e.waitUntil(
    caches.keys().then((keys)=>Promise.all(keys.filter((k)=>k!==CACHE).map((k)=>caches.delete(k))))
  );
});

self.addEventListener("fetch",(e)=>{
  e.respondWith(
    caches.match(e.request).then((r)=>r||fetch(e.request).catch(()=>caches.match("./index.html")))
  );
});
