ymaps.ready(function () {

    var map = new ymaps.Map('map', {
        center: [55.79, 37.64],
        zoom: 10,
        controls: ['zoomControl']
    }),
    objectManager = new ymaps.ObjectManager();

    // Загружаем GeoJSON файл с описанием объектов.
    $.getJSON('data.json')
        .done(function (geoJson) {
            // Добавляем описание объектов в формате JSON в менеджер объектов.
            objectManager.add(geoJson);
            // Добавляем объекты на карту.
            map.geoObjects.add(objectManager);
        });
});
