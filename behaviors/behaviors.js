var myMap;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map('map', {
        // Санкт-Петербург
        center: [59.93772, 30.313622],
        zoom: 10
    });

    myMap.behaviors
        // Отключаем часть включенных по умолчанию поведений:
        //  - drag - перемещение карты при нажатой левой кнопки мыши;
        //  - magnifier.rightButton - увеличение области, выделенной правой кнопкой мыши.
        .disable(['drag', 'rightMouseButtonMagnifier'])
        // Включаем линейку.
        .enable('ruler');

    // Изменяем свойство поведения с помощью опции:
    // изменение масштаба колесом прокрутки будет происходить медленно,
    // на 1/2 уровня масштабирования в секунду.
    myMap.options.set('scrollZoomSpeed', 0.5);
}