const CACHE_NAME = 'f1-portal-v13';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './drivers.html',
  './teams.html',
  './champions.html',
  './calendar.html',
  './404.html',
  './assets/css/styles-v7.css',
  './assets/css/animations.css',
  './assets/js/api.js',
  './assets/js/calendar.js',
  './assets/js/champions.js',
  './assets/js/drivers-v10.js',
  './assets/js/main-v10.js',
  './assets/js/static-data.js',
  './assets/js/teams-v10.js',
  './assets/js/ui-utils.js',
  './assets/images/placeholder-driver.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora chamadas que não sejam GET
  if (event.request.method !== 'GET') return;
  
  // Ignora chamadas à API, o cache da API é gerido pelo localStorage no api.js
  if (event.request.url.includes('api.jolpi.ca')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se encontrar, senão faz fetch na rede e adiciona ao cache
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Fallback para página offline ou index se a navegação falhar e estiver sem rede
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});