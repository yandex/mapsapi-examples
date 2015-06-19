ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [54.55, 36.27],
            zoom: 12
        }, {
           searchControlProvider: 'yandex#search'
        });

    // После того как данные YmapsMl-файла загрузятся, вызывается callback-функция.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            // Добавление коллекции геообъектов на карту.
            myMap.geoObjects.add(res.geoObjects);
        }, function (error) {
            alert('При загрузке стилей произошла ошибка: ' + error);
        });
}