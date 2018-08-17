// Опции многоугольника.
var polygonOptions = {
    strokeColor: '#0000ff',
    fillColor: '#8080ff',
    strokeWidth: 4,
    opacity: 0.7,
    draggable: true
};
// Стили canvas-элемента.
var canvasOptions = {
    strokeStyle: '#0000ff',
    lineWidth: 4,
    opacity: 0.7
};

ymaps.ready(['Map', 'Polygon']).then(function () {
    var map = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 8,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });
    var polygon = null;

    // Создадим кнопку рисования и добавим её на карту.
    var drawButton = new ymaps.control.Button({
        data: {content: 'Нарисовать область'},
        options: {maxWidth: 150}
    });
    map.controls.add(drawButton);

    // Подпишемся на событие нажатия кнопки.
    drawButton.events.add('select', function () {

        drawLineOverMap(map)
            .then(function (coordinates) {
                // Переводим координаты курсора мыши в географические координаты.
                var bounds = map.getBounds();
                coordinates = coordinates.map(function (x) {
                    return [
                        // Широта (latitude).
                        // Y переворачивается, т.к. на canvas-элементе он направлен вниз.
                        bounds[0][0] + (1 - x[1]) * (bounds[1][0] - bounds[0][0]),
                        // Долгота (longitude).
                        bounds[0][1] + x[0] * (bounds[1][1] - bounds[0][1])
                    ];
                });

                // Так как в процессе рисования у нас будет создаваться много близкостоящих точек, то нам нужно упростить контур.
                // Для простоты реализации мы будем оставлять только каждую третью координату.
                // Вы можете придумать свой способ упрощения контура.
                coordinates = coordinates.filter(function (_, index) {
                    return index % 3 === 0;
                });

                // Когда мы повторно нажимаем кнопку "Нарисовать область" и начинаем рисовать новый многоугольник,
                // то предыдущий многоугольник удаляется.
                // Если вы хотите оставлять предыдущий многоугольник на карте, то удалите код ниже.
                if (polygon) {
                    map.geoObjects.remove(polygon);
                }

                // Создаем новый многоугольник и добавляем его на карту.
                polygon = new ymaps.Polygon([coordinates], {}, polygonOptions);
                map.geoObjects.add(polygon);

                // Меняем состояние кнопки рисования.
                drawButton.state.set('selected', false);
            });
    });
});

function drawLineOverMap(map) {
    var canvas = document.querySelector('#draw-canvas');
    var ctx2d = canvas.getContext('2d');
    var drawing = false;
    var coordinates = [];

    // Задаем размеры canvas-элементу, как у карты.
    var rect = map.container.getParentElement().getBoundingClientRect();
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Применяем стили.
    ctx2d.strokeStyle = canvasOptions.strokeStyle;
    ctx2d.lineWidth = canvasOptions.lineWidth;
    canvas.style.opacity = canvasOptions.opacity;

    // Очищаем холст.
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);

    // Показываем canvas-элемент. Он будет сверху карты из-за position: absolute.
    canvas.style.display = 'block';

    // Когда пользователь зажимает правую кнопку мыши, начинаем запоминать координаты.
    canvas.onmousedown = function (e) {
        drawing = true;
        coordinates.push([e.offsetX, e.offsetY]);
    };

    // При движении мыши запоминаем координаты и рисуем линию.
    canvas.onmousemove = function (e) {
        if (drawing) {
            var last = coordinates[coordinates.length - 1];
            ctx2d.beginPath();
            ctx2d.moveTo(last[0], last[1]);
            ctx2d.lineTo(e.offsetX, e.offsetY);
            ctx2d.stroke();

            coordinates.push([e.offsetX, e.offsetY]);
        }
    };

    return new Promise(function (resolve) {
        // При отпускании кнопки мыши запоминаем координаты и скрываем canvas-элемент.
        canvas.onmouseup = function (e) {
            coordinates.push([e.offsetX, e.offsetY]);
            canvas.style.display = 'none';
            drawing = false;

            coordinates = coordinates.map(function (x) {
                return [x[0] / canvas.width, x[1] / canvas.height];
            });

            resolve(coordinates);
        };
    });
}