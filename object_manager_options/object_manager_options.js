ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager();

    myMap.geoObjects.add(objectManager);

    $.ajax({
        // В файле data.json заданы геометрия, опции и данные меток .
        url: "data.json"
    }).done(function(data) {
        objectManager.add(data);
    });

}