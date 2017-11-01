ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [59.9567962610097, 30.264981955459618],
        zoom: 9
    });
    // Ссылка на запланированный путь в формате kml/gpx.
    var originalTrackUrl = "original.gpx",
    // Ссылка на путь в формате kml/gpx, который будем сравнивать с запланированным путем.
        comparableTrackUrl = "comparable.gpx",
    // Допустимая разница в метрах.
        diff = 1;
    // Сравним два пути.
    compare(originalTrackUrl, comparableTrackUrl);

    // Метод, который добавляет два пути на карту и сравнивает их.
    function compare(originalTrackUrl, comparableTrackUrl) {
        // Создадим коллекцию участков пути, которые не совпадают с запланированным путем.
        var collection = new ymaps.GeoObjectCollection({}, {
            strokeColor: '#FF0000',
            strokeWidth: 3
        });
        // Дожидаемся загрузки файлов.
        ymaps.vow.all([ymaps.geoXml.load(originalTrackUrl), ymaps.geoXml.load(comparableTrackUrl)]).then(function (res) {
            // Получаем запланированный путь.
            var originalTrack = res[0].geoObjects.get(0),
            // Получаем сравниваемый путь.
                comparableTrack = res[1].geoObjects.get(0);
            // Для kml есть ещё один уровень вложенности.
            if (!originalTrack.geometry) {
                originalTrack = originalTrack.get(0);
                comparableTrack = comparableTrack.get(0);
            }
            // Получаем геометрию запланированного пути.
            var originalGeometry = originalTrack.geometry,
            // Получаем геометрию для сравниваемого пути.
                comparableGeometry = comparableTrack.geometry,
            // Счётчик количества точек, которые не совпали с запланированным маршрутом.
                diffPoints = 0;
            // Увеличим толщину и цвет путей и добавим их на карту.
            originalTrack.options.set({strokeWidth: 3, strokeColor: '#4585E6'});
            comparableTrack.options.set({strokeWidth: 3, strokeColor: '#4585E6'});
            myMap.geoObjects.add(originalTrack).add(comparableTrack);
            // Выставим границы карты так, чтобы отобразились сравниваемые пути.
            myMap.setBounds(myMap.geoObjects.getBounds());

            for (var i = 0, isNotEqual, isPreviousNotEqual = false; i < comparableGeometry.getLength(); i++) {
                // Проверим, что от каждой точки сравниваемого пути расстояние до запланированного пути меньше допустимого.
                isNotEqual = originalGeometry.getClosest(comparableGeometry.get(i)).distance > diff;

                if (isNotEqual) {
                    // Инкрементируем счетчик количества точек, которые не совпали с запланированным маршрутом.
                    diffPoints++;
                    // Сохраняем состояние для следующей итерации.
                    isPreviousNotEqual = true;
                    // Пропускаем одну итерацию в случае несовпадения начальных точек.
                    if (i === 0) continue;
                    // Добавим участок пути от предыдущей точки до текущей (которая не совпадает с запланированным маршрутом) в коллекцию.
                    collection.add(new ymaps.Polyline([
                        comparableGeometry.get(i - 1),
                        comparableGeometry.get(i)
                    ]));
                } else if (isPreviousNotEqual) {
                    // Добавим участок пути от предыдущей точки(которая не совпадает с запланированным маршрутом) до текущей в коллекцию.
                    collection.add(new ymaps.Polyline([
                        comparableGeometry.get(i - 1),
                        comparableGeometry.get(i)
                    ]));
                    // Сохраняем состояние для следующей итерации.
                    isPreviousNotEqual = false;
                }
            }
            // Добавим коллекцию на карту.
            myMap.geoObjects.add(collection);
            // Получим протяженность отличающихся участков.
            var diffDistance = 0;
            collection.each(function (obj) {
                diffDistance += obj.geometry.getDistance();
            });
            diffDistance = Math.round(diffDistance);
            // Получим протяженность сравниваемого пути.
            var comparableDistance = comparableGeometry.getDistance(),
            // Получим сколько процентов пройдено вне запланированного пути.
                diffDistanceRatio = Math.abs(100 * diffDistance / comparableDistance).toFixed(1),
            // Сформируем текст для балуна.
                content = "Красные участки — отклонения от запланированного пути. <br> Вне запланированного пути пройдено %k м (%m %).";
            content = content.replace('%k', diffDistance)
                .replace('%m', diffDistanceRatio);
            // Добавим новый текст для балунов всех путей.
            originalTrack.properties.set('balloonContent', content);
            comparableTrack.properties.set('balloonContent', content);
            collection.each(function (obj) {
                obj.properties.set('balloonContent', content);
            });
            // Откроем балун на запланированном пути.
            originalTrack.balloon.open();
        }, function (error) {
            console.log('Ошибка: ' + error);
        })
    }
}
