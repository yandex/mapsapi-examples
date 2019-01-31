ymaps.ready(['ext.paintOnMap']).then(function () {
    var map = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 14,
        controls: []
    });

    var paintProcess;

    // Опции многоугольника или линии.
    var styles = [
        {strokeColor: '#ff00ff', strokeOpacity: 0.7, strokeWidth: 3, fillColor: '#ff00ff', fillOpacity: 0.4},
        {strokeColor: '#ff0000', strokeOpacity: 0.6, strokeWidth: 6, fillColor: '#ff0000', fillOpacity: 0.3},
        {strokeColor: '#00ff00', strokeOpacity: 0.5, strokeWidth: 3, fillColor: '#00ff00', fillOpacity: 0.2},
        {strokeColor: '#0000ff', strokeOpacity: 0.8, strokeWidth: 5, fillColor: '#0000ff', fillOpacity: 0.5},
        {strokeColor: '#000000', strokeOpacity: 0.6, strokeWidth: 8, fillColor: '#000000', fillOpacity: 0.3},
    ];

    var currentIndex = 0;

    // Создадим кнопку для выбора типа рисуемого контура.
    var button = new ymaps.control.Button({data: {content: 'Polygon / Polyline'}, options: {maxWidth: 150}});
    map.controls.add(button);

    // Подпишемся на событие нажатия кнопки мыши.
    map.events.add('mousedown', function (e) {
        // Если кнопка мыши была нажата с зажатой клавишей "alt", то начинаем рисование контура.
        if (e.get('altKey')) {
            if (currentIndex == styles.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex += 1;
            }
            paintProcess = ymaps.ext.paintOnMap(map, e, {style: styles[currentIndex]});
        }
    });

    // Подпишемся на событие отпускания кнопки мыши.
    map.events.add('mouseup', function (e) {
        if (paintProcess) {

            // Получаем координаты отрисованного контура.
            var coordinates = paintProcess.finishPaintingAt(e);
            paintProcess = null;
            // В зависимости от состояния кнопки добавляем на карту многоугольник или линию с полученными координатами.
            var geoObject = button.isSelected() ?
                new ymaps.Polyline(coordinates, {}, styles[currentIndex]) :
                new ymaps.Polygon([coordinates], {}, styles[currentIndex]);

            map.geoObjects.add(geoObject);
        }
    });
}).catch(console.error);