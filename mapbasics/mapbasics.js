var myMap;

// Waiting for the API to load and DOM to be ready.
ymaps.ready(init);

function init () {
    /**
     * Creating an instance of the map and binding it to the container
     * with the specified ID ("map").
     */
    myMap = new ymaps.Map('map', {
        /**
         * When initializing the map, you must specify
         * its center and the zoom factor.
         */
        center: [55.76, 37.64], // Moscow
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    document.getElementById('destroyButton').onclick = function () {
        // To destroy it, the "destroy" method is used.
        myMap.destroy();
    };

}
