ymaps.ready(init);

var myMap,
    bigMap = false;

function init () {
    myMap = new ymaps.Map('map', {
        center: [55.755768, 37.617671],
        zoom: 10
    }, {
        /**
         * For complex rebuilds, we can set automatic updates to the map
         * when the container is resized.
         * For simple changes to the size of the container, we recommend updating the map programmatically.
         * autoFitToViewport: 'always'
         */
        searchControlProvider: 'yandex#search'
    });
    $('#toggler').click(toggle);
}

function toggle () {
    bigMap = !bigMap;

    /**
     * Adding/removing a CSS class that defines the dimensions of the map container
     * in absolute units (300x200 px).
     */
    if (bigMap) {
        $('#map').removeClass('smallMap');
    } else {
        $('#map').addClass('smallMap');
    }

    /**
     * If set, we tell the map that it should match its dimensions
     * to the dimensions of the container.
     */
    if ($('#checkbox').prop('checked')) {
        myMap.container.fitToViewport();
    }
}
