var myMap;

ymaps.ready(function () {
    myMap = new ymaps.Map('map', {
        zoom: 4,
        center: [54.78, 30.08],
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });
    var myPlacemark = new ymaps.Placemark([55.76, 37.64], {
        balloonContent: 'I went off the map'
    }, {
        balloonPanelMaxMapArea: 0
    });
    myMap.geoObjects.add(myPlacemark);
    
    observeEvents(myMap);
    
    myPlacemark.balloon.open();
});

function observeEvents (map) {
    var mapEventsGroup;
    map.geoObjects.each(function (geoObject) {
        geoObject.balloon.events
            // When opening a balloon, begin to listen for a change to the center of the map.
            .add('open', function (e1) {
                var placemark = e1.get('target');
                // Calling a function in two cases:
                mapEventsGroup = map.events.group()
                    // 1) in the beginning of the movement (if the balloon is in an external container),
                    .add('actiontick', function (e2) {
                        if (placemark.options.get('balloonPane') == 'outerBalloon') {
                            setBalloonPane(map, placemark, e2.get('tick'));
                        }
                    })
                    // 2) at the end of the movement (if the balloon is in the internal container).
                    .add('actiontickcomplete', function (e2) {
                        if (placemark.options.get('balloonPane') != 'outerBalloon') {
                            setBalloonPane(map, placemark, e2.get('tick'));
                        }
                    });
                // Calling the function immediately after opening.
                setBalloonPane(map, placemark);
            })
            // When closing a balloon, we remove listeners.
            .add('close', function () {
                mapEventsGroup.removeAll();
            });
    });
}

function setBalloonPane (map, placemark, mapData) {
    mapData = mapData || {
        globalPixelCenter: map.getGlobalPixelCenter(),
        zoom: map.getZoom()
    };

    var mapSize = map.container.getSize(),
        mapBounds = [
            [mapData.globalPixelCenter[0] - mapSize[0] / 2, mapData.globalPixelCenter[1] - mapSize[1] / 2],
            [mapData.globalPixelCenter[0] + mapSize[0] / 2, mapData.globalPixelCenter[1] + mapSize[1] / 2]
        ],
        balloonPosition = placemark.balloon.getPosition(),
    // Used when changing the zoom.
        zoomFactor = Math.pow(2, mapData.zoom - map.getZoom()),
    // Determining whether the anchor point of a balloon is in the visible area of the map.
        pointInBounds = ymaps.util.pixelBounds.containsPoint(mapBounds, [
            balloonPosition[0] * zoomFactor,
            balloonPosition[1] * zoomFactor
        ]),
        isInOutersPane = placemark.options.get('balloonPane') == 'outerBalloon';

    // If the anchor does not fall within the visible area of the map, we move the balloon into the inner container
    if (!pointInBounds && isInOutersPane) {
        placemark.options.set({
            balloonPane: 'balloon',
            balloonShadowPane: 'shadows'
        });
        // and the reverse.
    } else if (pointInBounds && !isInOutersPane) {
        placemark.options.set({
            balloonPane: 'outerBalloon',
            balloonShadowPane: 'outerBalloon'
        });
    }
}
