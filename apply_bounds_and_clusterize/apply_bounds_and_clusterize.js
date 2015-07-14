function init () {
    var myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    ///Making a geocoding request, then positioning the map so that all objects fall within the map viewport and the zoom level is as high as possible.    var result = ymaps.geoQuery(ymaps.geocode('Арбат')).applyBoundsToMap(myMap, {checkZoomRange: true});
    // Clustering the resulting objects and adding the clusterer to the map. Note that the
    // clusterer is created immediately, but the objects are added to it only after the response is
    // received from the server.    myMap.geoObjects.add(result.clusterize());
}
ymaps.ready(init);
