ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9,
            behaviors: ['default', 'scrollZoom']
        }, {
            searchControlProvider: 'yandex#search'
        }),
        /**
         * Creating a clusterer by calling a constructor function.
         * A list of all options is available in the documentation.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#constructor-summary
          */
            clusterer = new ymaps.Clusterer({
            /**
             * Only cluster styles can be specified via the clusterer;
             * for placemark styles, each placemark must be set separately.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage.xml
              */
            preset: 'islands#invertedVioletClusterIcons',
            /**
             * Setting to "true" if we want to cluster only points with the same coordinates.
             */
            groupByCoordinates: false,
            /**
             * Setting cluster options in the clusterer with the "cluster" prefix.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
              */
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        }),
        /**
         * The function returns an object containing the placemark data. 
         * The clusterCaption data field will appear in the list of geo objects in the cluster balloon. 
         * The balloonContentBody field is the data source for the balloon content.
         * Both fields support HTML markup. 
         * For a list of data fields that are used by the standard content layouts for 
         * geo objects' placemark icons and balloons, see the documentation.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
          */
            getPointData = function (index) {
            return {
                balloonContentHeader: '<font size=3><b><a target="_blank" href="https://yandex.ru">Your link can be here</a></b></font>',
                balloonContentBody: '<p>Your name: <input name="login"></p><p>The phone in the format 2xxx-xxx:  <input></p><p><input type="submit" value="Send"></p>',
                balloonContentFooter: '<font size=1>Information provided by: placemark </font> balloon <strong> ' + index + '</strong>',
                clusterCaption: 'placemark <strong>' + index + '</strong>'
            };
        },
        /**
         * The function returns an object containing the placemark options. 
         * All options that are supported by the geo objects can be found in the documentation.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
          */
            getPointOptions = function () {
            return {
                preset: 'islands#violetIcon'
            };
        },
        points = [
            [55.831903,37.411961], [55.763338,37.565466], [55.763338,37.565466], [55.744522,37.616378], [55.780898,37.642889], [55.793559,37.435983], [55.800584,37.675638], [55.716733,37.589988], [55.775724,37.560840], [55.822144,37.433781], [55.874170,37.669838], [55.716770,37.482338], [55.780850,37.750210], [55.810906,37.654142], [55.865386,37.713329], [55.847121,37.525797], [55.778655,37.710743], [55.623415,37.717934], [55.863193,37.737000], [55.866770,37.760113], [55.698261,37.730838], [55.633800,37.564769], [55.639996,37.539400], [55.690230,37.405853], [55.775970,37.512900], [55.775777,37.442180], [55.811814,37.440448], [55.751841,37.404853], [55.627303,37.728976], [55.816515,37.597163], [55.664352,37.689397], [55.679195,37.600961], [55.673873,37.658425], [55.681006,37.605126], [55.876327,37.431744], [55.843363,37.778445], [55.875445,37.549348], [55.662903,37.702087], [55.746099,37.434113], [55.838660,37.712326], [55.774838,37.415725], [55.871539,37.630223], [55.657037,37.571271], [55.691046,37.711026], [55.803972,37.659610], [55.616448,37.452759], [55.781329,37.442781], [55.844708,37.748870], [55.723123,37.406067], [55.858585,37.484980]
        ],
        geoObjects = [];

    /**
     * Data is passed to the placemark constructor as the second parameter, and options are third.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark.xml#constructor-summary
      */
    for(var i = 0, len = points.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i), getPointOptions());
    }

    /**
     * You can change clusterer options after creation.
     */
    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });

    /**
     * You can add a JavaScript array of placemarks (not a geo collection) or a single placemark to the clusterer.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
      */
    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);

    /**
     * Positioning the map so that all objects become visible.
     */

    myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
    });
});
