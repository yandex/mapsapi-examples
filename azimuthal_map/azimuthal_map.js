ymaps.ready(['projection.AzimuthalPolarEquidistant']).then(function init() {

    var ARCTIC_LAYER_NAME = 'user#arcticLayer',
        ARCTIC_MAP_TYPE_NAME = 'Arctica',
        ARCTIC_TILES_PATH = 'images/tiles_arctic',

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
        };

    // Adding our own constructor to the layer storage.
    ymaps.layer.storage.add(ARCTIC_LAYER_NAME, ArcticLayer);

    /**
     * Creating a new type of map.
     * MAP_TYPE_NAME - The name of the new map type.
     * LAYER_NAME - The key in the layer storage or the constructor function.
     */
    var mapType = new ymaps.MapType(ARCTIC_MAP_TYPE_NAME, [ARCTIC_LAYER_NAME]);
    // Saving the type in the types storage.
    ymaps.mapType.storage.add(ARCTIC_MAP_TYPE_NAME, mapType);

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
            projection: new ymaps.projection.AzimuthalPolarEquidistant()
        }), regions;

    var regionsButton = new ymaps.control.Button({data: {content: 'Add regions'}, options: {selectOnClick: true}});
    regionsButton.events
        .add('select', function () {
            map.geoObjects.add(regions.geoObjects);
        })
        .add('deselect', function () {
            map.geoObjects.remove(regions.geoObjects);
        });

    ymaps.regions.load('001', {
            lang: 'ru'
        }).then(function (result) {
            regions = result;
            map.controls.add(regionsButton);
            regionsButton.options.set('maxWidth', 150);
        });
});
