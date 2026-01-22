const CACHE_NAME = "frc-admin-v1";

const FILES_TO_CACHE = [
  "/",                     // VERY IMPORTANT
  "/index.html",
  "/manifest.json",
  "/css/style.css",         // change if name differs
  "/css/admin.css",         // only if this file EXISTS
  "/js/app.js",
  "/js/admin.js"            // only if this file EXISTS
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
