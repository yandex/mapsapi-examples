// Обратите внимание, что модуль не умеет обсчитывать полигоны с самопересечениями.
ymaps.ready(['util.calculateArea']).then(function () {
    var myMap = new ymaps.Map("map", {
            center: [55.9238145091058, 37.897131347654376],
            zoom: 10,
            controls: ['searchControl', 'zoomControl']
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // Создаем многоугольник, круг и прямоугольник.
        polygon = new ymaps.GeoObject({
            geometry: {
                type: "Polygon", coordinates: [[
                    [55.97544201439153, 37.71984863281182],
                    [55.876808118310706, 37.66697692871001],
                    [55.8748378377763, 37.78258361816322],
                    [55.97544201439153, 37.71984863281182]
                ]]
            }
        }),
        circle = new ymaps.Circle([[55.9238145091058, 38.097131347654376], 5000]),
        rectangle = new ymaps.Rectangle([
            [55.973805634187, 37.81389007567776],
            [55.87510965298843, 37.95396575927215]
        ]);
    // Добавляем геообъекты на карту.
    myMap.geoObjects.add(polygon).add(circle).add(rectangle);

    myMap.geoObjects.events.add('click', function (e) {
        var geoObject = e.get('target');
        // Вычисляем площадь геообъекта.
        var area = Math.round(ymaps.util.calculateArea(geoObject));
        // Если площадь превышает 1 000 000 м², то приводим ее к км².
        if (area <= 1e6) {
            area += ' м²';
        } else {
            area = (area / 1e6).toFixed(3) + ' км²';
        }
        geoObject.properties.set('balloonContent', area);
    });
});
