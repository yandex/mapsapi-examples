ymaps.ready(init);

function init() {
    var map = new ymaps.Map('map', {
        center: [50, 15],
        zoom: 7,
        type: 'yandex#hybrid',
        controls: ['zoomControl']
    }, {
        // Ограничим область карты.
        restrictMapArea: [[46, 9], [53, 22]]
    });
    map.controls.get('zoomControl').options.set({size: 'small'});

    // Загрузим регионы.
    ymaps.borders.load('001', {
        lang: 'ru',
        quality: 2
    }).then(function (result) {

        // Создадим многоугольник, который будет скрывать весь мир, кроме заданной страны.
        var background = new ymaps.Polygon([
            [
                [85, -179.99],
                [85, 179.99],
                [-85, 179.99],
                [-85, -179.99],
                [85, -179.99]
            ]
        ], {}, {
            fillColor: '#ffffff',
            strokeWidth: 0,
            // Для того чтобы полигон отобразился на весь мир, нам нужно поменять
            // алгоритм пересчета координат геометрии в пиксельные координаты.
            coordRendering: 'straightPath'
        });

        // Добавим многоугольник на карту.
        map.geoObjects.add(background);

        // Найдём страну по её iso коду.
        var region = result.features.filter(function (feature) { return feature.properties.iso3166 == 'CZ'; })[0];

        // Добавим координаты этой страны в полигон, который накрывает весь мир.
        // В полигоне образуется полость, через которую будет видно заданную страну.
        var masks = region.geometry.coordinates;
        masks.forEach(function(mask){
            background.geometry.insert(1, mask);
        });
    })
}