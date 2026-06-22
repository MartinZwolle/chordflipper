// Geef de bestanden op die we willen cachen
const CACHE_NAME = "chords-app-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/styles.css",
  "/app.js",
  "/metronome.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/images/ChordFlipper100.jpeg"
];

// Installeer de Service Worker en cache de opgegeven bestanden
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activeer de Service Worker en verwijder oude caches als ze bestaan
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercept netwerkverzoeken en gebruik de cache als dat mogelijk is
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
