const CACHE_NAME = 'smm-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/styles.css',
    '/script.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install Event - Cache Static Assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Network First for HTML, Cache First for Static Assets
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // For API calls or form submissions, always go to network, do not cache
    if (requestUrl.pathname.startsWith('/api') || event.request.method !== 'GET') {
        return; 
    }

    // Network First strategy
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response and save it to the cache
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache if network fails
                return caches.match(event.request);
            })
    );
});
