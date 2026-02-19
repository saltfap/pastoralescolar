const CACHE_NAME = "evangelismo-cache-v1"; 
// ↑ quando você atualizar o app, mude para v2, v3 etc

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./icons/painel.svg",
  "./icons/agenda.svg",
  "./icons/pessoas.svg",
  "./icons/registrar.svg",
  "./icons/relatorios.svg",
  "./icons/estatisticas.svg",
  "./icons/config.svg"
];


// Instalação
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Ativação
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First (evita versão antiga presa)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
