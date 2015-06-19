ymaps.ready(init);

function init () {
    // Создание экземпляра карты.
    var myMap = new ymaps.Map('map', {
        center: [50.76, 35.64],
        zoom: 0
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Загрузка YMapsML-файла.
    ymaps.geoXml.load('ymapsml.xml')
        .then(function (res) {
            myMap.geoObjects.add(res.geoObjects);
        },
        // Вызывается в случае неудачной загрузки YMapsML-файла.
        function (error) {
            alert('При загрузке YMapsML-файла произошла ошибка: ' + error);
        });
}