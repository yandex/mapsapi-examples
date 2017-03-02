ymaps.ready(init);

function init() {
    // Creating the map.
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a circle.
    var myCircle = new ymaps.Circle([
        // The coordinates of the center of the circle.
        [55.76, 37.60],
        // The radius of the circle in meters.
        10000
    ], {
        /**
         * Describing the properties of the circle.
         * The contents of the balloon.
         */
        balloonContent: "The radius of the circle is 10 km",
 The contents of the hint.
        hintContent: "Move me"
    }, {
        /**
         * Setting the circle options.
         * Enabling drag-n-drop for the circle.
         */
        draggable: true,
        /**
         * Fill color.
         * The last byte (77) defines transparency.
         * The transparency of the fill can also be set using the option "fillOpacity".
         */
        fillColor: "#DB709377",
        // Stroke color.
        strokeColor: "#990066",
        // Stroke transparency.
        strokeOpacity: 0.8,
        // The width of the stroke in pixels.
        strokeWidth: 5
    });

    // Adding the circle to the map.
    myMap.geoObjects.add(myCircle);
}
