ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 9
    });

    // Поиск станций метро.
    ymaps.geocode(myMap.getCenter(), {
        /**
         * Опции запроса
         * @see http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
         */
        // Ищем только станции метро.
        kind: 'metro',
        // Запрашиваем не более 20 результатов.
        results: 20
    }).then(function (res) {
            // Задаем изображение для иконок меток.
            res.geoObjects.options.set('preset', 'islands#redCircleIcon');
            // Добавляем коллекцию найденных геообъектов на карту.
            myMap.geoObjects.add(res.geoObjects);
            // Масштабируем карту на область видимости коллекции.
            myMap.setBounds(res.geoObjects.getBounds());
        });
}