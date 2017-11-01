ymaps.ready(init);

function init() {
    // Создаем карту.
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Создаем круг.
    var myCircle = new ymaps.Circle([
            // Координаты центра круга.
            [55.76, 37.60],
            // Радиус круга в метрах.
            10000
        ], {}, {
            // Задаем опции круга.
            // Цвет заливки.
            fillColor: "#DB709377",
            // Цвет обводки.
            strokeColor: "#990066",
            // Прозрачность обводки.
            strokeOpacity: 0.8,
            // Ширина обводки в пикселях.
            strokeWidth: 5
        });

    // Добавляем круг на карту.
    myMap.geoObjects.add(myCircle);

    // Включаем редактирование круга.
    myCircle.editor.startEditing();
}
