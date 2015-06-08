ymaps.ready(init);

function init () {
    // Создание экземпляра карты.
    var map = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        });
    window.myMap = map;
    // Загрузка результатов геокодирования.
    ymaps.geoXml.load("http://geocode-maps.yandex.ru/1.x/?geocode=поселок Рай")
        .then(function (res) {
            res.geoObjects.each(function (item) {
                // Границы области карты, в которую входит найденный объект.
                var bounds = item.properties.get("boundedBy");
                // Добавление геообъекта на карту.
                myMap.geoObjects.add(item);
                // Изменение области показа карты.
                myMap.setBounds(bounds);
            });
        },
        // Вызывается в случае неудачной загрузки данных.
        function (error) {
            alert("При загрузке YMapsML-файла произошла ошибка: " + error);
        });
}