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

    objectManager.events.add('click', function (e) {
        // Получим id объекта по которому произошёл клик.
        var id = e.get('objectId'), geoObjects,
        // Проверим является ли объект кластером.
            isCluster = objectManager.getObjectState(id).found === false;
        // Если объект является кластером, то сохраним геообъекты внутри кластера.
        if (isCluster) {
            var cluster = objectManager.clusters.getById(id),
                geoObjects = cluster.properties.geoObjects;
        } else {
            // Если объект не является кластером, то создадим массив с единственным объектом.
            geoObjects = [objectManager.objects.getById(id)];
        }
        // Создадим массив меток, для которых данные ещё не загружены.
        geoObjects = jQuery.grep(geoObjects,
            function (geoObject) {
                return geoObject.properties.balloonContent === 'идет загрузка...';
            }
        );

        // Формируем массив идентификаторов, который будет передан серверу.
        ids = jQuery.map(geoObjects, function (geoObject) {
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
                        geoObject.properties.balloonContent = data[index].balloonContent;
                        // Оповещаем балун, что нужно применить новые данные.
                        if (isCluster) {
                            objectManager.clusters.balloon.setData(objectManager.clusters.balloon.getData());
                        } else {
                            objectManager.objects.balloon.setData(objectManager.objects.balloon.getData());
                        }
                    });
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
    });

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });
});