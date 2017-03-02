ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9,
            /**
             * The 'default' and 'largeMapDefaultSet' sets are also available.
             * Controls in these sets are optimally selected for small,
             * medium and large sized maps.
             */
            controls: ['smallMapDefaultSet']
        }, {
            searchControlProvider: 'yandex#search'
        });
    });
