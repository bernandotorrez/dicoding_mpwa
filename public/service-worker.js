/* eslint-disable no-undef */
// /* eslint-disable no-trailing-spaces */
// const CACHE_NAME = 'england-premier';
// var urlsToCache = [
//   '/',
//   '/components/bottom-nav.html',
//   '/components/detail-match-nav.html',
//   '/components/nav.html',
//   '/index.html',
//   '/detail-match.html',
//   '/detail-team.html',
//   '/pages/about.html',
//   '/pages/contact.html',
//   '/pages/favorite.html',
//   '/pages/home.html',
//   '/pages/match.html',
//   '/pages/one-team.html',
//   '/pages/standings.html',
//   '/pages/teams.html',
//   '/assets/css/icon.css',
//   '/assets/css/materialize.min.css',
//   '/assets/css/style.css',
//   'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
//   '/assets/images/default-team-badge.png',
//   '/assets/js/api.js',
//   '/assets/js/db.js',
//   '/assets/js/detail-match.js',
//   '/assets/js/detail-team.js',
//   '/assets/js/helper.js',
//   '/assets/js/idb.js',
//   '/assets/js/jquery-2.1.1.min.js',
//   '/assets/js/materialize.min.js',
//   '/assets/js/nav.js',
//   '/main.js',
//   '/push.js',
//   '/manifest.json',
//   '/favicon.ico',
//   '/icon.jpg',
//   '/assets/favicon/apple-touch-icon-180x180.png',
//   '/assets/favicon/browserconfig.xml',
//   '/assets/favicon/favicon-16x16.png',
//   '/assets/favicon/favicon-32x32.png',
//   '/assets/favicon/pwa-192x192.png',
//   '/assets/favicon/pwa-512x512.png',
//   '/assets/favicon/tile70x70.png',
//   '/assets/favicon/tile150x150.png',
//   '/assets/favicon/tile310x150.png',
//   '/assets/favicon/tile310x310.png'
// ];

// function forceHttps(text) {
//   return text.replace(/^http:\/\//i, 'https://');
// }

// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   const baseUrl = 'https://api.football-data.org/v2';
//   const standingUrl = 'detail-match.html?id';
//   const teamUrl = 'detail-team.html?id';
//   const imageApi = forceHttps('https://upload.wikimedia.org');

//   if (event.request.url.indexOf(baseUrl) > -1 || event.request.url.indexOf(imageApi) > -1 || event.request.url.indexOf(standingUrl) > -1 || event.request.url.indexOf(teamUrl) > -1) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function(cache) {
//         return cache.match(event.request).then(function(response) {
//           var fetchPromise = fetch(event.request).then(function(networkResponse) {
//             cache.put(event.request.url, networkResponse.clone());
//             return networkResponse;
//           });
//           return response || fetchPromise;
//         });
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function(cache) {
//         return cache.match(event.request).then(function(response) {
//           var fetchPromise = fetch(event.request).then(function(networkResponse) {
//             return networkResponse;
//           });
//           return response || fetchPromise;
//         });
//       })
//     );
//   }
// });

// self.addEventListener('push', function(event) {
//   var body;
//   if (event.data) {
//     body = event.data.text();
//   } else {
//     body = 'Push message no payload';
//   }
//   var options = {
//     body: body,
//     icon: '/icon.jpg',
//     vibrate: [100, 50, 100],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: 1
//     }
//   };
//   event.waitUntil(
//     self.registration.showNotification('Push Notification', options)
//   );
// });

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
if (workbox) {
  console.log('Workbox loaded!');
} else {
  console.log('Workbox failed to load');
}

workbox.precaching.precacheAndRoute([
  '/manifest.json',
  '/favicon.ico',
  '/icon.jpg',
  '/assets/favicon/apple-touch-icon-180x180.png',
  '/assets/favicon/browserconfig.xml',
  '/assets/favicon/favicon-16x16.png',
  '/assets/favicon/favicon-32x32.png',
  '/assets/favicon/pwa-192x192.png',
  '/assets/favicon/pwa-512x512.png',
  '/assets/favicon/tile70x70.png',
  '/assets/favicon/tile150x150.png',
  '/assets/favicon/tile310x150.png',
  '/assets/favicon/tile310x310.png',
  '/assets/images/default-team-badge.png',
  {
    url: '/index.html',
    revision: '1'
  },
  {
    url: '/components/bottom-nav.html',
    revision: '1'
  },
  {
    url: '/components/detail-match-nav.html',
    revision: '1'
  },
  {
    url: '/components/nav.html',
    revision: '1'
  },
  {
    url: '/detail-match.html',
    revision: '1'
  },
  {
    url: '/detail-team.html',
    revision: '1'
  }
]);

workbox.routing.registerRoute(
  /\/pages\//g,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'epl-pages-cache'
  })
);

workbox.routing.registerRoute(
  /\/detail-match.html/g,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'epl-pages-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/detail-team.html/g,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'epl-pages-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:css|js|png|jpg|svg|gif)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'epl-assets-cache'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'epl-data-cache'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'epl-data-cache'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'epl-assets-cache'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'epl-assets-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
);

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
    self.registration.showNotification('England Premier League', options)
  );
});
