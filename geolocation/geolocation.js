ymaps.ready(init);

function init() {
    var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [55, 34],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    /**
     * Comparing the position calculated from the user's IP address
     * and the position detected using the browser.
     */
    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
        // We'll mark the position calculated by IP in red.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'My location'
        });
        myMap.geoObjects.add(result.geoObjects);
    });
    
        geolocation.get({
provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        /**
         * We'll mark the position obtained through the browser in blue.
         * If the browser does not support this functionality, the placemark will not be added to the map.
         */
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        myMap.geoObjects.add(result.geoObjects);
    });
}
