function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.739625, 37.54120],
            zoom: 12,
            controls: []
        }),
        /**
         * Создание мультимаршрута.
         * @param {Object} model Модель мультимаршрута. Задается объектом с полями:
         * referencePoints - описание опорных точек мультимаршрута (обязательное поле);
         * params - параметры маршрутизации.
         * @param {Object} [options] Опции маршрута.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                [55.746908, 37.58328],
                [55.731461, 37.50707]
            ]
        }),

        buttonChangeRoutingMode = new ymaps.control.Button({
            data: {
                content: "Переключить на общественный транспорт"
            },
            options: {
                maxWidth: 300
            }
        }),

        state = 'auto';
    buttonChangeRoutingMode.events.add('press', function () {
        if (state == 'auto') {
            buttonChangeRoutingMode.data.set('content', 'Переключить на автомобиль');
            state = 'masstransit';
            /**
             * Функция устанавливает параметры маршрутизации.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setParams
             */
            multiRoute.model.setParams({
                // Тип маршрутизации - на общественном транспорте.
                routingMode: 'masstransit'
            });
        } else if (state == 'masstransit') {
            buttonChangeRoutingMode.data.set('content', 'Переключить на общественный транспорт');
            state = 'auto';
            multiRoute.model.setParams({
                // Тип маршрутизации - на автомобиле.
                routingMode: 'auto'
            });
        }
    });

    myMap.geoObjects.add(multiRoute);
    myMap.controls.add(buttonChangeRoutingMode);
}

ymaps.ready(init);