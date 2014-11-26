function init () {
    // Создаем модель мультимаршрута.
    var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([
        [55.734876, 37.59308],
        "Москва, ул. Мясницкая"
    ], {
        // Путевые точки можно перетаскивать.
        // Маршрут при этом будет перестраиваться.
        wayPointDraggable: true,
        boundsAutoApply: true
    });

    // Создаем кнопку, переключающую модель в режим
    // маршрутизации на общественном транспорте.
    var masstransitButton = new ymaps.control.Button({
        data: { content: "На общественном транспорте"},
        options: { selectOnClick: true }
    });

    // Объявляем обработчики для кнопки.
    masstransitButton.events.add('select', function () {
        multiRouteModel.setParams({ routingMode: 'masstransit' }, true);
    });

    masstransitButton.events.add('deselect', function () {
        multiRouteModel.setParams({ routingMode: 'auto' }, true);
    });

    // Создаем экземпляр текстового отображения модели мультимаршрута.
    // см. файл custom_view.js
    new CustomView(multiRouteModel);

    // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
        controls: [masstransitButton]
    }, {
        buttonMaxWidth: 300
    });

    // Создаем на основе существующей модели мультимаршрут.
    var multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
        // Путевые точки можно перетаскивать.
        // Маршрут при этом будет перестраиваться.
        wayPointDraggable: true,
        boundsAutoApply: true
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
