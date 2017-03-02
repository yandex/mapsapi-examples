ymaps.ready(init);

function init () {
    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
        center: [50.76, 35.64],
        zoom: 0
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Loading a YMapsML file.
    ymaps.geoXml.load('ymapsml.xml')
        .then(function (res) {
            myMap.geoObjects.add(res.geoObjects);
        },
        // Called if loading the YMapsML file was unsuccessful.
        function (error) {
            alert('When loading the YMapsML file, the following error occurred: ' + error);
        });
}
