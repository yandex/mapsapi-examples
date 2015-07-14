ymaps.ready(init);

function init () {
    // Creating a map instance
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Loading a YMapsML file
    ymaps.geoXml.load("http://ogorbacheva.etna.maps.dev.yandex.ru/sandbox/examples/ru/2.1/ymapsml_ballooncontent/data.xml")
        .then(function (res) {
            myMap.geoObjects.add(res.geoObjects); // Добавление геообъектов на карту
        }, function (error){   // Вызывается в случае неудачной загрузки YMapsML-файла
            alert('Ошибка: ' + error);
        });
}
