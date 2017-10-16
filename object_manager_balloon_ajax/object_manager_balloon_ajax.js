ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 10,
            controls: []
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            clusterDisableClickZoom: true
        });
    myMap.geoObjects.add(objectManager);

    objectManager.objects.events.add('click', function (e) {
        // Получим объект по которому произошёл клик.
        var id = e.get('objectId'),
            geoObject = objectManager.objects.getById(id);
        // Загрузим данные для объекта при необходимости.
        downloadContent([geoObject], id);
    });

    objectManager.clusters.events.add('click', function (e) {
        // Получим id кластера по которому произошёл клик.
        var id = e.get('objectId'),
        // Получим геообъекты внутри кластера.
            cluster = objectManager.clusters.getById(id),
            geoObjects = cluster.properties.geoObjects;

        // Загрузим данные для объектов при необходимости.
        downloadContent(geoObjects, id, true);
    });

    function downloadContent(geoObjects, id, isCluster) {
        // Создадим массив меток, для которых данные ещё не загружены.
        var array = jQuery.grep(geoObjects,
                function (geoObject) {
                    return geoObject.properties.balloonContent === 'идет загрузка...';
                }
            ),
        // Формируем массив идентификаторов, который будет передан серверу.
            ids = jQuery.map(array, function (geoObject) {
                return geoObject.id;
            });
        if (ids.length) {
            // Запрос к серверу.
            // Сервер обработает массив идентификаторов и на его основе
            // вернет JSON-объект, содержащий текст балуна для
            // заданных меток.
            $.ajax({
                contentType: 'application/json',
                url: 'getBalloonContent.json',
                type: 'POST',
                data: JSON.stringify(ids),
                dataType: 'json',
                processData: false
            }).then(function (data) {
                // Имитируем задержку от сервера.
                window.setTimeout(function () {
                    jQuery.each(geoObjects, function (index, geoObject) {
                        // Содержимое балуна берем из данных, полученных от сервера.
                        // Сервер возвращает массив объектов вида:
                        // [ {"balloonContent": "Содержимое балуна"}, ...]
                        geoObject.properties.balloonContent = data[geoObject.id].balloonContent;
                    });
                    // Оповещаем балун, что нужно применить новые данные.
                    if (isCluster && objectManager.clusters.balloon.isOpen(id)) {
                        objectManager.clusters.balloon.setData(objectManager.clusters.balloon.getData());
                    } else if (objectManager.objects.balloon.isOpen(id)) {
                        objectManager.objects.balloon.setData(objectManager.objects.balloon.getData());

                    }
                }, 1000)
            }, function (jqXHR, textStatus, errorThrown) {
                jQuery.each(geoObjects, function (index, geoObject) {
                    geoObject.properties.balloonContent = errorThrown;
                });
                clusterer.events.once('balloonclose', function () {
                    jQuery.each(geoObjects, function (index, geoObject) {
                        geoObject.properties.balloonContent = '';
                    });
                });
            });
        }
    }

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });
});