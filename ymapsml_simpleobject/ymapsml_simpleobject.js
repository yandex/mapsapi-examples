ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 8
        }, {
            searchControlProvider: 'yandex#search'
        });

    // After the data from the YMapsML file loads, the callback function is called.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            // Adding a collection of geo objects to the map.
            myMap.geoObjects.add(res.geoObjects);
        }, function (error) {
            alert('When loading the YMapsML file, the following error occurred: ' + error);
        });
}
