ymaps.ready(init);

function init () {
    // Создание карты.
    var mapSatellite = new ymaps.Map('satelliteTypeId', {
            center: [55.76, 37.64],
            zoom: 8
        }, {
            searchControlProvider: 'yandex#search'
        });

    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            if (res.mapState) {
                // Изменение типа карты.
                res.mapState.applyToMap(mapSatellite);
            }
        },
        // Вызывается в случае неудачной загрузки YMapsML-файла.
        function (error) {
            alert('При загрузке YMapsML-файла произошла ошибка: ' + error);
        });
}