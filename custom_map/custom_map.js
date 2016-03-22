ymaps.ready(function () {

    var LAYER_NAME = 'user#layer',
        MAP_TYPE_NAME = 'user#customMap',
        TILES_PATH = './images/tiles'; // Директория с тайлами.

    /**
     * Конструктор, создающий собственный слой.
     */
    var Layer = function () {
        var layer = new ymaps.Layer(TILES_PATH + '/%z/%x-%y.jpeg', {
                // Если тайл не загрузился, показываем это изображение.
                notFoundTile: TILES_PATH + '/2/0-0.jpeg'
            });
        // Указываем доступный диапазон масштабов для данного слоя.
        layer.getZoomRange = function () {
            return ymaps.vow.resolve([1, 3]);
        };
        // Добавляем свои копирайты.
        layer.getCopyrights = function () {
            return ymaps.vow.resolve('©');
        };
        return layer;
    };
    // Добавляем в хранилище слоев свой конструктор.
    ymaps.layer.storage.add(LAYER_NAME, Layer);

    /**
     * Создадим новый тип карты.
     * MAP_TYPE_NAME - имя нового типа.
     * LAYER_NAME - ключ в хранилище слоев или функция конструктор.
     */
    var mapType = new ymaps.MapType(MAP_TYPE_NAME, [LAYER_NAME]);
    // Сохраняем тип в хранилище типов.
    ymaps.mapType.storage.add(MAP_TYPE_NAME, mapType);

    /**
     * Создаем карту, указав свой новый тип карты.
     */
    var map = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 1,
        controls: ['zoomControl'],
        type: MAP_TYPE_NAME
    }, {
        // Задаем в качестве проекции Декартову.
        projection: new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false])
    });

});
