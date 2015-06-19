ymaps.ready(init);
var myMap, myGeoObject, myRectangle;

function init () {
    myMap = new ymaps.Map('map', {
        center: [55.674, 37.601],
        zoom: 11
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Cоздаем геообъект с типом геометрии "прямоугольник".
    myGeoObject = new ymaps.GeoObject({
        // Геометрия = тип геометрии + координаты геообъекта.
        geometry: {
            // Тип геометрии - прямоугольник.
            type: 'Rectangle',
            // Координаты.
            coordinates: [
                [55.665, 37.66],
                [55.64, 37.53]
            ]
        },
        // Свойства.
        properties: {
            hintContent: 'Перетащи меня!',
            balloonContent: 'Прямоугольник 2'
        }
    }, {
        // Опции.
        // Объект можно перетаскивать.
        draggable: true,
        // Цвет и прозрачность заливки.
        fillColor: '#ffff0022',
        // Цвет и прозрачность границ.
        strokeColor: '#3caa3c88',
        // Ширина линии.
        strokeWidth: 7
    });

    // Создаем прямоугольник с помощью вспомогательного класса.
    myRectangle = new ymaps.Rectangle([
        // Задаем координаты диагональных углов прямоугольника.
        [55.66, 37.60],
        [55.71, 37.69]
    ], {
        //Свойства
        hintContent: 'Меня перетаскивать нельзя!',
        balloonContent: 'Прямоугольник 1'
    }, {
        // Опции.
        // Цвет и прозрачность заливки.
        fillColor: '#7df9ff33',
        // Дополнительная прозрачность заливки..
        // Итоговая прозрачность будет не #33(0.2), а 0.1(0.2*0.5).
        fillOpacity: 0.5,
        // Цвет обводки.
        strokeColor: '#0000FF',
        // Прозрачность обводки.
        strokeOpacity: 0.5,
        // Ширина линии.
        strokeWidth: 2,
        // Радиус скругления углов.
        // Данная опция принимается только прямоугольником.
        borderRadius: 6
    });

    myMap.geoObjects
        .add(myRectangle)
        .add(myGeoObject);
}
