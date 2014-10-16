ymaps.ready(init);

function init() {

    var myMap = new ymaps.Map('map', {
            center: [55.709243, 37.500737],
            zoom: 9
        }, {
            // В нашем примере хотспотные данные есть только для 9 и 10 масштаба.
            // Поэтому ограничим диапазон коэффициентов масштабирования карты.
            minZoom: 9,
            maxZoom: 10
        });

    // Добавим на карту элемент управления коэффициентом масштабирования.
    myMap.controls.add('smallZoomControl', { top: 5 });

        // Шаблон URL для данных активных областей.
        // Источник данных будет запрашивать данные через URL вида:
        // '.../hotspot_layer/hotspot_data/9/tile_x=1&y=2', где
        // x, y - это номер тайла, для которого запрашиваются данные,
        // 9 - значение коэффициента масштабирования карты.
    var tileUrlTemplate = 'hotspot_data/%z/tile_x=%x&y=%y',

        // Шаблон callback-функции, в которую сервер будет оборачивать данные тайла.
        // Пример callback-функции после подстановки - 'testCallback_tile_x_1_y_2_z_9'.
        keyTemplate = 'testCallback_tile_%c',

        // URL тайлов картиночного слоя.
        // Пример URL после подстановки -
        // '.../hotspot_layer/images/9/tile_x=1&y=2.png'.
        imgUrlTemplate = 'images/%z/tile_x=%x&y=%y.png',

        // Создадим источник данных слоя активных областей.
        objSource = new ymaps.hotspot.ObjectSource(tileUrlTemplate, keyTemplate),

        // Создаем картиночный слой и слой активных областей.
        imgLayer = new ymaps.Layer(imgUrlTemplate, {tileTransparent: true}),
        hotspotLayer = new ymaps.hotspot.Layer(objSource, {cursor: 'help'});

    // Добавляем слои на карту.
    myMap.layers.add(hotspotLayer);
    myMap.layers.add(imgLayer);
}