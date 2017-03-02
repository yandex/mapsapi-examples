ymaps.ready(function () {

    var LAYER_NAME = 'user#layer',
        MAP_TYPE_NAME = 'user#customMap',
        TILES_PATH = 'images/tiles'; // The directory containing tiles.

    /**
     * A constructor that creates its own layer.
     */
    var Layer = function () {
        var layer = new ymaps.Layer(TILES_PATH + '/%z/%x-%y.jpeg', {
                // If the tile didn't load, we display this image.
                notFoundTile: TILES_PATH + '/2/0-0.jpeg'
            });
        // Specifying the range of zoom levels available for this layer.
        layer.getZoomRange = function () {
            return ymaps.vow.resolve([1, 3]);
        };
        // Adding our own copyright info.
        layer.getCopyrights = function () {
            return ymaps.vow.resolve('©');
        };
        return layer;
    };
    // Adding our own constructor to the layer storage.
    ymaps.layer.storage.add(LAYER_NAME, Layer);

    /**
     * Creating a new type of map.
     * MAP_TYPE_NAME - The name of the new map type.
     * LAYER_NAME - The key in the layer storage or the constructor function.
     */
    var mapType = new ymaps.MapType(MAP_TYPE_NAME, [LAYER_NAME]);
    // Saving the type in the types storage.
    ymaps.mapType.storage.add(MAP_TYPE_NAME, mapType);

    /**
     * Creating a map and specifying a new map type.
     */
    var map = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 1,
        controls: ['zoomControl'],
        type: MAP_TYPE_NAME
    }, {
        // Setting the Cartesian projection.
        projection: new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false])
    });

});
