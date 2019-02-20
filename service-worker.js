importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const BASE_URL = 'https://api.football-data.org/v2';
const RES_URL = 'https://upload.wikimedia.org/wikipedia';
const GOOGLE_FONT = 'https://fonts.googleapis.com/icon?family=Material+Icons';

workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/team.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/team.js', revision: '1' },
  { url: '/js/favorite.js', revision: '1' },
  { url: '/images/icon-192.png', revision: '1' },
  { url: '/images/icon-512.png', revision: '1' },
  { url: '/manifest.json', revision: '1' }
]);

workbox.routing.registerRoute(
  ({ url }) => new RegExp(['/js/', '/pages/'].join('|'), 'i').test(url.pathname),
  workbox.strategies.staleWhileRevalidate()
);
workbox.routing.registerRoute(
  /.*\.png/,
  workbox.strategies.cacheOnly({ cacheName: 'images' })
);
workbox.routing.registerRoute(
  ({ url }) => ['/nav.html', '/index.html', '/team.html', '/css/'].includes(url.pathname),
  workbox.strategies.cacheFirst()
);
workbox.routing.registerRoute(
  ({ url }) => new RegExp([BASE_URL, RES_URL, GOOGLE_FONT].join('|'), 'i').test(url.href),
  workbox.strategies.staleWhileRevalidate({ cacheName: 'cloud-api' })
);
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new workbox.expiration.Plugin({ maxAgeSeconds: 60 * 60 * 24 * 365 }) // 1 tahun
    ]
  })
);

self.addEventListener('push', function(event) {
  let body;

  if (event.data) body = event.data.text();
  else body = 'Push message no payload';

  const options = {
    body,
    icon: 'images/icon-192.png',
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
