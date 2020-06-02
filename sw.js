let staticCacheName = 'restaurant-static-v1';

/*Install Service worker and cache all pages and assets required for offline access*/

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				'./',
				'./index.html',
				'./restaurant.html',
				'./css/styles.css',
				'./data/restaurants.json',
				'./js/dbhelper.js',
				'./js/main.js',
				'./js/restaurant_info.js',
				'./js/sw_register.js',
				'./img/1.jpg',
				'./img/2.jpg',
				'./img/3.jpg',
				'./img/4.jpg',
				'./img/5.jpg',
				'./img/6.jpg',
				'./img/7.jpg',
				'./img/8.jpg',
				'./img/9.jpg',
				'./img/10.jpg',
				'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
			]);
		})
	);
});


/*Activate Service worker and delete old cache (if any) add new cache*/

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('restaurant-') &&
						   cacheName != staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
})

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
  	return response ||
    caches.open(staticCacheName).then(function(cache) {
      return fetch(event.request).then(function(response) {
      	/**
     * If we have a matching response, we return the cached value, otherwise we return
     * the result of a call to fetch, which will make a network request and return the
     * data**/
        if (response.status === 404) {
          console.log("Page not found.");
          return new Response("Page not found.")
        }
        /**
         * If we want to cache new requests cumulatively, we can do so by handling the response
         * of the fetch request and then adding it to the cache, like below.
         * Below code will cache the visited restaurant page
         */
        if(event.request.url.indexOf('restaurant.html') != -1 || event.request.url.indexOf('leaflet') != -1){
          cache.put(event.request, response.clone());
        }
        return response;
      });
    });
    }).catch(function() {
      // If both(cache miss and n/w fetch) fail, show a generic fallback:
      return new Response("You seems to be offline, and there are no old cache for the URL.")
  })
  );
});

/**
 * listen for the "message" event, and call
 * skipWaiting if you get the appropriate message
 */
self.addEventListener('message', function(event) {
  if (event.data) {
    console.log('Messgae received:' + event.data);
    self.skipWaiting();
  }
});
