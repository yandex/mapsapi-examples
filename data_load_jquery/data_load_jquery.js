ymaps.ready()
    .done(function (ym) {
        var myMap = new ym.Map('YMapsID', {
            center: [55.751574, 37.573856],
            zoom: 10
        });

        jQuery.getJSON('data.json', function (json) {
            /** Сохраним ссылку на геообъекты на случай, если понадобится какая-либо постобработка.
             * @see http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoQueryResult.xml
             */
            var geoObjects = ym.geoQuery(json)
                .addToMap(myMap)
                .applyBoundsToMap(myMap, {
                    checkZoomRange: true
                });
        });
    });