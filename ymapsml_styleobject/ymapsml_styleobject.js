ymaps.ready(init);

function init () {
    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
            center: [55.692, 37.561],
            zoom: 16
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Loading a YMapsML file.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            // Adding geo objects to the map.
            myMap.geoObjects.add(res.geoObjects);
        }, function (error){
            alert('When loading the YMapsML file, the following error occurred: ' + error);
        });
}
