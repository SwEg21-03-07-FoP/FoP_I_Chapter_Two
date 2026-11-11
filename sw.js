const CACHE_NAME = 'course-workspace-v1';

// Pre-cache the main page and all 4 iframe pages immediately
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Chapter_One_Lecture_Note.html',
  './Flowchart_Practice_Exercises.html',
  './Exercises_Solution.html',
  './Revision_Quiz_MCQ.html'
];

// 1. Install: Download and cache all pages upfront
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate: Clean up old caches when you update CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Fetch: Serve cached files first, or fetch from network and save dynamically
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
