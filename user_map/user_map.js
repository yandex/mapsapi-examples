var myMap;
ymaps.ready(init);

function init () {
    // Создаем проекцию для декартовой системы координат.
    var myProjection = new ymaps.projection.Cartesian([
            // Определяем границы области отображения в декартовых координатах.
            [-1, -1],
            [1, 1]
        ]),

    // Создадим собственный слой карты:
        MyLayer = function () {
            return new ymaps.Layer(
                // Зададим функцию, преобразующую номер тайла
                // и уровень масштабировая в URL тайла на сервере.
                function (tile, zoom) {
                    return "http://mt.gmapuploader.com/tiles/FVSH1JsvdT/tile-" + zoom + "-" +
                        (tile[1] * Math.pow(2, zoom) + tile[0]) + ".jpg";
                }
            );
        };

    // Добавим конструктор слоя в хранилище слоёв под ключом my#layer.
    ymaps.layer.storage.add('my#layer', MyLayer);
    // Создадим новый тип карты, состоящий только из нашего слоя тайлов,
    // и добавим его в хранилище типов карты под ключом my#type.
    ymaps.mapType.storage.add('my#type', new ymaps.MapType(
        'Схема',
        ['my#layer']
    ));

    // Создадим карту в заданной системе координат.
    myMap = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 2,
        type: 'my#type',
        controls: ['zoomControl']
    }, {
        maxZoom: 4, // Максимальный коэффициент масштабирования для заданной проекции.
        minZoom: 2, // Минимальный коэффициент масштабирования.
        projection: myProjection,
        // Выставим опцию, чтобы зум-контрол был минимального размера
        // независимо от размеров карты.
        zoomControlSize: 'small'
    });
}