ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true
        });

    myMap.geoObjects.add(objectManager);

    $.ajax({
        url: "data.json"
    }).done(function(data) {
        objectManager.add(data);
        // Откроем балун на метке с id == 1.
        var objectState = objectManager.getObjectState(1);
        if (objectState.isClustered) {
            // Сделаем так, чтобы указанный объект был "выбран" в балуне.
            objectManager.clusters.state.set('activeObject', objectManager.objects.getById(1));
            // Все сгенерированные кластеры имеют уникальные идентификаторы.
            // Этот идентификатор нужно передать в менеджер балуна, чтобы указать,
            // на каком кластере нужно показать балун.
            objectManager.clusters.balloon.open(objectState.cluster.id);
        } else {
            objectManager.objects.balloon.open(1);
        }
    });

}