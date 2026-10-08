const CACHE_VERSION = "__BUILD_ID__";
const CACHE_NAME = `steavpn-${CACHE_VERSION}`;
const PRECACHE = [
  "/",
  "/pricing/",
  "/guide/",
  "/faq/",
  "/support/",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

// Only cache successful responses. Never cache errors.
function isCacheableResponse(res) {
  if (!res) return false;
  if (!res.ok) return false;                          // 4xx, 5xx
  if (res.status === 0) return false;                 // opaque/error
  if (res.type === "opaqueredirect") return false;
  if (res.type === "error") return false;
  return true;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Individually add each URL; a single failure doesn't abort the install
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(url).catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("steavpn-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();

      // Force all open tabs to reload so they get fresh HTML + new chunks
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => {
        client.postMessage({ type: "SW_UPDATED", version: CACHE_VERSION });
      });
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // HTML navigation: always fetch fresh from network first.
  // Only fall back to cache when the network truly fails (offline).
  // This prevents serving stale HTML that references old JS chunks.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req, { cache: "no-store" })
        .then((res) => {
          if (isCacheableResponse(res)) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          return caches.match(req).then(
            (cached) => cached || caches.match("/offline.html")
          );
        })
    );
    return;
  }

  // Static assets: cache first, but only cache real successes
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (isCacheableResponse(res)) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
