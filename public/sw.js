// Service worker minimale: rende l'app installabile, nessuna cache di dati privati.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          "<!doctype html><meta name=viewport content='width=device-width,initial-scale=1'><body style='font-family:sans-serif;background:#1c1917;color:#fff;text-align:center;padding:4rem 1rem'><h2>Sei offline</h2><p>Riconnettiti a internet per usare GentiLuna.</p></body>",
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        )
    )
  );
});
