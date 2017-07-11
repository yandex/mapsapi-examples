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
        ]),
        collection = new ymaps.GeoObjectCollection();
    // Добавляем геообъекты в коллекцию.
    collection.add(polygon).add(circle).add(rectangle);
    // Добавляем коллекцию на карту.
    myMap.geoObjects.add(collection);

    collection.each(function (obj) {
        // Вычисляем площадь геообъекта.
        var area = Math.round(ymaps.util.calculateArea(obj)),
        // Вычисляем центр для добавления метки.
            center = ymaps.util.bounds.getCenter(obj.geometry.getBounds());
        // Если площадь превышает 1 000 000 м², то приводим ее к км².
        if (area <= 1e6) {
            area += ' м²';
        } else {
            area = (area / 1e6).toFixed(3) + ' км²';
        }
        obj.properties.set('balloonContent', area);

        myMap.geoObjects.add(new ymaps.Placemark(center, {'iconCaption': area}, {preset: 'islands#greenDotIconWithCaption'}));
    });
});
