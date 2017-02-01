ymaps.ready(['projection.AzimuthalPolarEquidistant']).then(function init() {

    var ARCTIC_LAYER_NAME = 'user#arcticLayer',
        ARCTIC_MAP_TYPE_NAME = 'Арктика',
        ARCTIC_TILES_PATH = 'images/tiles_arctic',
        ARCTIC_PROJECTION = new ymaps.projection.AzimuthalPolarEquidistant(),
        ANTARCTIC_LAYER_NAME = 'user#antarcticLayer',
        ANTARCTIC_MAP_TYPE_NAME = 'Антарктика',
        ANTARCTIC_TILES_PATH = 'images/tiles_antarctic',
        ANTARCTIC_PROJECTION = new ymaps.projection.AzimuthalPolarEquidistant(undefined, 4.1583333333333, 0, true),

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
        },
        AntarcticLayer = function () {
            var layer = new ymaps.Layer(ANTARCTIC_TILES_PATH + '/%z/tile-%x-%y.jpg', {
                // Если тайл не загрузился, показываем это изображение.
                notFoundTile: ANTARCTIC_TILES_PATH + '/3/tile-0-0.jpg'
            });
            // Указываем доступный диапазон масштабов для данного слоя.
            layer.getZoomRange = function () {
                return ymaps.vow.resolve([0, 4]);
            };
            return layer;
        };

    // Добавляем в хранилище слоев свой конструктор.
    ymaps.layer.storage
        .add(ARCTIC_LAYER_NAME, ArcticLayer)
        .add(ANTARCTIC_LAYER_NAME, AntarcticLayer);

    /**
     * Создадим новый тип карты.
     * MAP_TYPE_NAME - имя нового типа.
     * LAYER_NAME - ключ в хранилище слоев или функция конструктор.
     */
    var mapTypeArctic = new ymaps.MapType(ARCTIC_MAP_TYPE_NAME, [ARCTIC_LAYER_NAME]),
        mapTypeAntarctic = new ymaps.MapType(ANTARCTIC_MAP_TYPE_NAME, [ANTARCTIC_LAYER_NAME]);
    // Сохраняем тип в хранилище типов.
    ymaps.mapType.storage
        .add(ARCTIC_MAP_TYPE_NAME, mapTypeArctic)
        .add(ANTARCTIC_MAP_TYPE_NAME, mapTypeAntarctic);

    /**
     * Создаем карту, указав свой новый тип карты.
     */
    var map = new ymaps.Map('map', {
            center: [90, 0],
            zoom: 1,
            controls: ["searchControl", "rulerControl"],
            type: ARCTIC_MAP_TYPE_NAME
        }, {
            // Задаем азимутальную проекцию.
            projection: ARCTIC_PROJECTION
        }), regions;

    var regionsButton = new ymaps.control.Button({
            data: {content: 'Добавить регионы'},
            options: {selectOnClick: true, maxWidth: 150}
        });
    regionsButton.events
        .add('select', function () {
            map.geoObjects.add(regions.geoObjects);
        })
        .add('deselect', function () {
            map.geoObjects.remove(regions.geoObjects);
        });

    var typeButton = new ymaps.control.Button({
            data: {content: 'Антарктика'},
            options: {selectOnClick: true, maxWidth: 150}
        });
    typeButton.events
        .add('select', function () {
            map.setType(ANTARCTIC_MAP_TYPE_NAME);
            map.options.set("projection", ANTARCTIC_PROJECTION);
            typeButton.data.set("content", "Арктика");
        })
        .add('deselect', function () {
            map.setType(ARCTIC_MAP_TYPE_NAME);
            map.options.set("projection", ARCTIC_PROJECTION);
            typeButton.data.set("content", "Антарктика");
        });
    map.controls.add(typeButton);
    ymaps.regions.load('001', {
            lang: 'ru'
        }).then(function (result) {
            regions = result;
            map.controls.add(regionsButton);
        });
});
