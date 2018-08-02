ymaps.ready(['projection.LambertConformalConic']).then(function init() {

    // Создаём проекцию Ламберта.
    var LAMBERT_PROJECTION = new ymaps.projection.LambertConformalConic();

    // Создаём карту.
    var map = new ymaps.Map('map', {
        center: [60, 100],
        zoom: 1,
        type: null,
        controls: ['zoomControl']
    }, {
        // Задаем проекцию Ламберта.
        projection: LAMBERT_PROJECTION
    });
    map.controls.get('zoomControl').options.set({size: 'small'});

    // Добавляем фон.
    var pane = new ymaps.pane.StaticPane(map, {
        zIndex: 100, css: {
            width: '100%', height: '100%', backgroundColor: '#485668'
        }
    });
    map.panes.append('greyBackground', pane);

    // Загружаем и добавляем регионы России на карту.
    ymaps.borders.load('RU', {
        lang: 'ru'
    }).then(function (result) {
        regions = new ymaps.GeoObjectCollection(null, {
            fillColor: '#051c3a',
            strokeColor: '#9299a2',
            hasHint: false,
            cursor: 'default'
        });
        for (var i = 0; i < result.features.length; i++) {
            regions.add(new ymaps.GeoObject(result.features[i]));
        }

        map.geoObjects.add(regions);
    });
});
