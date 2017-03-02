ymaps.ready(init);

function init() {

    var myMap = new ymaps.Map('map', {
            center: [55.709243, 37.500737],
            zoom: 9,
            controls: ['zoomControl']
        }, {
            /**
             * In our example, hotspot data is available only for zooms 9 and 10.
             * For this reason, we will restrict the map's zoom range.
             */
            minZoom: 9,
            maxZoom: 10
        });

        /**
         * URL template for hotspot data.
         *  The data source will request data via a URL int he format:
         *  '.../hotspot_layer/hotspot_data/9/tile_x=1&y=2', where
         *  x, y represent the number of the tile that data is being requested for, and
         *  9 is the map zoom level.
         */
    var tileUrlTemplate = 'hotspot_data/%z/tile_x=%x&y=%y',

        /**
         * The template for the callback function that the server will wrap tile data in
         * An example of a callback function after substitution is 'testCallback_tile_x_1_y_2_z_9'.
         */
        keyTemplate = 'testCallback_tile_%c',

        /**
         * URL of the map layer tiles.
         * Example of the URL after substitution -
         * '.../hotspot_layer/images/9/tile_x=1&y=2.png'.
         */
        imgUrlTemplate = 'images/%z/tile_x=%x&y=%y.png',

        // Creating the data source for the hotpsot layer.
        objSource = new ymaps.hotspot.ObjectSource(tileUrlTemplate, keyTemplate),

        // Creating the images layer and the hotspot layer.
        imgLayer = new ymaps.Layer(imgUrlTemplate, {tileTransparent: true}),
        hotspotLayer = new ymaps.hotspot.Layer(objSource, {cursor: 'help'});

    // Adding layers to the map.
    myMap.layers.add(hotspotLayer);
    myMap.layers.add(imgLayer);
}
