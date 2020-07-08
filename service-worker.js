const CACHE_NAME = "england-premier";
var urlsToCache = [
  "/",
  "/components/nav.html",
  "/components/bottom-nav.html",
  "/components/detail-match-nav.html",
  "/index.html",
  "/detail-match.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/pages/home.html",
  "/pages/match.html",
  "/pages/favorite.html",
  "/pages/standings.html",
  "/pages/teams.html",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "/assets/css/icon.css",
  "https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/assets/images/default-team-badge.png",
  "/assets/js/api.js",
  "/assets/js/db.js",
  "/assets/js/detail-match.js",
  "/assets/js/helper.js",
  "/assets/js/idb.js",
  "/assets/js/jquery-2.1.1.min.js",
  "/assets/js/materialize.min.js",
  "/assets/js/nav.js",
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

function forceHttps(text) {
  return text.replace(/^http:\/\//i, 'https://');
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});


self.addEventListener("fetch", function (event) {
  const base_url = 'https://api.football-data.org/v2';
  const standing_url = 'detail-match.html?id';
  const team_url = 'detail-team.html?id';
  const image_api = forceHttps('https://upload.wikimedia.org');

  if (event.request.url.indexOf(base_url) > -1 || event.request.url.indexOf(image_api) > -1 
  || event.request.url.indexOf(standing_url) > -1 || event.request.url.indexOf(team_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
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
      caches.open(CACHE_NAME).then(function(cache) {
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

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: '/icon.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

