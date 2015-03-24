function init () {
    // Объявляем набор опорных точек, и массив индексов транзитных точек.
    var referencePoints = [
            "Москва, Ленинский проспект",
            "Москва, Льва Толстого, 16",
            "Москва, Кремлевская набережная",
            "Москва, парк Сокольники"
        ],
        viaIndexes = [2];

    // Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: referencePoints,
        params: { viaIndexes: viaIndexes }
    }, {
        // Внешний вид путевых точек.
        wayPointStartIconColor: "#000000",
        // Задаем собственную картинку для последней путевой точки.
        wayPointFinishIconLayout: "default#image",
        wayPointFinishIconImageHref: "images/sokolniki.png",
        wayPointFinishIconImageSize: [30, 30],
        wayPointFinishIconImageOffset: [-15, -15],
        // Позволяет скрыть иконки путевых точек маршрута.
        // wayPointVisible:false,

        // Внешний вид транзитных точек.
        viaPointIconRadius: 7,
        viaPointIconFillColor: "#000088",
        viaPointActiveIconFillColor: "#E63E92",
        // Транзитные точки можно перетаскивать, при этом
        // маршрут будет перестраиваться.
        viaPointDraggable: true,
        // Позволяет скрыть иконки транзитных точек маршрута.
        // viaPointVisible:false,

        // Внешний вид точечных маркеров под путевыми точками.
        pinIconFillColor: "#000088",
        pinActiveIconFillColor: "#E63E92",
        // Позволяет скрыть точечные маркеры путевых точек.
        // pinVisible:false,
        
        // Внешний вид линии маршрута.
        routeStrokeWidth: 2,
        routeStrokeColor: "#000088",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#E63E92",
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });
    
    // Настраиваем внешний вид второй точки через прямой доступ к ней.
    customizeSecondPoint();

    // Создаем кнопку.
    var removePointsButton = new ymaps.control.Button({
        data: { content: "Удалить промежуточные точки"},
        options: { selectOnClick: true }
    });

    // Объявляем обработчики для кнопки.
    removePointsButton.events.add('select', function () {
        multiRoute.model.setReferencePoints([
            referencePoints[0],
            referencePoints[referencePoints.length - 1]
        ], []);
    });

    removePointsButton.events.add('deselect', function () {
        multiRoute.model.setReferencePoints(referencePoints, viaIndexes);
        // Т.к. вторая точка была удалена, нужно заново ее настроить.
        customizeSecondPoint();
    });

    // Функция настройки внешнего вида второй точки.
    function customizeSecondPoint () {
        /**
         * Ждем пока будут загружены данные мультимаршрута и созданы отображения путевых точек.
         * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel-docpage/#event-requestsuccess
         */
        multiRoute.model.events.once("requestsuccess", function () {
            var yandexWayPoint = multiRoute.getWayPoints().get(1);
            // Создаем балун у метки второй точки.
            ymaps.geoObject.addon.balloon.get(yandexWayPoint);
            yandexWayPoint.options.set({
                preset: "islands#grayStretchyIcon",
                iconContentLayout: ymaps.templateLayoutFactory.createClass(
                    '<span style="color: red;">Я</span>ндекс'
                ),
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    '{{ properties.address|raw }}'
                )
            });
        });
    }

    // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [55.739625, 37.54120],
        zoom: 7,
        controls: [removePointsButton]
    }, {
        buttonMaxWidth: 300
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
