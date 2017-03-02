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
        // The data.json file defines the geometry, options, and data for placemarks.
        url: "data.json"
    }).done(function(data) {
        objectManager.add(data);
    });

}
