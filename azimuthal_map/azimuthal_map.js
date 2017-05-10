ymaps.ready(['projection.AzimuthalPolarEquidistant']).then(function init() {

    var ARCTIC_LAYER_NAME = 'user#arcticLayer',
        ARCTIC_MAP_TYPE_NAME = 'Arctic',
        ARCTIC_TILES_PATH = 'images/tiles_arctic',
        ARCTIC_PROJECTION = new ymaps.projection.AzimuthalPolarEquidistant(),
        ANTARCTIC_LAYER_NAME = 'user#antarcticLayer',
        ANTARCTIC_MAP_TYPE_NAME = 'Antarctica',
        ANTARCTIC_TILES_PATH = 'images/tiles_antarctic',
        ANTARCTIC_PROJECTION = new ymaps.projection.AzimuthalPolarEquidistant(undefined, 4.1583333333333, 0, true),

        /**
         * A constructor that creates its own layer.
         */
        ArcticLayer = function () {
            var layer = new ymaps.Layer(ARCTIC_TILES_PATH + '/%z/tile-%x-%y.jpg', {
                    // If the tile didn't load, we display this image.
                    notFoundTile: ARCTIC_TILES_PATH + '/3/tile-0-0.jpg'
                });
            // Specifying the range of zoom levels available for this layer.
            layer.getZoomRange = function () {
                return ymaps.vow.resolve([0, 3]);
            };
            return layer;
        },
        AntarcticLayer = function () {
            var layer = new ymaps.Layer(ANTARCTIC_TILES_PATH + '/%z/tile-%x-%y.jpg', {
                // If the tile didn't load, we display this image.
                notFoundTile: ANTARCTIC_TILES_PATH + '/3/tile-0-0.jpg'
            });
            // Specifying the range of zoom levels available for this layer.
            layer.getZoomRange = function () {
                return ymaps.vow.resolve([0, 4]);
            };
            return layer;
        };

    // Adding our own constructor to the layer storage.
    ymaps.layer.storage
        .add(ARCTIC_LAYER_NAME, ArcticLayer)
        .add(ANTARCTIC_LAYER_NAME, AntarcticLayer);

    /**
     * Creating a new type of map.
     * MAP_TYPE_NAME - The name of the new map type.
     * LAYER_NAME - The key in the layer storage or the constructor function.
     */
    var mapTypeArctic = new ymaps.MapType(ARCTIC_MAP_TYPE_NAME, [ARCTIC_LAYER_NAME]),
        mapTypeAntarctic = new ymaps.MapType(ANTARCTIC_MAP_TYPE_NAME, [ANTARCTIC_LAYER_NAME]);
    // Saving the type in the types storage.
    ymaps.mapType.storage
        .add(ARCTIC_MAP_TYPE_NAME, mapTypeArctic)
        .add(ANTARCTIC_MAP_TYPE_NAME, mapTypeAntarctic);

    /**
     * Creating a map and specifying a new map type.
     */
    var map = new ymaps.Map('map', {
            center: [90, 0],
            zoom: 1,
            controls: ["searchControl", "rulerControl"],
            type: ARCTIC_MAP_TYPE_NAME
        }, {
            // Defining the azimuth projection.
            projection: ARCTIC_PROJECTION
        }), regions;

    var regionsButton = new ymaps.control.Button({
            data: {content: 'Add regions'},
            options: {selectOnClick: true, maxWidth: 150}
        });
    regionsButton.events
        .add('select', function () {
            map.geoObjects.add(regions.geoObjects);
        })
        .add('deselect', function () {
            map.geoObjects.remove(regions.geoObjects);
        });

    var typeButton = new ymaps.control.Button({
            data: {content: 'Antarctica'},
            options: {selectOnClick: true, maxWidth: 150}
        });
    typeButton.events
        .add('select', function () {
            map.setType(ANTARCTIC_MAP_TYPE_NAME);
            map.options.set("projection", ANTARCTIC_PROJECTION);
            typeButton.data.set("content", "Arctic");
        })
        .add('deselect', function () {
            map.setType(ARCTIC_MAP_TYPE_NAME);
            map.options.set("projection", ARCTIC_PROJECTION);
            typeButton.data.set("content", "Antarctica");
        });
    map.controls.add(typeButton);
    ymaps.regions.load('001', {
            lang: 'ru'
        }).then(function (result) {
            regions = result;
            map.controls.add(regionsButton);
        });
});
