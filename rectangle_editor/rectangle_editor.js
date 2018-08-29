ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [30, 50],
        zoom: 4,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Создаем многоугольник в виде прямоугольника.
    var polygon = new ymaps.Polygon([
        [
            [30, 40],
            [30, 50],
            [40, 50],
            [40, 40],
            [30, 40]
        ]
    ]);
    // Добавляем многоугольник на карту.
    myMap.geoObjects.add(polygon);

    // Включаем режим масштабирования.
    polygon.editor.startFraming();
}
