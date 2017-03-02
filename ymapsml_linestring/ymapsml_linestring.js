ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [54.55, 36.27],
            zoom: 12
        }, {
           searchControlProvider: 'yandex#search'
        });

    // After the data from the YMapsML file loads, the callback function is called.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            // Adding geo object collections to the map.
            myMap.geoObjects.add(res.geoObjects);
        }, function (error) {
            alert('When loading styles, the following error occurred: ' + error);
        });
}
