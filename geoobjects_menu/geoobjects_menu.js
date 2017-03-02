ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.30954, 37.721587],
            zoom: 8
        }, {
            searchControlProvider: 'yandex#search'
        });
    
    /**
     * A function, which according to the state of the checkboxes in the menu
     * shows or hides the geo objects from the selection.
     */
    function checkState () {
        var shownObjects,
            byColor = new ymaps.GeoQueryResult(),
            byShape = new ymaps.GeoQueryResult();
        
        // Selecting objects by color. 
        if ($('#red').prop('checked')) {
            /**
             * We will search using two parameters:
             * - for point objects using the "preset" field;
             * - for contour objects using the fill color.
             */
            byColor = myObjects.search('options.fillColor = "#ff1000"')
                .add(myObjects.search('options.preset = "islands#redIcon"'));
        }
        if ($('#green').prop('checked')) {
            byColor = myObjects.search('options.fillColor = "#00ff00"')
                .add(myObjects.search('options.preset = "islands#greenIcon"'))
                /**
                 * After we have found all the green objects, we will add them
                 * to the objects found in the previous iteration.
                 */
                .add(byColor);
        }
        if ($('#yellow').prop('checked')) {
            byColor = myObjects.search('options.fillColor = "#ffcc00"')
                .add(myObjects.search('options.preset = "islands#yellowIcon"'))
                .add(byColor);
        }
        // Selecting objects based on shape.
        if ($('#point').prop('checked')) {
            byShape = myObjects.search('geometry.type = "Point"');
        }
        if ($('#polygon').prop('checked')) {
            byShape = myObjects.search('geometry.type = "Polygon"').add(byShape);
        }
        if ($('#circle').prop('checked')) {
            byShape = myObjects.search('geometry.type = "Circle"').add(byShape);
        }
        
        /**
         * We selected objects by color and shape. Now we'll show objects on the map
         * that combine the desired characteristics.
         */
        shownObjects = byColor.intersect(byShape).addToMap(myMap);
        // Objects that were not included in the selection must be removed from the map.
        myObjects.remove(shownObjects).removeFromMap(myMap);
    }
    
    $('#red').click(checkState);
    $('#green').click(checkState);
    $('#yellow').click(checkState);
    $('#point').click(checkState);
    $('#polygon').click(checkState);
    $('#circle').click(checkState);
    
    // Creating objects from their JSON descriptions and adding them to the map.
    window.myObjects = ymaps.geoQuery({
        type: "FeatureCollection",
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [55.34954, 37.721587]
                },
                options: {
                    preset: 'islands#yellowIcon'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Circle',
                    coordinates: [55.24954, 37.5],
                    radius: 20000
                },
                options: {
                    fillColor: "#ffcc00"
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[55.33954, 37.7], [55.43954, 37.7], [55.33954, 38.7], [55.33954, 37.7]]]
                },
                options: {
                    fillColor: "#ffcc00"
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [55.24954, 37.4]
                },
                options: {
                    preset: 'islands#greenIcon'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Circle',
                    coordinates: [55.14954, 37.61587],
                    radius: 10000
                },
                options: {
                    fillColor: '#00ff00'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [55.14954, 37.61587],
                    radius: 10000
                },
                options: {
                    preset: 'islands#redIcon'
                }
            }
        ]
    }).addToMap(myMap);
}
