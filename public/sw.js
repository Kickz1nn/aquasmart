const CACHE_NAME = "aquasmart-v1";

self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/_next/")
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(async () => {
            const cachedResponse = await caches.match(event.request);

            if (cachedResponse) {
                return cachedResponse;
            }

            if (event.request.mode === "navigate") {
                const fallback = await caches.match("/");

                if (fallback) {
                    return fallback;
                }
            }

            return new Response("Recurso indisponível offline.", {
                status: 503,
                statusText: "Service Unavailable",
            });
        })
    );
});