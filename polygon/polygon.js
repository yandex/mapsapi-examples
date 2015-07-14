ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a polygon using the GeoObject class.
    var myGeoObject = new ymaps.GeoObject({
        // Describing the geometry of the geo object.
        geometry: {
            // The "Polygon" geometry type.
            type: "Polygon",
            // Specifying the coordinates of the vertices of the polygon.
            coordinates: [
                // The coordinates of the vertices of the external contour.
                [
                    [55.75, 37.80],
                    [55.80, 37.90],
                    [55.75, 38.00],
                    [55.70, 38.00],
                    [55.70, 37.80]
                ],
                // The coordinates of the vertices of the inner contour.
                [
                    [55.75, 37.82],
                    [55.75, 37.98],
                    [55.65, 37.90]
                ]
            ],
            // Setting the fill rule for internal contours using the "nonZero" algorithm.
            fillRule: "nonZero"
        },
        // Defining properties of the geo object.
        properties:{
            // The contents of the balloon.
            balloonContent: "Многоугольник"
        }
    }, {
        // Describing the geo object options. Fill color.
        fillColor: '#00FF00',
        // Stroke color.
        strokeColor: '#0000FF',
        // The overall transparency (for both fill and stroke).
        opacity: 0.5,
        // The stroke width.
        strokeWidth: 5,
        // The stroke style.
        strokeStyle: 'shortdash'
    });

    // Adding the polygon to the map.
    myMap.geoObjects.add(myGeoObject);

    // Creating a polygon using the Polygon auxiliary class.
    var myPolygon = new ymaps.Polygon([
        // Specifying the coordinates of the vertices of the polygon. The coordinates of the
        // vertices of the external contour.
        [
            [55.75, 37.50],
            [55.80, 37.60],
            [55.75, 37.70],
            [55.70, 37.70],
            [55.70, 37.50]
        ],
        // The coordinates of the vertices of the inner contour.
        [
            [55.75, 37.52],
            [55.75, 37.68],
            [55.65, 37.60]
        ]
    ], {
        // Describing the properties of the geo object. The contents of the balloon.
        hintContent: "Многоугольник"
    }, {
        // Setting geo object options. Fill color.
        fillColor: '#00FF0088',
        // The stroke width.
        strokeWidth: 5
    });

    // Adding the polygon to the map.
    myMap.geoObjects.add(myPolygon);
}
