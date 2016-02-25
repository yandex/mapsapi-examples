ymaps.ready(function () {

    var map = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 11,
        controls: ['zoomControl']
    }),
    objectManager = new ymaps.ObjectManager();

    // Загружаем GeoJSON файл с описанием объектов
    $.getJSON('data.json')
        .done(function (geoJson) {
            // добавляем описание объектов в формате JSON в менеджер объектов
            objectManager.add(geoJson);
            // добавляем объекты на карту
            map.geoObjects.add(objectManager);
        });
});
