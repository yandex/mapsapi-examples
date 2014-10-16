ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [56.136, 40.390],
            zoom: 10
        });

    // Для добавления элемента управления на карту
    // используется поле map.controls.
    // Это поле содержит ссылку на экземпляр класса map.control.Manager.
    
    // Добавление элемента в коллекцию производится
    // с помощью метода add.

    // В метод add можно передать строковый идентификатор
    // элемента управления и его параметры.
    myMap.controls
        // Кнопка изменения масштаба.
        .add('zoomControl', { left: 5, top: 5 })
        // Список типов карты
        .add('typeSelector')
        // Стандартный набор кнопок
        .add('mapTools', { left: 35, top: 5 });

    // Также в метод add можно передать экземпляр класса элемента управления.
    // Например, панель управления пробками.
    var trafficControl = new ymaps.control.TrafficControl();
    myMap.controls
        .add(trafficControl)
        // В конструкторе элемента управления можно задавать расширенные
        // параметры, например, тип карты в обзорной карте.
        .add(new ymaps.control.MiniMap({
            type: 'yandex#publicMap'
        }));
    
    /*
    // Удаление элементов управления производится через метод remove.
    myMap.controls
        .remove(trafficControl)
        .remove('mapTools');
    */
}