function init() {
    var myMap = new ymaps.Map('map', {
            center: [37.54120, 55.729625],
            zoom: 11,
            type: "yandex#satellite",
            controls: []
        }),
        /**
         * Создание мультимаршрута.
         * @see http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
            multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                "метро Арбатская",
                "метро Курская"
            ],
            params: {
                // Маршрут на общественном транспорте.
                routingMode: "masstransit",
                // Порядок координат в запросе: долгота, широта.
                searchCoordOrder: "longlat"
            }
        }, {
            boundsAutoApply: true
        }),

        buttonTraffic = new ymaps.control.Button({
            data: {
                content: "Учитывать пробки"
            },
            options: {
                maxWidth: 300
            }
        }),
        buttonMassTransit = new ymaps.control.Button({
            data: {
                content: "Переключить на автомобиль"
            },
            options: {
                maxWidth: 300,
                selectOnClick: false
            }
        });
    myMap.controls.add(buttonMassTransit);
    myMap.controls.add(buttonTraffic);
    myMap.geoObjects.add(multiRoute);

    var state = 'masstransit';
    buttonMassTransit.events.add('press', function () {
        if (state == 'auto') {
            buttonMassTransit.data.set('content', 'Переключить на автомобиль');
            state = 'masstransit';
            multiRoute.model.setParams({
                routingMode: 'masstransit'
            /**
             *  true - не изменять значение непереданных параметров.
             *  @see http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setParams
             */
            }, true);
        } else if (state == 'masstransit') {
            buttonMassTransit.data.set('content', 'Переключить на общественный транспорт');
            state = 'auto';
            multiRoute.model.setParams({
                routingMode: 'auto'
            }, true);
        }
    });

    buttonTraffic.events.add('select', function () {
        /**
         * Устанавливает параметры маршрутизации.
         * @see http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setParams
         */
        multiRoute.model.setParams({
            // Прокладывать мультимаршрут с учетом
            // информации о текущих пробках на дорогах.
            avoidTrafficJams: true
        }, true);
    });

    buttonTraffic.events.add('deselect', function () {
        multiRoute.model.setParams({
            // Не учитывать пробки.
            avoidTrafficJams: false
        }, true);
    });
}

ymaps.ready(init);