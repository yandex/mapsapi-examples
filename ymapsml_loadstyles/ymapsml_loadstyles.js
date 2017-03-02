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
                    alert('When loading the YMapsML file, the following error occurred: ' + error);
                }
            );
        },
        // Called if styles have been loaded unsuccessfully.
        function (error) {
            alert('When loading styles, the following error occurred: ' + error);
        }
    );

}
