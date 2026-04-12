const CACHE_NAME = 'f1-portal-v2'; // Incrementado para forçar atualização no hardening
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './drivers.html',
  './teams.html',
  './champions.html',
  './calendar.html',
  './404.html',
  './assets/css/style.css',
  './assets/css/animations.css',
  './assets/js/api.js',
  './assets/js/calendar.js',
  './assets/js/champions.js',
  './assets/js/drivers.js',
  './assets/js/main.js',
  './assets/js/static-data.js',
  './assets/js/teams.js',
  './assets/js/ui-utils.js',
  './assets/images/placeholder-driver.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Pre-cache imediato
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Limpa caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Estratégia Network-First para a API (com fallback para cache se offline)
  // Nota: O cache da API principal é via localStorage, mas o SW pode ajudar em assets da API
  if (url.hostname.includes('api.jolpi.ca')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Estratégia Stale-While-Revalidate para assets estáticos
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
