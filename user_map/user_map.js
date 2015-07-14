var myMap;
ymaps.ready(init);

function init () {
    // Creating a projection for the Cartesian coordinate system.
    var myProjection = new ymaps.projection.Cartesian([
            // Defining the boundaries of the display area in Cartesian coordinates.
            [-1, -1],
            [1, 1]
        ]),

    // Creating a custom map layer:
        MyLayer = function () {
            return new ymaps.Layer(
                // Defining the function that converts the tile number and zoom level to the URL of
                // the tile on the server.
                function (tile, zoom) {
                    return "https://mt.gmapuploader.com/tiles/FVSH1JsvdT/tile-" + zoom + "-" +
                        (tile[1] * Math.pow(2, zoom) + tile[0]) + ".jpg";
                }
            );
        };

    // Adding a layer constructor to the layer storage with the key my#layer.
    ymaps.layer.storage.add('my#layer', MyLayer);
    // Creating a new map type consisting only of our tile layer, and adding it to the storage for
    // map types with the key my#type.
    ymaps.mapType.storage.add('my#type', new ymaps.MapType(
        'Схема',
        ['my#layer']
    ));

    // Creating a map in the specified coordinate system.
    myMap = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 2,
        type: 'my#type',
        controls: ['zoomControl']
    }, {
        maxZoom: 4, // Максимальный коэффициент масштабирования для заданной проекции.
        minZoom: 2, // Минимальный коэффициент масштабирования.
        projection: myProjection,
        // Setting an option so the zoom control is minimal size regardless of the size of the map.
        zoomControlSize: 'small'
    });
}
