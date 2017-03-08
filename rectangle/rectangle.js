ymaps.ready(init);
var myMap, myGeoObject, myRectangle;

function init () {
    myMap = new ymaps.Map('map', {
        center: [55.674, 37.601],
        zoom: 11
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Creating a geo object with the "rectangle" geometry type.
    myGeoObject = new ymaps.GeoObject({
        // Geometry = geometry type + the coordinates of the geo object.
        geometry: {
            // The geometry type is rectangle.
            type: 'Rectangle',
            // The coordinates.
            coordinates: [
                [55.665, 37.66],
                [55.64, 37.53]
            ]
        },
        // Properties.
        properties: {
            hintContent: 'Drag me!',
            balloonContent: 'Rectangle 2'
        }
    }, {
        /**
         * Options.
         *  The object can be dragged.
         */
        draggable: true,
        // The fill color and transparency.
        fillColor: '#ffff0022',
        // The color and transparency of borders.
        strokeColor: '#3caa3c88',
        // Line width.
        strokeWidth: 7
    });

    // Creating a rectangle using an auxiliary class.
    myRectangle = new ymaps.Rectangle([
        // Setting the coordinates of the diagonal corners of the rectangle.
        [55.66, 37.60],
        [55.71, 37.69]
    ], {
        //Properties
        hintContent: "You can't drag me!",
        balloonContent: 'Rectangle 1'
    }, {
        /**
         * Options.
         *  The fill color and transparency.
         */
        fillColor: '#7df9ff33',
        /**
         * Additional fill transparency.
         *  The resulting transparency will not be #33(0.2), but 0.1(0.2*0.5).
         */
        fillOpacity: 0.5,
        // Stroke color.
        strokeColor: '#0000FF',
        // Stroke transparency.
        strokeOpacity: 0.5,
        // Line width.
        strokeWidth: 2,
        /**
         * The radius of rounded corners.
         *  This option is accepted only for a rectangle.
         */
        borderRadius: 6
    });

    myMap.geoObjects
        .add(myRectangle)
        .add(myGeoObject);
}
