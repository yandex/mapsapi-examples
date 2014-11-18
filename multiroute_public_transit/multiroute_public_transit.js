function init () {
    /**
     * Создаем мультимаршрут.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
     */
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            [55.749, 37.524],
            "Москва, Успенский пер. 7"
        ],
        params: {
            routingMode: 'masstransit'
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });

    // Создаем кнопку.
    var changeLayoutButton = new ymaps.control.Button({
        data: { content: "Показывать время для пеших сегментов"},
        options: { selectOnClick: true }
    });

    // Объявляем обработчики для кнопки.
    changeLayoutButton.events.add('select', function () {
        var contentLayout = ymaps.templateLayoutFactory.createClass('{{ properties.duration.text }}');
        multiRoute.options.set("routeWalkMarkerIconContentLayout", contentLayout);
        // Чтобы показывать время для всех сегментов нужно задать
        // более общую опцию routeMarkerIconContentLayout.
    });

    changeLayoutButton.events.add('deselect', function () {
        multiRoute.options.unset("routeWalkMarkerIconContentLayout");
    });

    // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [55.739625, 37.54120],
        zoom: 12,
        controls: [changeLayoutButton]
    }, {
        buttonMaxWidth: 300
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);