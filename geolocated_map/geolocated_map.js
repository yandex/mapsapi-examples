ymaps.ready(function () {
    var map;
    ymaps.geolocation.get().then(function (res) {
        var mapContainer = $('#map'),
            bounds = res.geoObjects.get(0).properties.get('boundedBy'),
            // Calculating the viewport for the user's current location.
            mapState = ymaps.util.bounds.getCenterAndZoom(
                bounds,
                [mapContainer.width(), mapContainer.height()]
            );
        createMap(mapState);
    }, function (e) {
        // If the location cannot be obtained, we just create a map.
        createMap({
            center: [55.751574, 37.573856],
            zoom: 2
        });
    });
    
    function createMap (state) {
        map = new ymaps.Map('map', state);
    }
});
