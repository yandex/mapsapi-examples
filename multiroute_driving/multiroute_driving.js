function init () {
    /**
     * Creating a multiroute.
     * The first argument passes either the model or object description model.
     * The second argument passes the multiroute display options.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml
      */
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        // The description of the reference points on the multi-stop route.
        referencePoints: [
            [55.734876, 37.59308],
            "Masnitskaya st., Moscow"
        ],
        // Routing options.
        params: {
            // Limit on the maximum number of routes returned by the router.
            results: 2
        }
    }, {
        // Automatically set the map boundaries so the entire route is visible.
        boundsAutoApply: true
    });

    // Creating buttons for controlling the multiroute.
    var trafficButton = new ymaps.control.Button({
            data: { content: "Considering traffic" },
            options: { selectOnClick: true }
        }),
        viaPointButton = new ymaps.control.Button({
            data: { content: "Adding a throughpoint" },
            options: { selectOnClick: true }
        });

    // Declaring handlers for the buttons.
    trafficButton.events.add('select', function () {
        /**
         * Setting routing parameters for the multiroute model.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setParams
          */
        multiRoute.model.setParams({ avoidTrafficJams: true }, true);
    });

    trafficButton.events.add('deselect', function () {
        multiRoute.model.setParams({ avoidTrafficJams: false }, true);
    });

    viaPointButton.events.add('select', function () {
        var referencePoints = multiRoute.model.getReferencePoints();
        referencePoints.splice(1, 0, "7 Solyanka st., Moscow");
        /**
         * Adding a throughpoint to the multiroute model.
         * Note that throughpoints can only be placed between two waypoints.
         * In other words, they can't be end points on a route.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setReferencePoints
          */
        multiRoute.model.setReferencePoints(referencePoints, [1]);
    });

    viaPointButton.events.add('deselect', function () {
        var referencePoints = multiRoute.model.getReferencePoints();
        referencePoints.splice(1, 1);
        multiRoute.model.setReferencePoints(referencePoints, []);
    });

    // Creating the map with buttons added to it.
    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
        controls: [trafficButton, viaPointButton]
    }, {
        buttonMaxWidth: 300
    });

    // Adding a multiroute to the map.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
