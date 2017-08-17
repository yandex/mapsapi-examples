ymaps.ready(function () {

    var LAYER_NAME = 'user#layer',
        MAP_TYPE_NAME = 'user#customMap',
    // Директория с тайлами.
        TILES_PATH = 'images/tiles',
    /* Для того чтобы высчитать координаты левого нижнего и правого верхнего углов прямоугольной координатной
     * области, нам необходимо знать максимальный зум, ширину и высоту изображения в пикселях на максимальном зуме.
     */
        MAX_ZOOM = 7,
        PIC_WIDTH = 20207,
        PIC_HEIGHT = 13139;

    /**
     * Конструктор, создающий собственный слой.
     */
    var Layer = function () {
        var layer = new ymaps.Layer(TILES_PATH + '/%z/tile-%x-%y.jpg');
        // Указываем доступный диапазон масштабов для данного слоя.
        layer.getZoomRange = function () {
            return ymaps.vow.resolve([0, 7]);
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

    // Высчитываем размер карты.
    var worldSize = Math.pow(2, MAX_ZOOM) * 256,
        /**
         * Создаем карту, указав свой новый тип карты.
         */
        map = new ymaps.Map('map', {
                center: [0, 0],
                zoom: 2,
                controls: ['zoomControl'],
                type: MAP_TYPE_NAME
            }, {
            // Задаем в качестве проекции Декартову. При данном расчёте центр изображения будет лежать
            // в координатах [0, 0].
                projection: new ymaps.projection.Cartesian([[PIC_HEIGHT / 2 - worldSize, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, worldSize - PIC_WIDTH / 2]], [false, false])

            // При данном расчёте, в координатах [0, 0] будет находиться левый нижний угол изображения,
            // правый верхний будет находиться в координатах [PIC_HEIGHT, PIC_WIDTH]
            // projection: new ymaps.projection.Cartesian([[PIC_HEIGHT - worldSize, 0], [PIC_HEIGHT, worldSize]], [false, false])
            });

    // Координаты карты совпадают с пикселями изображения.
    var point = new ymaps.Placemark([PIC_HEIGHT / 2, PIC_WIDTH / 2]);
    var point1 = new ymaps.Placemark([0, 0], undefined, {
        preset: 'islands#dotIcon',
        iconColor: 'yellow'
    });

    map.geoObjects.add(point).add(point1);
});
