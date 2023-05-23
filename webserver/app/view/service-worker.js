// use self instead of window in service worker
self.addEventListener('install', (event) => {
    // Perform some task
});

self.addEventListener('activate', (event) => {
    // Perform some task
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
