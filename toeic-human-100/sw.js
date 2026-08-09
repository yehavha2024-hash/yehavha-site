const CACHE = "toeic-human-100-v5-reading-v2";
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "reading-v2.css",
  "nexus-shell.css",
  "app-v2.js",
  "content.js",
  "reading-content-v2.js",
  "manifest.webmanifest",
  "images/toeic-bg.webp",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isCodeRequest(request) {
  const url = new URL(request.url);
  return request.mode === "navigate" || /\.(?:html|js|css|webmanifest)$/.test(url.pathname);
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (isCodeRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.mode === "navigate") return caches.match("index.html");
          throw new Error("offline resource unavailable");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
