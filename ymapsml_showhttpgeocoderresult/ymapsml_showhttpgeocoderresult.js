ymaps.ready(init);

function init () {
    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Loading geocoding results.
    ymaps.geoXml.load("geocode-maps.yandex.ru/1.x/?geocode=poselok Ray")//http:
        .then(function (res) {
            res.geoObjects.each(function (item) {
                // Boundaries of the map area that contains the found object.
                var bounds = item.properties.get("boundedBy");
                // Adding a geo object to the map.
                myMap.geoObjects.add(item);
                // Changing the map viewport.
                myMap.setBounds(bounds);
            });
        },
        // Called if data loading was unsuccessful.
        function (error) {
            alert("When loading the YMapsML file, the following error occurred: " + error);
        });
}
