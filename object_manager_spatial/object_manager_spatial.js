ymaps.ready(function () {

    var map = new ymaps.Map('map', {
        center: [55.79, 37.64],
        zoom: 10,
        controls: ['zoomControl']
    }),
    objectManager = new ymaps.ObjectManager();

    // Loading a GeoJSON file with object descriptions.
    $.getJSON('data.json')
        .done(function (geoJson) {
            // Adding JSON object descriptions to the object manager.
            objectManager.add(geoJson);
            // Adding objects to the map.
            map.geoObjects.add(objectManager);
        });
});
