function init() {
    // Declaring a set of reference points and an array of throughpoint indexes
    var referencePoints = [
            "Moscow, Leninsky Avenue",
            "Moscow, Lva Tolstogo Street, 16",
            "Moscow, Kremlin embankment",
            "Moscow, Sokolniki Park"
        ]
        viaIndexes = [2];

    // Creating a multiroute and using options to configure its appearance.
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: referencePoints,
        params: {viaIndexes: viaIndexes}
    }, {
        // Display options for waypoints.
        wayPointStartIconColor: "#000000",
        // Setting a custom image for the last waypoint.
        wayPointFinishIconLayout: "default#image",
        wayPointFinishIconImageHref: "images/sokolniki.png",
        wayPointFinishIconImageSize: [30, 30],
        wayPointFinishIconImageOffset: [-15, -15],
        /**
         * This allows hiding the icon for the route's waypoints.
         * wayPointVisible:false,
         */

        // Display options for throughpoints.
        viaPointIconRadius: 7,
        viaPointIconFillColor: "#000088",
        viaPointActiveIconFillColor: "#E63E92",
        /**
         * Throughpoints can be dragged,
         * and the route will adjust.
         */
        viaPointDraggable: true,
        /**
         * This allows hiding the icon for the route's throughpoints.
         * viaPointVisible:false,
         */

        // Display options for pin markers under waypoints.
        pinIconFillColor: "#000088",
        pinActiveIconFillColor: "#E63E92",
        /**
         * This allows hiding pin markers for waypoints.
         * pinVisible:false,
         */

        // Display options for the route line.
        routeStrokeWidth: 2,
        routeStrokeColor: "#000088",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#E63E92",

        // The appearance of a walking route line.
        routeActivePedestrianSegmentStrokeStyle: "solid",
        routeActivePedestrianSegmentStrokeColor: "#00CDCD",

        // Automatically set the map boundaries so the entire route is visible.
        boundsAutoApply: true
    });

    // Setting the display options for the second point by directly accessing it.
    customizeSecondPoint();

    // Creating buttons.
    var removePointsButton = new ymaps.control.Button({
            data: {content: "Deleting intermediate points"},
            options: {selectOnClick: true}
        }),
        routingModeButton = new ymaps.control.Button({
            data: {content: "Route type"},
            options: {selectOnClick: true}
        });

    // Declaring handlers for the buttons.
    removePointsButton.events.add('select', function () {
        multiRoute.model.setReferencePoints([
            referencePoints[0],
            referencePoints[referencePoints.length - 1]
        ], []);
    });

    removePointsButton.events.add('deselect', function () {
        multiRoute.model.setReferencePoints(referencePoints, viaIndexes);
        // Since the second point was deleted, we have to set it up again.
        customizeSecondPoint();
    });

    routingModeButton.events.add('select', function () {
        multiRoute.model.setParams({routingMode: 'pedestrian'}, true);
    });

    routingModeButton.events.add('deselect', function () {
        multiRoute.model.setParams({routingMode: 'auto'}, true);
    });

    // Function for configuring the appearance of the second point.
    function customizeSecondPoint() {
        /**
         * Waiting for the multiroute data to load and the views of the waypoints to be created.
         * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel-docpage/#event-requestsuccess
          */
        multiRoute.model.events.once("requestsuccess", function () {
            var yandexWayPoint = multiRoute.getWayPoints().get(1);
            // Creating a balloon for the second waypoint's marker.
            ymaps.geoObject.addon.balloon.get(yandexWayPoint);
            yandexWayPoint.options.set({
                preset: "islands#grayStretchyIcon",
                iconContentLayout: ymaps.templateLayoutFactory.createClass(
                    '<span style="color: red;">Y</span>andex'
                ),
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    '{{ properties.address|raw }}'
                )
            });
        });
    }

    // Creating the map with the button added to it.
    var myMap = new ymaps.Map('map', {
            center: [55.739625, 37.54120],
            zoom: 7,
            controls: [removePointsButton, routingModeButton]
        }, {
            buttonMaxWidth: 300
        });

    // Adding a multiroute to the map.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
