ymaps.ready(init);

function init () {
    // Creating the map.
    var mapSatellite = new ymaps.Map('satelliteTypeId', {
            center: [55.76, 37.64],
            zoom: 8
        }, {
            searchControlProvider: 'yandex#search'
        });

    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            if (res.mapState) {
                // Changing the map type.
                res.mapState.applyToMap(mapSatellite);
            }
        },
        // Called if loading the YMapsML file was unsuccessful.
        function (error) {
            alert('When loading the YMapsML file, the following error occurred: ' + error);
        });
}
