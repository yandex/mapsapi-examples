ymaps.ready(['projection.Azimuth']).then(function init() {

    var ARCTIC_LAYER_NAME = 'user#arcticLayer',
        ARCTIC_MAP_TYPE_NAME = 'Арктика',
        ARCTIC_TILES_PATH = 'images/tiles_arctic',

        /**
         * Конструктор, создающий собственный слой.
         */
        ArcticLayer = function () {
            var layer = new ymaps.Layer(ARCTIC_TILES_PATH + '/%z/tile-%x-%y.jpg', {
                // Если тайл не загрузился, показываем это изображение.
                notFoundTile: ARCTIC_TILES_PATH + '/3/tile-0-0.jpg'
            });
            // Указываем доступный диапазон масштабов для данного слоя.
            layer.getZoomRange = function () {
                return ymaps.vow.resolve([0, 3]);
            };
            return layer;
        };

    // Добавляем в хранилище слоев свой конструктор.
    ymaps.layer.storage.add(ARCTIC_LAYER_NAME, ArcticLayer);

    /**
     * Создадим новый тип карты.
     * MAP_TYPE_NAME - имя нового типа.
     * LAYER_NAME - ключ в хранилище слоев или функция конструктор.
     */
    var mapType = new ymaps.MapType(ARCTIC_MAP_TYPE_NAME, [ARCTIC_LAYER_NAME]);
    // Сохраняем тип в хранилище типов.
    ymaps.mapType.storage.add(ARCTIC_MAP_TYPE_NAME, mapType);

    /**
     * Создаем карту, указав свой новый тип карты.
     */
    var map = new ymaps.Map('map', {
        center: [90, 0],
        zoom: 1,
        controls: ["searchControl"],
        type: ARCTIC_MAP_TYPE_NAME
    }, {
        // Задаем азимутальную проекцию.
        projection: new ymaps.projection.Azimuth()
    }), regions;

    var regionsButton = new ymaps.control.Button({data: {content: 'Добавить регионы'}, options: {selectOnClick: true}});
    regionsButton.events
        .add('select', function () {
            map.geoObjects.add(regions.geoObjects);
        })
        .add('deselect', function () {
            map.geoObjects.remove(regions.geoObjects);
        });

    ymaps.regions.load('001', {
        lang: 'ru'
    }).then(function (result) {
        regions = result;
        map.controls.add(regionsButton);
        regionsButton.options.set('maxWidth', 150);
    });

});
