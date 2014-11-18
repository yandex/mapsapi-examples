function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.750625, 37.626],
            zoom: 12,
            controls: []
        }),
        /**
         * Создание мультимаршрута.
         * @param {Object} model Модель мультимаршрута. Задается объектом с полями:
         * referencePoints - описание опорных точек мультимаршрута (обязательное поле);
         * params - параметры мультимаршрута.
         * @param {Object} [options] Опции маршрута.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                [55.734876, 37.59308], // метро Парк Культуры
                "Москва, ул. Мясницкая"
            ],
            params: {
                // Максимальное количество маршрутов, которое вернет маршрутизатор.
                results: 2
                // Массив индексов точек, которые будут трактоваться
                // как транзитные.
                // Обратите внимание, что для задания тразнитных точек
                // в referencePoints должно быть задано не менее
                // трех опорных точек.
                // viaIndexes: [1]
            }
        }, {
            options: {
                // Автоматически устанавливать границы карты так,
                // чтобы маршрут был виден целиком.
                boundsAutoApply: true
            }
        });
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);

