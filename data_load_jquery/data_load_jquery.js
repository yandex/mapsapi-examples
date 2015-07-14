ymaps.ready()
    .done(function (ym) {
        var myMap = new ym.Map('YMapsID', {
            center: [55.751574, 37.573856],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

        jQuery.getJSON('data.json', function (json) {
            /** Saving a reference to the geo objects in case any postprocessing is necessary.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoQueryResult.xml
              */
            var geoObjects = ym.geoQuery(json)
                    .addToMap(myMap)
                    .applyBoundsToMap(myMap, {
                        checkZoomRange: true
                    });
        });
    });
