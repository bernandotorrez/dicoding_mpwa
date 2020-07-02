const CACHE_NAME = "porsche-car-club";
var urlsToCache = [
  "/",
  "/components/nav.html",
  "/index.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/pages/list-car.html",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v52/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/assets/images/718_boxster_s.jpg",
  "/assets/images/718_cayman_s.jpg",
  "/assets/images/911_carrera_4.jpg",
  "/assets/js/jquery-2.1.1.min.js",
  "/assets/js/materialize.min.js",
  "/assets/js/nav.js",
  "/assets/js/helper.js",
  "/assets/js/api.js",
  "/main.js",
  "/manifest.json",
  "/favicon.ico",
  "/assets/favicon/apple-touch-icon-180x180.png",
  "/assets/favicon/browserconfig.xml",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/pwa-192x192.png",
  "/assets/favicon/pwa-512x512.png",
  "/assets/favicon/tile70x70.png",
  "/assets/favicon/tile150x150.png",
  "/assets/favicon/tile310x150.png",
  "/assets/favicon/tile310x310.png",
];

self.addEventListener("fetch", function (event) {
  const base_url = 'https://api.football-data.org/v2';
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    )
  }
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

