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
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "/assets/images/718_boxster_s.jpg",
  "/assets/images/718_cayman_s.jpg",
  "/assets/images/911_carrera_4.jpg",
  "/assets/js/jquery-2.1.1.min.js",
  "/assets/js/materialize.min.js",
  "/assets/js/nav.js",
  "/manifest.json",
  "/assets/favicon/apple-touch-icon.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/android-chrome-192x192.png",
  "/assets/favicon/android-chrome-384x384.png"
];

self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
          if (response) {
            console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            return response;
          }
   
          console.log(
            "ServiceWorker: Memuat aset dari server: ",
            event.request.url
          );
          return fetch(event.request);
        })
    );
  });   
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

