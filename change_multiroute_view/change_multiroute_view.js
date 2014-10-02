function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.739625, 37.54120],
            zoom: 7,
            controls: []
        }),
        /**
         * Создание мультимаршрута.
         * @param {Object} model Модель маршрута. Задается объектом с полями: referencePoints и params.
         * referencePoints - описание опорных точек мультимаршрута (обязательное поле);
         * params - параметры мультимаршрута.
         * @param {Object} [options] Опции маршрута.
         * @see http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute1 = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                "метро Киевская",
                "метро Охотный ряд",
                "метро Площадь Революции",
                "Москва, улица Льва Толстого"
            ],
            params: {
                // Точки с указанными индексами будут трактоваться как транзитные.
                viaIndexes: [1]
            }
        }, {
            // Радиус транзитных точек на маршруте.
            viaPointIconRadius: 10,
            // Радиус точечных маркеров в путевых точках.
            pinIconRadius: 10,
            wayPointStartIconColor: "#80C257",
            wayPointFinishIconColor: "#8470FF",
            wayPointIconColor: "black",
            routeStrokeWidth: 2,
            routeActiveStrokeWidth: 6,
            routeStrokeColor: "000088",
            routeActiveStrokeColor: "#FF4500",
            pinIconFillColor: "#BFEFFF",
            viaPointIconFillColor: "#FFD39B",
            transportMarkerIconColor: "#FFE4E1"
        }),
        multiRoute2 = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                "Москва, улица Лобачевского",
                "Москва, метро Академическая"
            ]
        }, {
            routeStrokeWidth: 2,
            routeActiveStrokeWidth: 4,
            routeStrokeColor: "000088",
            routeActiveStrokeColor: "#66CDAA"
        }),

        buttonRoute1 = new ymaps.control.Button({
            data: {
                content: "Первый маршрут"
            },
            options: {
                maxWidth: 300
            }
        }),
        buttonRoute2 = new ymaps.control.Button({
            data: {
                content: "Второй маршрут"
            },
            options: {
                maxWidth: 300
            }
        });
    myMap.controls.add(buttonRoute2);
    myMap.controls.add(buttonRoute1);
    myMap.geoObjects.add(multiRoute1);
    myMap.geoObjects.add(multiRoute2);

    buttonRoute1.events.add('select', function () {
        if (buttonRoute2.isSelected()) {
            buttonRoute2.deselect();
        }
        myMap.setBounds(multiRoute1.getBounds());
    });

    buttonRoute2.events.add('select', function () {
        if (buttonRoute1.isSelected()) {
            buttonRoute1.deselect();
        }
        myMap.setBounds(multiRoute2.getBounds());
    });
}

ymaps.ready(init);