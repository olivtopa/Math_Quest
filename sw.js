const CACHE_NAME = 'math-quest-v4';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// Installation : Mise en cache des fichiers de base
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force le SW en attente à s'installer immédiatement
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Rend le SW actif immédiatement pour tous les onglets ouverts
    })
  );
});

// Stratégie de Fetch : Cache d'abord, sinon Réseau
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
