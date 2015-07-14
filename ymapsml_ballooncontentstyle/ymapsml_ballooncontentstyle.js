ymaps.ready(init);

function init () {
    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Loading a YMapsML file.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            // Adding geo objects to the map.
            myMap.geoObjects.add(res.geoObjects);
           // Called if loading the YMapsML file was unsuccessful.
        }, function (error){
            alert('Ошибка: ' + error);
        });
}
