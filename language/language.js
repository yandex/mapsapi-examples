var myMap;
var script;

function init() {
    myMap = new ymaps.Map("map", {
            center: [55.9238145091058, 37.897131347654376],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
}

window.onload = function () {
    // Получим ссылки на элементы с тегом 'head' и 'select'.
    var head = document.getElementsByTagName('head')[0];
    var select = document.getElementById('language');
    select.createMap = function () {
        // Получим значение выбранного языка.
        var language = this.value;
        // Если карта уже была создана, то удалим её.
        if (myMap) {
            myMap.destroy();
        }
        // Создадим элемент 'script'.
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        // Запишем ссылку на JS API Яндекс Карт с выбранным языков в атрибут 'src'.
        script.src = 'https://api-maps.yandex.ru/2.1/?onload=init&lang=' + language + '_RU';
        // Добавим элемент 'script' на страницу.
        head.appendChild(script);
    };
    // Назначим обработчик события выбора языка из списка.
    document.getElementById('language').addEventListener("change", select.createMap);
    // Создадим карту с языком выбранным по умолчанию.
    select.createMap();
};
