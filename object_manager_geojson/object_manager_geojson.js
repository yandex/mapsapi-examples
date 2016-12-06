ymaps.ready(function () {

    var map = new ymaps.Map('map', {
            center: [29.902651, 60.02],
            zoom: 11,
            controls: ['zoomControl']
        }),
        objectManager = new ymaps.ObjectManager();

    // Загружаем GeoJSON файл экспортированный из Конструктора карт.
    $.getJSON('geoObjects.geojson')
        .done(function (geoJson) {

            geoJson.features.forEach(function (obj) {
                // Задаём контент балуна.
                obj.properties.balloonContent = obj.properties.name;
                // Задаём пресет для меток с полем iconCaption.
                if (obj.properties.iconCaption) {
                    obj.options = {
                        preset: "islands#greenDotIconWithCaption"
                    }
                }
            });
            // Добавляем описание объектов в формате JSON в менеджер объектов.
            objectManager.add(geoJson);
            // Добавляем объекты на карту.
            map.geoObjects.add(objectManager);
        });
});
