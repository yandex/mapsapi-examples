function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.752625, 37.59310],
            zoom: 14,
            controls: []
        }),
        /**
         * Создание мультимаршрута.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                "метро Арбатская",
                "метро Смоленская"
            ]
        }, {
            /**
             * Макет геообъекта.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml#param-options
             */
            wayPointStartIconLayout: "default#image",
            wayPointStartIconImageHref: 'images/start_point.png',
            wayPointStartContentSize: [10, 10],
            wayPointStartIconImageSize: [26, 46],
            wayPointStartIconImageOffset: [-25, -46],
            wayPointFinishIconLayout: "default#image",
            wayPointFinishIconImageHref: 'images/finish_point.png',
            wayPointFinishContentSize: [10, 10],
            wayPointFinishIconImageSize: [26, 46],
            wayPointFinishIconImageOffset: [-25, -46]
        });

    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);