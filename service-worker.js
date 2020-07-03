const ASSETS_CACHE_NAME = 'football-assets-cache';
const PAGE_CACHE_NAME = 'football-page-cache';
const API_CACHE_NAME = 'football-api-cache';
const assetCache = [
  "/",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "/assets/css/icon.css",
  "/assets/css/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/assets/js/jquery-2.1.1.min.js",
  "/assets/js/materialize.min.js",
  "/assets/js/nav.js",
  "/assets/js/api.js",
  "/assets/images/default-team-badge.png",
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

const pageCache = [
  "/index.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/pages/standings.html",
  "/pages/teams.html",
  "/pages/favorite.html",
  "/components/nav.html",
  "/components/bottom-nav.html",
]

function forceHttps(text) {
  return text.replace(/^http:\/\//i, 'https://');
}

self.addEventListener("fetch", function (event) {
  const base_url = 'https://api.football-data.org/v2';
  const image_api = forceHttps('https://upload.wikimedia.org');
  if (event.request.url.indexOf(base_url) > -1 || event.request.url.indexOf(image_api) > -1) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request.url, networkResponse.clone());
            return networkResponse;
          })
          return response || fetchPromise;
        })
      })
    );
  } else {
    event.respondWith(
      caches.open(ASSETS_CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            return networkResponse;
          })
          return response || fetchPromise;
        })
      })
    );
  }
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(ASSETS_CACHE_NAME).then(function (cache) {
      return cache.addAll(assetCache);
    })
  );

  event.waitUntil(
    caches.open(PAGE_CACHE_NAME).then(function (cache) {
      return cache.addAll(pageCache);
    })
  );
});

