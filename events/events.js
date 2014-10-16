var myMap;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map("map", {
        // Красное-на-Волге
        center:[57.513314, 41.23869],
        zoom:9
    });

    // Отключим стандартную реакцию карты на правый щелчок мыши.
    myMap.behaviors.disable('rightMouseButtonMagnifier');

    // Поймаем щелчок левой кнопкой мыши в любой точке карты.
    myMap.events.add('click', function (e) {
        alert("Щёлк-щёлк левой в точке (" +
            // Получаем географические координаты события
            e.get('coordPosition').join(',') +
        ")!");
    });

    // Более сложный пример:
    // подсчет щелчков правой кнопкой мыши.
    clicker = new Clicker();
    clicker.beginListening();
}


// Класс обработчика событий мыши.
function Clicker () {
    this.counter = 0;

    // Счетчик щелков правой кнопкой мыши.
    this.onMapClick = function () {
        this.counter++;
        alert("Щёлк-щёлк правой №" + this.counter);
    };

    // Начинает слушать события карты.
    this.beginListening = function () {
        this.eventListener = myMap.events.group()
            .add('contextmenu', this.onMapClick, this)
            .add('destroy', this.endListening, this);
    };

    // Прекращает слушать события карты.
    this.endListening = function () {
        this.eventListener.removeAll();
    };

}