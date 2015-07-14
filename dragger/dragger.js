jQuery(function () {
    ymaps.ready(init);
});

function init () {
    var map = new ymaps.Map('map', {
            center: [55.819543, 37.611619],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        markerElement = jQuery('#marker'),
        dragger = new ymaps.util.Dragger({
            // Dragger will automatically run when the user clicks on the 'marker' element.        
            // autoStartElement: markerElement[0]
        }),
        // The offset of the marker relative to the cursor.        markerOffset,
        markerPosition;

    dragger.events
        .add('start', onDraggerStart)
        .add('move', onDraggerMove)
        .add('stop', onDraggerEnd);

    function onDraggerStart(event) {   
        var offset = markerElement.offset(),
            position = event.get('position');
        // Saving the offset of the marker relative to the drag starting point.        
        // markerOffset = [
            position[0] - offset.left,
            position[1] - offset.top
        ];
        markerPosition = [
            position[0] - markerOffset[0],
            position[1] - markerOffset[1]
        ];

        applyMarkerPosition();
    }

    function onDraggerMove(event) {
        applyDelta(event);
    }

    function onDraggerEnd(event) {
        applyDelta(event);
        markerPosition[0] += markerOffset[0];
        markerPosition[1] += markerOffset[1];
        // Converting page coordinates to global pixel coordinates.        var markerGlobalPosition
        // = map.converter.pageToGlobal(markerPosition),
            // Getting the center of the map in global pixel coordinates.           
            // mapGlobalPixelCenter = map.getGlobalPixelCenter(),
            // Getting the size of the map container on the page.            mapContainerSize =
            // map.container.getSize(),
            mapContainerHalfSize = [mapContainerSize[0] / 2, mapContainerSize[1] / 2],
            // Calculating the map boundaries in global pixel coordinates.           
            // mapGlobalPixelBounds = [
                [mapGlobalPixelCenter[0] - mapContainerHalfSize[0], mapGlobalPixelCenter[1] - mapContainerHalfSize[1]],
                [mapGlobalPixelCenter[0] + mapContainerHalfSize[0], mapGlobalPixelCenter[1] + mapContainerHalfSize[1]]
            ];
        // Checking that the dragger finished working in a visible area of the map.        if
        // (containsPoint(mapGlobalPixelBounds, markerGlobalPosition)) {
            // Now we'll convert the global pixel coordinates to geocoordinates with the current
            // zoom level of the map.            var geoPosition =
            // map.options.get('projection').fromGlobalPixels(markerGlobalPosition, map.getZoom());
            alert(geoPosition.join(' '));
        }
    }

    function applyDelta (event) {
        // The 'delta' field contains the difference between the positions of the current and
        // previous dragger events.        var delta = event.get('delta');
        markerPosition[0] += delta[0];
        markerPosition[1] += delta[1];
        applyMarkerPosition();
    }

    function applyMarkerPosition () {
        markerElement.css({
            left: markerPosition[0],
            top: markerPosition[1]
        });
    }

    function containsPoint (bounds, point) {
        return point[0] >= bounds[0][0] && point[0] <= bounds[1][0] &&
               point[1] >= bounds[0][1] && point[1] <= bounds[1][1];
    }
}
