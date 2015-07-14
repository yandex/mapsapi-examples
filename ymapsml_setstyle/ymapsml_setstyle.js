ymaps.ready(init);

function init () {
    // Creating a map instance
    var myMap = new ymaps.Map('map', {
            center: [61.766513, 34.344165],
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Loading a YMapsML file
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            // Adding geo objects to the map.
            myMap.geoObjects.add(res.geoObjects);
            // Called if loading the YMapsML file was unsuccessful.
        }, function (error){
            alert('Ошибка: ' + error);
        });
}
