ymaps.ready(init);

var myMap;

function init () {
    // Map parameters can be set in the constructor.
    myMap = new ymaps.Map(
        // The ID of the DOM element that the map will be added to.
        'map',
        // Map parameters.
        {
            // Geographical coordinates of the center of the displayed map.
            center: [55.76, 37.64],
            // Scale.
            zoom: 10,
            // Type of map coverage: "Satellite".
            type: 'yandex#satellite'
        }, {
            // Searching for organizations.
            searchControlProvider: 'yandex#search'
        }
    );
}

function setCenter () {
    myMap.setCenter([57.767265, 40.925358]);
}

function setBounds () {
    /**
     * Bounds - the boundaries of the map viewport. 
     * Set as the geographical coordinates of the South-Easternmost
and North-Westernmost points of the viewport.
     */
    myMap.setBounds([[37, 38], [39, 40]]);
}

function setTypeAndPan () {
    // Changing the map type to "Hybrid".
    myMap.setType('yandex#hybrid');
    // Smoothly moving the center of the map to the point with the new coordinates.
    myMap.panTo([62.915, 34.461], {
            // The delay between movements.
            delay: 1500
        });
}
