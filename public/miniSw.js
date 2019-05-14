const cacheName = "v1";
const cacheAssets = [];

self.addEventListener("install", e => {
  console.log("Service Worker Installed")

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(cacheAssets)
      })
      .then(() => self.skipWaiting())

  )
})

self.addEventListener("activate", e => {
  console.log("Service Worker Activated")

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Cleaning old cache")
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

self.addEventListener("fetch", e => {
  console.log("Fetching")
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone()

        caches
          .open(cacheName)
          .then(cache => {
            cache.put(e.request, resClone)
          })

          return res
      })
      .catch(err => caches.match(e.request).then(res => res))
  )
})
