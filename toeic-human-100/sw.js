const CACHE = "toeic-human-100-v7-full-100-days";
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "reading-v2.css",
  "teps-extension-v2.css",
  "nexus-shell.css",
  "app-v2.js",
  "teps-extension-ui-v2.js",
  "reading-content-v2-ready-rerender.js",
  "content.js",
  "reading-content-v2.js",
  "reading-content-v2-days02-04.js",
  "reading-content-v2-days05-07.js",
  "reading-content-v2-days08-10.js",
  "reading-content-v2-length-patch.js",
  "teps-extension-v2.js",
  "teps-extension-length-patch.js",
  "reading-content-v2-days11-100-builder.js",
  "master-lexicon-v2.json",
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
  return request.mode === "navigate" || /\.(?:html|js|css|webmanifest|json)$/.test(url.pathname);
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
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
