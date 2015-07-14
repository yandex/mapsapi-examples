ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a polygon with no vertices.
    var myPolygon = new ymaps.Polygon([], {}, {
        // The cursor in the mode for adding new vertices.
        editorDrawingCursor: "crosshair",
        // The maximum number of vertices.
        editorMaxPoints: 5,
        // Fill color.
        fillColor: '#00FF00',
        // Stroke color.
        strokeColor: '#0000FF',
        // The stroke width.
        strokeWidth: 5
    });
    // Adding the polygon to the map.
    myMap.geoObjects.add(myPolygon);

    // In the mode for adding new vertices, we change the stroke color of the polygon.
    var stateMonitor = new ymaps.Monitor(myPolygon.editor.state);
    stateMonitor.add("drawing", function (newValue) {
        myPolygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
    });

    // Turning on the edit mode with the possibility of adding new vertices.
    myPolygon.editor.startDrawing();
}
