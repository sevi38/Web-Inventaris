/* =========================================
   SERVICE WORKER
   PWA INVENTARIS RUANGAN
========================================= */


/* Nama cache */

const CACHE_NAME =
    "inventaris-pwa-v1";


/* File yang akan disimpan ke cache */

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];


/* =========================================
   INSTALL
========================================= */

self.addEventListener(
    "install",
    event => {

        console.log(
            "Service Worker: Install"
        );


        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(
                cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );


        self.skipWaiting();

    }
);


/* =========================================
   ACTIVATE
========================================= */

self.addEventListener(
    "activate",
    event => {

        console.log(
            "Service Worker: Activate"
        );


        event.waitUntil(

            caches.keys()

                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .map(
                                    cacheName => {

                                        if (
                                            cacheName !==
                                            CACHE_NAME
                                        ) {

                                            return caches.delete(
                                                cacheName
                                            );

                                        }

                                    }
                                )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


/* =========================================
   FETCH
========================================= */

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(
                cachedResponse => {

                    /*
                        Jika ada di cache,
                        gunakan cache.
                    */

                    if (
                        cachedResponse
                    ) {

                        return cachedResponse;

                    }


                    /*
                        Jika tidak ada,
                        ambil dari internet.
                    */

                    return fetch(
                        event.request
                    );

                }
            )

        );

    }
);
