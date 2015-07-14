ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.73, 37.75],
        zoom: 8
    }, {
        searchControlProvider: 'yandex#search'
    });
    
    // Creating objects based on JSON descriptions of geometries.    var objects =
    // ymaps.geoQuery([{
            type: 'Point',
            coordinates: [55.73, 37.75]
        }, {
            type: 'Point',
            coordinates: [55.10, 37.45]
        }, {
            type: 'Point',
            coordinates: [55.25, 37.35]
        }, {
            type: 'Point',
            coordinates: [55.25, 67.35]
        }]);
    
        // Finding objects in the visible area of the map.    objects.searchInside(myMap)
        // And then adding the found objects to the map.        .addToMap(myMap);
    
    myMap.events.add('boundschange', function () {
        // After each shift of the map we will see what objects are in the visible area.        var
        // visibleObjects = objects.searchInside(myMap).addToMap(myMap);
        // Then we'll delete the other objects from the map.       
        // objects.remove(visibleObjects).removeFromMap(myMap);
    });
}
