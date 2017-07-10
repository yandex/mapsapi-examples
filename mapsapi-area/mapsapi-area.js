ymaps.ready(['util.calculateArea']).then(function () {
    var myMap = new ymaps.Map("map", {
            center: [37.64, 55.76],
            zoom: 18,
            controls: ['searchControl', 'zoomControl']
        }, {
            searchControlProvider: 'yandex#search'
        }), placemark,
    // Создаем многоугольник без вершин.
        polygon = new ymaps.Polygon([]);
    // Добавляем многоугольник на карту.
    myMap.geoObjects.add(polygon);
    // Включаем режим редактирования с возможностью добавления новых вершин.
    polygon.editor.startDrawing();

    // Подписываемся на изменение координат.
    polygon.geometry.events.add('change', function () {
        // Проверяем, что пользователь поставил первую точку полигона.
        if (polygon.geometry.get(0)[0]) {
            // Вычисляем центр для добавления метки.
            center = ymaps.util.bounds.getCenter(polygon.geometry.getBounds());
        }
        // Обратите внимание, что модуль не умеет обсчитывать полигоны с самопересечениями.
        // Находим количество самопересечений.
        var kinks = turf.kinks({
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": polygon.geometry.getCoordinates()
            }
        });
        // Если количество самопересечений больше нуля, то сообщаем об этом пользователю.
        if (kinks.features.length > 0){
            placemark.geometry.setCoordinates(center);
            placemark.properties.set('iconCaption', 'Невозможно вычислить площадь');
            return
        }
        // Вычисляем площадь многоугольника.
        var area = Math.round(ymaps.util.calculateArea(polygon)),
            center;
        // Если площадь превышает 1 000 000 м², то приводим ее к км²
        if (area <= 1e6) {
            area += ' м²';
        } else {
            area = (area / 1e6).toFixed(3) + ' км²';
        }
        if (center) {
            if (!placemark) {
                placemark = new ymaps.Placemark(center, {'iconCaption': area}, {preset: 'islands#greenDotIconWithCaption'});
                myMap.geoObjects.add(placemark);
            }
            else {
                placemark.geometry.setCoordinates(center);
                placemark.properties.set('iconCaption', area);
            }
        }
    });
});
