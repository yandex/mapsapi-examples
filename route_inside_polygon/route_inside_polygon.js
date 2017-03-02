ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        moscowPolygon;
    
    function onPolygonLoad (json) {
        moscowPolygon = new ymaps.Polygon(json.coordinates);
        // If we do not want the outline to be visible, we set the appropriate option.
        moscowPolygon.options.set('visible', false);
        /**
         * To have geometric operations performed correctly on the projected polygon,
         * you must add it to the map.
         */
        myMap.geoObjects.add(moscowPolygon);
        
        ymaps.route([[55.654884,37.527034], [55.767305,37.976100]]).then(
            function (res) {
                // Combining all the route segments in a selection.
                var pathsObjects = ymaps.geoQuery(res.getPaths()),
                    edges = [];
                    
                // Iterating all the segments and dividing them into sections.
                pathsObjects.each(function (path) {
                    var coordinates = path.geometry.getCoordinates();
                    for (var i = 1, l = coordinates.length; i < l; i++) {
                        edges.push({
                            type: 'LineString',
                            coordinates: [coordinates[i], coordinates[i - 1]]
                        });
                    }
                });
                
                /**
                 * Creating a new selection containing the following:
                 * - sections that define the route;
                 * - the start and end points;
                 * - intermediate points.
                 */
                var routeObjects = ymaps.geoQuery(edges)
                        .add(res.getWayPoints())
                        .add(res.getViaPoints())
                        .setOptions('strokeWidth', 3)
                        .addToMap(myMap),
                    // Finding all the objects that fall inside the ring road.
                    objectsInMoscow = routeObjects.searchInside(moscowPolygon),
                    // Finding the objects that intersect with the ring road.
                    boundaryObjects = routeObjects.searchIntersect(moscowPolygon);
                // Using different colors for objects inside, outside and intersecting the ring road.
                boundaryObjects.setOptions({
                    strokeColor: '#06ff00',
                    preset: 'islands#greenIcon'
                });
                objectsInMoscow.setOptions({
                    strokeColor: '#ff0005',
                    preset: 'islands#redIcon'
                });
                /**
                 * Getting objects outside the Moscow ring road
                 * by subtracting the obtained samples from the source sample.
                 */
                routeObjects.remove(objectsInMoscow).remove(boundaryObjects).setOptions({
                    strokeColor: '#0010ff',
                    preset: 'islands#blueIcon'
                });
            }
        );
    }
    
    $.ajax({
        url: 'moscow.json',
        dataType: 'json',
        success: onPolygonLoad
    });
}
