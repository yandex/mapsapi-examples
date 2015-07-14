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
    ymaps.geoXml.load("http://geocode-maps.yandex.ru/1.x/?geocode=поселок Рай")
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
            alert("При загрузке YMapsML-файла произошла ошибка: " + error);
        });
}
