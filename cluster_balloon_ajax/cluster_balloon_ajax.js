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
         * Функция кластеризует объекты и возвращает ссылку на кластер.
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
        // Массив меток, для которых необходимо отобразить содержимое балуна.
            geoObjects = jQuery.grep(
                typeof target.getGeoObjects === 'function'?
                    target.getGeoObjects() : [target],
                function (geoObject) {
                    return !geoObject.properties.get("balloonContentBody");
                }
            ),
        // Формируем массив идентификаторов, который
        // будет передан серверу.
            ids = jQuery.map(geoObjects, function (geoObject) {
                geoObject.properties.set('balloonContent', 'идет загрузка...');

                return geoObject.properties.get('id');
            });

        if(ids.length) {
            // Запрос к серверу.
            // Сервер обработает массив идентификаторов и на его основе
            // вернет JSON-объект, содержащий текст балуна для
            // заданных меток.
            jQuery.ajax({
                contentType: 'application/json',
                url: 'getBalloonContent.json',
                type: 'POST',
                data: JSON.stringify(ids),
                dataType: 'json',
                processData: false
            }).then(function (data) {
                jQuery.each(geoObjects, function (index, geoObject) {
                    // Содержимое балуна берем из данных, полученных от сервера.
                    // Сервер возвращает массив объектов вида:
                    // [ {"balloonContentBody": "Содержимое балуна"}, ...]
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