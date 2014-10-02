ymaps.ready(init);

function init() {
    // Создаем карту.
    var myMap = new ymaps.Map("map", {
            center: [55.72, 37.44],
            zoom: 10
        });

    // Создаем ломаную, используя класс GeoObject.
    var myGeoObject = new ymaps.GeoObject({
            // Описываем геометрию геообъекта.
            geometry: {
                // Тип геометрии - "Ломаная линия".
                type: "LineString",
                // Указываем координаты вершин ломаной.
                coordinates: [
                    [55.80, 37.50],
                    [55.70, 37.40]
                ]
            },
            // Описываем свойства геообъекта.
            properties:{
                // Содержимое хинта.
                hintContent: "Я геообъект",
                // Содержимое балуна.
                balloonContent: "Меня можно перетащить"
            }
        }, {
            // Задаем опции геообъекта.
            // Включаем возможность перетаскивания ломаной.
            draggable: true,
            // Цвет линии.
            strokeColor: "#FFFF00",
            // Ширина линии.
            strokeWidth: 5
        });

    // Создаем ломаную с помощью вспомогательного класса Polyline.
    var myPolyline = new ymaps.Polyline([
            // Указываем координаты вершин ломаной.
            [55.80, 37.50],
            [55.80, 37.40],
            [55.70, 37.50],
            [55.70, 37.40]
        ], {
            // Описываем свойства геообъекта.
            // Содержимое балуна.
            balloonContent: "Ломаная линия"
        }, {
            // Задаем опции геообъекта.
            // Отключаем кнопку закрытия балуна.
            balloonCloseButton: false,
            // Цвет линии.
            strokeColor: "#000000",
            // Ширина линии.
            strokeWidth: 4,
            // Коэффициент прозрачности.
            strokeOpacity: 0.5
        });

    // Добавляем линии на карту.
    myMap.geoObjects
        .add(myGeoObject)
        .add(myPolyline);
}
