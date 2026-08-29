const CACHE = "toeic-human-100-v14-canonical-footer";
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "reading-v2.css",
  "teps-extension-v2.css",
  "project-standard.css",
  "app-v2.js",
  "date-progress.js",
  "teps-extension-ui-v2.js",
  "reading-ready-sync.js",
  "focused-reading-ui.js",
  "content.js",
  "reading-content-v2.js",
  "reading-content-v2-days02-04.js",
  "reading-content-v2-days05-07.js",
  "reading-content-v2-days08-10.js",
  "reading-global-bridge.js",
  "reading-content-v2-days01-10-enrichment.js",
  "teps-extension-v2.js",
  "teps-extension-enrichment.js",
  "reading-content-v2-days11-100-builder.js",
  "reading-content-v2-generated-study-plan.js",
  "reading-length-normalizer.js",
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

function cacheSuccessfulResponse(request, response, event) {
  if (!response.ok) return response;
  const copy = response.clone();
  event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
  return response;
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (isCodeRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => cacheSuccessfulResponse(event.request, response, event))
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
    caches.match(event.request).then(cached => cached || fetch(event.request)
      .then(response => cacheSuccessfulResponse(event.request, response, event)))
  );
});
