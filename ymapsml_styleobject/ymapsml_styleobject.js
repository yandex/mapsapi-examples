ymaps.ready(init);

function init () {
    // Создание экземпляра карты.
    var myMap = new ymaps.Map('map', {
        center: [55.692, 37.561],
        zoom: 16
    });
    // Загрузка YMapsML-файла.
    ymaps.geoXml.load('ymapsml_data.xml')
        .then(function (res) {
            myMap.geoObjects.add(res.geoObjects); // Добавление геообъектов на карту
        },
        function (error){   // Вызывается в случае неудачной загрузки YMapsML-файла
            alert('При загрузке YMapsML-файла произошла ошибка: ' + error);
        });
}