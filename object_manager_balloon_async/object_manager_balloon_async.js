ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Мы хотим загружать данные для балуна перед открытием, поэтому
            // запретим автоматически открывать балун по клику.
            geoObjectOpenBalloonOnClick: false
        });

    myMap.geoObjects.add(objectManager);


    $.ajax({
        url: "data.json"
    }).done(function(data) {
            objectManager.add(data);
        });

    // Функция, эмулирующая запрос за данными на сервер.
    function loadBalloonData (objectId) {
        var dataDeferred = ymaps.vow.defer();
        function resolveData () {
            dataDeferred.resolve('Данные балуна');
        }
        window.setTimeout(resolveData, 1000);
        return dataDeferred.promise();
    }

    function hasBalloonData (objectId) {
        return objectManager.objects.getById(objectId).properties.balloonContent;
    }

    objectManager.objects.events.add('click', function (e) {
        var objectId = e.get('objectId'),
            obj = objectManager.objects.getById(objectId);
        if (hasBalloonData(objectId)) {
            objectManager.objects.balloon.open(objectId);
        } else {
            obj.properties.balloonContent = "Идет загрузка данных...";
            objectManager.objects.balloon.open(objectId);
            loadBalloonData(objectId).then(function (data) {
                obj.properties.balloonContent = data;
                objectManager.objects.balloon.setData(obj);
            });
        }
    });
}