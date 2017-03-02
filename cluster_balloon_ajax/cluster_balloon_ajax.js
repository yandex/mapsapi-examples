ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 4,
            controls: []
        }),
        url = 'data.json',
        geoObjects = ymaps.geoQuery(jQuery.getJSON(url))
            .applyBoundsToMap(myMap)
            .setOptions("preset", "islands#darkGreenDotIcon"),
        /**
         * The function clusters the objects and returns a reference to the cluster.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoQueryResult.xml#clusterize
          */
        clusterer = geoObjects.clusterize({
            "preset": "islands#invertedDarkGreenClusterIcons",
            "clusterDisableClickZoom": true,
            "clusterBalloonMaxHeight": 150,
            "clusterBalloonMaxWidth": 300,
            "clusterBalloonPanelMaxMapArea": 0
        });

    myMap.geoObjects.add(clusterer);
    clusterer.events.add('click', function (e) {
        var target = e.get('target'),
        // An array of placemarks for which you want to display the contents of a balloon.
            geoObjects = jQuery.grep(
                typeof target.getGeoObjects === 'function'?
                    target.getGeoObjects() : [target],
                function (geoObject) {
                    return !geoObject.properties.get("balloonContentBody");
                }
            ),
        /**
         * Forming an array of IDs that will be
         * passed to the server.
         */
            ids = jQuery.map(geoObjects, function (geoObject) {
                geoObject.properties.set('balloonContent', 'loading data...');

                return geoObject.properties.get('id');
            });

        if(ids.length) {
            /**
             * Request to the server.
             * The server will process the array of IDs and
             * return a JSON object based on it containing the balloon text
             * for the specified placemarks.
             */
            jQuery.ajax({
                contentType: 'application/json',
                url: 'getBalloonContent.json',
                type: 'POST',
                data: JSON.stringify(ids),
                dataType: 'json',
                processData: false
            }).then(function (data) {
                    jQuery.each(geoObjects, function (index, geoObject) {
                        /**
                         * The contents of the balloon is taken from data received from the server.
                         * The server returns an array of objects: 
                         * [ {"balloonContentBody": "Balloon content"}, ...]
                         */
                        geoObject.properties.set(data[index]);
                    });
                }, function (jqXHR, textStatus, errorThrown) {
                    jQuery.each(geoObjects, function (index, geoObject) {
                        geoObject.properties.set('balloonContentBody', errorThrown);
                    });
                    clusterer.events.once('balloonclose', function () {
                        jQuery.each(geoObjects, function (index, geoObject) {
                            geoObject.properties.unset('balloonContentBody');
                        });
                    });
                });
        }
    });
});
