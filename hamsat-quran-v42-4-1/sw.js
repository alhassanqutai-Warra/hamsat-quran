const CACHE_NAME = 'hamsat-quran-v42-4-1';
const AUDIO_CACHE = 'hamsat-audio-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/logo.png',
  '/manifest.json',
  '/css/main.css',
  '/css/reader.css',
  '/css/settings.css',
  '/css/home.css',
  '/css/components.css',
  '/css/splash.css',
  '/css/auth.css',
  '/css/social.css',
  '/css/audio.css',
  '/css/ayah-menu.css',
  '/css/responsive.css',
  '/css/themes.css',
  '/css/worship.css',
  '/css/data-loader.css',
  '/css/misbaha.css',
  '/js/data-loader.js',
  '/js/data.js',
  '/js/helpers.js',
  '/js/i18n.js',
  '/js/i18n-settings.js',
  '/js/ui.js',
  '/js/tafsir.js',
  '/js/tafsir-fix.js',
  '/js/tafsir-offline.js',
  '/js/prayer.js',
  '/js/quran.js',
  '/js/audio.js',
  '/js/ayah-menu.js',
  '/js/adhkar.js',
  '/js/analytics.js',
  '/js/settings.js',
  '/js/settings-accordion.js',
  '/js/auth.js',
  '/js/quran-fix.js',
  '/js/auth-fix.js',
  '/js/misbaha-upgrade.js',
  '/js/misbaha-realistic.js',
  '/js/misbaha-stats.js',
  '/js/feature-status.js',
  '/js/legal.js',
  '/data/quran-uthmani.json',
  '/data/en-sahih.json',
  '/data/page-mapping.json',
  '/data/juz-mapping.json',
  '/js/social.js',
  '/js/ahzab-data.js',
  '/js/worship.js',
  '/js/app.js',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== AUDIO_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // EveryAyah audio: cache-first for offline playback
  if (url.includes('everyayah.com/data/')) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      ).catch(() => new Response('', { status: 404 }))
    );
    return;
  }
  
  // Network-first strategy (always get fresh content)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('/index.html')))
  );
});
