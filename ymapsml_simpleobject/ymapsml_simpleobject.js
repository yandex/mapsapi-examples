ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 8
        });
    // После того как данные YmapsMl-файла загрузятся, вызывается callback-функция.
    ymaps.geoXml.load("data.xml")
        .then(function (res) {
            // Добавляем коллекцию геообъектов на карту.
            myMap.geoObjects.add(res.geoObjects);
        }, function (error) {
            alert('При загрузке YMapsML-файла произошла ошибка: ' + error);
        });
}