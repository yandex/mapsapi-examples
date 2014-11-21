function init () {
    // Создаем мультимаршрут.
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            "Москва, ул. Барклая",
            "Москва, шоссе Энтузиастов 70"
        ],
        params: {
            routingMode: 'masstransit'
        }
    });

    // Создаем объект, раскрашивающий линии сегментов маршрута.
    new Colorizer(multiRoute);

    // Создаем карту.
    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 2,
        controls: []
    }, {
        buttonMaxWidth: 300
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);

