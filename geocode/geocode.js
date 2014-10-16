ymaps.ready(init);

function init() {
    // Поиск координат центра Нижнего Новгорода.
    ymaps.geocode('Нижний Новгород', { results: 1 }).then(function (res) {
        // Выбираем первый результат геокодирования.
        var firstGeoObject = res.geoObjects.get(0),
        // Создаем карту с нужным центром.
            myMap = new ymaps.Map("map", {
                center: firstGeoObject.geometry.getCoordinates(),
                zoom: 11
            });

        myMap.container.fitToViewport();
        attachReverseGeocode(myMap);

        // Поиск станций метро.
        // Делаем запрос на обратное геокодирование.
        ymaps.geocode(myMap.getCenter(), {
            // Ищем только станции метро.
            kind: 'metro',
            // Ищем в пределах области видимости карты.
            boundedBy: myMap.getBounds(),
            // Запрашиваем не более 20 результатов.
            results: 20
        }).then(function (res) {
            // Задаем изображение для иконок меток.
            res.geoObjects.options.set('preset', 'twirl#metroMoscowIcon');
            // Добавляем полученную коллекцию на карту.
            myMap.geoObjects.add(res.geoObjects);
        });
    }, function (err) {
        // Если геокодирование не удалось, сообщаем об ошибке.
        alert(err.message);
    });

    // При щелчке левой кнопкой мыши выводится
    // информация о месте, на котором щёлкнули.
    function attachReverseGeocode(myMap) {
        myMap.events.add('click', function (e) {
            var coords = e.get('coordPosition');

            // Отправим запрос на геокодирование.
            ymaps.geocode(coords).then(function (res) {
                var names = [];
                // Переберём все найденные результаты и
                // запишем имена найденный объектов в массив names.
                res.geoObjects.each(function (obj) {
                    names.push(obj.properties.get('name'));
                });
                // Добавим на карту метку в точку, по координатам
                // которой запрашивали обратное геокодирование.
                myMap.geoObjects.add(new ymaps.Placemark(coords, {
                    // В качестве контента иконки выведем
                    // первый найденный объект.
                    iconContent:names[0],
                    // А в качестве контента балуна - подробности:
                    // имена всех остальных найденных объектов.
                    balloonContent:names.reverse().join(', ')
                }, {
                    preset:'twirl#redStretchyIcon',
                    balloonMaxWidth:'250'
                }));
            });
        });
    }

}