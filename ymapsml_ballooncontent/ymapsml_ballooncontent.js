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
            myMap.geoObjects.add(res.geoObjects); // Adding geo objects to the map
 Called if loading the YMapsML file was unsuccessful.
            alert('Error: ' + error);
        });
}
