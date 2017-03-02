ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [63.369315, 105.440191],
            zoom: 3
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a clusterer with a red icon (the default is blue).
    var clusterer = new ymaps.Clusterer({preset: 'islands#redClusterIcons'}),
    // Creating a collection of geo objects.
        collection = new ymaps.GeoObjectCollection(),
    // Additional input field when clusterization is enabled.
        gridSizeField = $('<div class="field" style="display: none">Size of the cluster cell in pixels: <input type="text" size="6" id ="gridSize" value="64"/></div>')
            .appendTo('.inputs');

    // Adding the clusterer to the map.
    myMap.geoObjects.add(clusterer);

    // Adding a collection of geo objects to the map.
    myMap.geoObjects.add(collection);

    $('#useClusterer').bind('click', toggleGridSizeField);
    $('#addMarkers').bind('click', addMarkers);
    $('#removeMarkers').bind('click', removeMarkers);

    // Adding placemarks with arbitrary coordinates.
    function addMarkers () {
        // The number of placemarks that you want to add to the map.
        var placemarksNumber = $('#count').val(),
            bounds = myMap.getBounds(),
            // Flag indicating whether to cluster objects.
            useClusterer = $('#useClusterer').is(':checked'),
            // The clusterer cell size, specified by the user.
            gridSize = parseInt($('#gridSize').val()),
            // Generating the required number of new objects.
            newPlacemarks = createGeoObjects(placemarksNumber, bounds);

        if (gridSize > 0) {
            clusterer.options.set({
                gridSize: gridSize
            });
        }

        /**
         * If you are using the clusterer, add the cluster to the map;
         * if not using it, add the collection of geo objects to the map.
         */
        if (useClusterer) {
            // Adding an array of placemarks to the clusterer.
            clusterer.add(newPlacemarks);
        } else {
            for (var i = 0, l = newPlacemarks.length; i < l; i++) {
                collection.add(newPlacemarks[i]);
            }
        }
    }

    // A function that creates the necessary number of geo objects within a specified area.
    function createGeoObjects (number, bounds) {
        var placemarks = [];
        // Creating the desired number of placemarks
        for (var i = 0; i < number; i++) {
            // Generating placemark coordinates randomly.
            coordinates = getRandomCoordinates(bounds);
            // Creating a placemark with random coordinates.
            myPlacemark = new ymaps.Placemark(coordinates);
            placemarks.push(myPlacemark);
        }
        return placemarks;
    }

    /**
     * A function that generates random coordinates
     * within the viewport of the map.
     */
    function getRandomCoordinates (bounds) {
        var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
        return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
    }

    // Show/hide additional input field.
    function toggleGridSizeField () {
        /**
         * If the user has enabled clusterization mode, an additional input field appears
         * for entering a clusterization option - the size of cluster cells, in pixels.
         * By default, the cluster cell size is 64.
         * When clusterization is disabled, the additional input field is hidden.
         */
        gridSizeField.toggle();
    }

    // Removing all placemarks from the map
    function removeMarkers () {
        // Removing all placemarks from the clusterer.
        clusterer.removeAll();
        // Removing all placemarks from the collection.
        collection.removeAll();
    }
}
