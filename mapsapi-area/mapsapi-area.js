ymaps.ready(['util.calculateArea']).then(function () {
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
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
        // Вычисляем площадь многоугольника.
        var area = Math.round(ymaps.util.calculateArea(polygon)),
            center;
        // Если площадь превышает 1 000 000 кв. м, то приводим её к кв. км
        if (area <= 1e6) {
            area += ' кв. м'
        } else {
            area = (area / 1e6).toFixed(3) + ' кв. км'
        }
        // Проверяем, что пользователь поставил первую точку полигона.
        if (polygon.geometry.get(0)[0]) {
            // Вычисляем центр для добавления метки.
            center = ymaps.util.bounds.getCenter(polygon.geometry.getBounds());
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
