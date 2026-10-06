// STEA VPN service worker — cache-busted per build
const CACHE_VERSION = "muwhbeqf-57bdfecd";
const CACHE_NAME = `steavpn-${CACHE_VERSION}`;
const PRECACHE = ["/", "/pricing/", "/guide/", "/faq/", "/support/", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k.startsWith("steavpn-"))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never handle cross-origin or API requests
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // HTML navigation — network first, cache fallback
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  // Static assets (_next/*, images, fonts) — cache first
  if (
    url.pathname.startsWith("/_next/") ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|css|js)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // Everything else — network first
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
