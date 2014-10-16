ymaps.ready(init);

function init () {
    var log = document.getElementById('log'),
        myMap = new ymaps.Map("map", {
            center: [48.856929, 2.341198],
            zoom: 1
        }),
        myCircle = new ymaps.Circle([myMap.getCenter(), 1000000], {
            balloonContentBody: 'Балун',
            hintContent: 'Хинт'
        }, {
            draggable: true
        });

    myCircle.events.add([
        'mapchange', 'geometrychange', 'pixelgeometrychange', 'optionschange', 'propertieschange',
        'balloonopen', 'balloonclose', 'hintshow', 'hinthide', 'dragstart', 'dragend'
    ], function (e) {
        log.innerHTML = '@' + e.get('type') + '<br/>' + log.innerHTML;
    });

    myMap.geoObjects.add(myCircle);

    setupControls(myMap, myCircle);
}

function setupControls(map, geoObject) {
    var toolbar = new ymaps.control.ToolBar(),
        btnProperty = new ymaps.control.Button('Свойство: balloonHeader'),
        btnOption = new ymaps.control.Button('Опция: geodesic'),
        btnRadius = new ymaps.control.Button('Изменить радиус');

    btnProperty.events.add(['select', 'deselect'], function (e) {
        geoObject.properties.set('balloonContentHeader', e.get('type') == 'select' ? 'Заголовок' : undefined);
    });
    btnOption.events.add(['select', 'deselect'], function (e) {
        geoObject.options.set('geodesic', e.get('type') == 'select');
    });
    btnRadius.events.add(['select', 'deselect'], function (e) {
        geoObject.geometry.setRadius(e.get('type') == 'select' ? 2000000 : 1000000);
    });

    toolbar
        .add(btnProperty)
        .add(btnOption)
        .add(btnRadius);

    map.controls
        .add(toolbar)
        .add('smallZoomControl');

}