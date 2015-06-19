ymaps.ready(init);

var myMap;

function init () {
    // Параметры карты можно задать в конструкторе.
    myMap = new ymaps.Map(
        // ID DOM-элемента, в который будет добавлена карта.
        'map',
        // Параметры карты.
        {
            // Географические координаты центра отображаемой карты.
            center: [55.76, 37.64],
            // Масштаб.
            zoom: 10,
            // Тип покрытия карты: "Спутник".
            type: 'yandex#satellite'
        }, {
            // Поиск по организациям.
            searchControlProvider: 'yandex#search'
        }
    );
}

function setCenter () {
    myMap.setCenter([57.767265, 40.925358]);
}

function setBounds () {
    // Bounds - границы видимой области карты.
    // Задаются в географических координатах самой юго-восточной и самой северо-западной точек видимой области.
    myMap.setBounds([[37, 38], [39, 40]]);
}

function setTypeAndPan () {
    // Меняем тип карты на "Народный гибрид".
    myMap.setType('yandex#publicMapHybrid');
    // Плавное перемещение центра карты в точку с новыми координатами.
    myMap.panTo([62.915, 34.461], {
            // Задержка между перемещениями.
            delay: 1500
        });
}
