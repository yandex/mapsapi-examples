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

    objectManager.objects.events.add('balloonopen', function (e) {
        // Получим объект, на котором открылся балун.
        var id = e.get('objectId'),
            geoObject = objectManager.objects.getById(id);
        // Загрузим данные для объекта при необходимости.
        downloadContent([geoObject], id);
    });

    objectManager.clusters.events.add('balloonopen', function (e) {
        // Получим id кластера, на котором открылся балун.
        var id = e.get('objectId'),
        // Получим геообъекты внутри кластера.
            cluster = objectManager.clusters.getById(id),
            geoObjects = cluster.properties.geoObjects;

        // Загрузим данные для объектов при необходимости.
        downloadContent(geoObjects, id, true);
    });

    function downloadContent(geoObjects, id, isCluster) {
        // Создадим массив меток, для которых данные ещё не загружены.
        var array = geoObjects.filter(function (geoObject) {
                    return geoObject.properties.balloonContent === 'идет загрузка...' ||
                        geoObject.properties.balloonContent === 'Not found';
                }),
        // Формируем массив идентификаторов, который будет передан серверу.
            ids = array.map(function (geoObject) {
                    return geoObject.id;
                });
        if (ids.length) {
            // Запрос к серверу.
            // Сервер обработает массив идентификаторов и на его основе
            // вернет JSON-объект, содержащий текст балуна для
            // заданных меток.
            ymaps.vow.resolve($.ajax({
                    // Обратите внимание, что серверную часть необходимо реализовать самостоятельно.
                    //contentType: 'application/json',
                    //type: 'POST',
                    //data: JSON.stringify(ids),
                    url: 'content.json',
                    dataType: 'json',
                    processData: false
                })).then(function (data) {
                        // Имитируем задержку от сервера.
                        return ymaps.vow.delay(data, 1000);
                }).then(
                    function (data) {
                        geoObjects.forEach(function (geoObject) {
                            // Содержимое балуна берем из данных, полученных от сервера.
                            // Сервер возвращает массив объектов вида:
                            // [ {"balloonContent": "Содержимое балуна"}, ...]
                            geoObject.properties.balloonContent = data[geoObject.id].balloonContent;
                        });
                        // Оповещаем балун, что нужно применить новые данные.
                        setNewData();
                    }, function () {
                        geoObjects.forEach(function (geoObject) {
                            geoObject.properties.balloonContent = 'Not found';
                        });
                        // Оповещаем балун, что нужно применить новые данные.
                        setNewData();
                    }
                );
        }

        function setNewData(){
            if (isCluster && objectManager.clusters.balloon.isOpen(id)) {
                objectManager.clusters.balloon.setData(objectManager.clusters.balloon.getData());
            } else if (objectManager.objects.balloon.isOpen(id)) {
                objectManager.objects.balloon.setData(objectManager.objects.balloon.getData());
            }
        }
    }

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });
});