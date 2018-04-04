var myMap;
var script;

function init(ymaps) {
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
        // Запишем ссылку на JS API Яндекс.Карт с выбранным языком в атрибут 'src'.
        script.src = 'https://api-maps.yandex.ru/2.1/?onload=init_' + language + '&lang=' + language +
            '_RU&ns=ymaps_' + language;
        // Добавим элемент 'script' на страницу.
        head.appendChild(script);
        // Использование пространства имен позволяет избежать пересечения названий функций
        // и прочих программных компонентов.
        window['init_' + language] = function () {
            init(window['ymaps_' + language]);
        }
    };
    // Назначим обработчик для события выбора языка из списка.
    document.getElementById('language').addEventListener("change", select.createMap);
    // Создадим карту и зададим для нее язык, который был выбран по умолчанию.
    select.createMap();
};
