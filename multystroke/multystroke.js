ymaps.ready(init);

function init() {
    // Creating the map.
    var myMap = new ymaps.Map("map", {
            center: [55.72, 37.44],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a polyline using the GeoObject class.
    var myGeoObject = new ymaps.GeoObject({
            // Describing the geometry of the geo object.
            geometry: {
                // The "Polyline" geometry type.
                type: "LineString",
                // Specifying the coordinates of the vertices of the polyline.
                coordinates: [
                    [55.80, 37.50],
                    [55.70, 37.40]
                ]
            },
            // Defining properties of the geo object.
            properties:{
                // The contents of the hint.
                hintContent: "I'm a geo object",
                // Balloon content.
                balloonContent: "You can drag me"
            }
        }, {
            /**
             * Setting the geo object options.
             *  Enabling drag-n-drop for the polyline.
             */
            draggable: true,
            // Line color - two values
            strokeColor: ['#000',"#FFFF00"],
            // Line width - two values
            strokeWidth: [8,5]
        });

    // Creating a polyline using the Polyline auxiliary class.
    var myPolyline = new ymaps.Polyline([
            // Specifying the coordinates of the vertices of the polyline.
            [55.80, 37.50],
            [55.80, 37.40],
            [55.70, 37.50],
            [55.70, 37.40]
        ], {
            /**
             * Describing the properties of the geo object.
             *  The contents of the balloon.
             */
            balloonContent: "Polyline"
        }, {
            /**
             * Setting options for the geo object. Disabling the close button on a balloon.
             * 
             */
            balloonCloseButton: false,
            // Line color - black, white and red
            strokeColor: ["#000000","#FFF","#F00"],
            // Line width.
            strokeWidth: [9,8,1],
            // Setting the style for the third outline
            strokeStyle: [0,0,'dash']
        });

    // Adding lines to the map.
    myMap.geoObjects
        .add(myGeoObject)
        .add(myPolyline);
}
