// Performing initialization as soon as the API is loaded and the DOM is ready
ymaps.ready(init);

// Initialization and destruction of the map when the button is clicked.
function init () {
    var myMap;

    $('#toggle').bind({
        click: function () {
            if (!myMap) {
                myMap = new ymaps.Map('map', {
                    center: [55.010251, 82.958437], // Новосибирск
                    zoom: 9
                }, {
                    searchControlProvider: 'yandex#search'
                });
                $("#toggle").attr('value', 'Скрыть карту');
            }
            else {
                myMap.destroy();// Деструктор карты
                myMap = null;
                $("#toggle").attr('value', 'Показать карту снова');
            }
        }
    });
}
