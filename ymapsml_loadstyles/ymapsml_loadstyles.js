ymaps.ready(init);

function init () {
    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
            center: [56.76, 38.64],
            zoom: 7
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Loading a YMapsML file.
    ymaps.geoXml.load('overlays_styles.xml')
        .then(
        function () {
            ymaps.geoXml.load('overlays.xml')
                .then(
                function (res) {
                    // Adding geo objects to the map.
                    myMap.geoObjects.add(res.geoObjects);
                },
                // Called if loading the YMapsML file was unsuccessful.
                function (error) {
                    alert('При загрузке YMapsML-файла произошла ошибка: ' + error);
                }
            );
        },
        // Called if loading styles was unsuccessful.
        function (error) {
            alert('При загрузке стилей произошла ошибка: ' + error);
        }
    );

}
