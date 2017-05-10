ymaps.ready(function () {

    /**
     * The coordinates to build a route to.
     * For example, set the coordinates of your office.
     */
    var targetCoords = [55.752, 37.616],

    // Initializing the map.
        myMap = new ymaps.Map('map', {
            center: targetCoords,
            zoom: 11
        }, {
            // Limiting the number of search results.
            searchControlResults: 1,

            // Disabling autocentering at the found addresses.
            searchControlNoCentering: true,

            // Allowing buttons to have the necessary length.
            buttonMaxWidth: 150
        }),

    // Placemark for the route destination point.
        targetPoint = new ymaps.Placemark(targetCoords, { iconContent: 'Kremlin' }, { preset: 'islands#redStretchyIcon' }),

    // Getting references to the needed controls.
        searchControl = myMap.controls.get('searchControl'),
        geolocationControl = myMap.controls.get('geolocationControl'),

    // Creating a drop-down list for selecting the route type.
        routeTypeSelector = new ymaps.control.ListBox({
            data: {
                content: 'How to get there'
            },
            items: [
                new ymaps.control.ListBoxItem('Driving'),
                new ymaps.control.ListBoxItem('Public transit'),
                new ymaps.control.ListBoxItem('Walking')
            ],
            options: {
                itemSelectOnClick: false
            }
        }),
    // Getting direct links to the list items.
        autoRouteItem = routeTypeSelector.get(0),
        masstransitRouteItem = routeTypeSelector.get(1),
        pedestrianRouteItem = routeTypeSelector.get(2),

    // Placemark for the route starting point.
        sourcePoint,

    // Variables for storing references to the current route.
        currentRoute,
        currentRoutingMode;

    // Adding the destination point to the map.
    myMap.geoObjects.add(targetPoint);

    // Adding the created drop-down list to the map.
    myMap.controls.add(routeTypeSelector);

    // Subscribing to click events on drop-down list items.
    autoRouteItem.events.add('click', function (e) { createRoute('auto', e.get('target')); });
    masstransitRouteItem.events.add('click', function (e) { createRoute('masstransit', e.get('target')); });
    pedestrianRouteItem.events.add('click', function (e) { createRoute('pedestrian', e.get('target')); });

    /**
     * Subscribing to events notifying of three ways of selecting the route starting point:
     *  click on the map, displaying search results, and geolocation.
     */
    myMap.events.add('click', onMapClick);
    searchControl.events.add('resultshow', onSearchShow);
    geolocationControl.events.add('locationchange', onGeolocate);

    /**
     * The following functions respond to the necessary events, remove the previous results from the map,
     * redefine the departure point, and initiate route recalculation.
     */

    function onMapClick (e) {
        clearSourcePoint();
        sourcePoint = new ymaps.Placemark(e.get('coords'), { iconContent: 'From here' }, { preset: 'islands#greenStretchyIcon' });
        myMap.geoObjects.add(sourcePoint);
        createRoute();
    }

    function onSearchShow (e) {
        clearSourcePoint(true);
        sourcePoint = searchControl.getResultsArray()[e.get('index')];
        createRoute();
    }

    function onGeolocate (e) {
        clearSourcePoint();
        sourcePoint = e.get('geoObjects').get(0);
        createRoute();
    }

    function clearSourcePoint (keepSearchResult) {
        if (!keepSearchResult) {
            searchControl.hideResult();
        }

        if (sourcePoint) {
            myMap.geoObjects.remove(sourcePoint);
            sourcePoint = null;
        }
    }

    /**
     * Function that creates a route.
     */
    function createRoute (routingMode, targetBtn) {
        /**
         * If 'routingMode' was passed, it means the call is triggered by a click on a route selection item,
         * so we remove the selection from the other item, select this item, and close the list.
         * Otherwise, we recalculate the existing route, or don't do anything.
         */
        if (routingMode) {
            if (routingMode == 'auto') {
                masstransitRouteItem.deselect();
                pedestrianRouteItem.deselect();
            } else if (routingMode == 'masstransit') {
                autoRouteItem.deselect();
                pedestrianRouteItem.deselect();
            } else if (routingMode == 'pedestrian') {
                autoRouteItem.deselect();
                masstransitRouteItem.deselect();
            }

            targetBtn.select();
            routeTypeSelector.collapse();
        } else if (currentRoutingMode) {
            routingMode = currentRoutingMode;
        } else {
            return;
        }

        // If the route starting point hasn't been selected yet, we don't do anything.
        if (!sourcePoint) {
            currentRoutingMode = routingMode;
            geolocationControl.events.fire('press');
            return;
        }

        // Deleting the old route.
        clearRoute();

        currentRoutingMode = routingMode;

        // Creating a route with the new type from the starting point to the destination.
        currentRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [sourcePoint, targetPoint],
            params: { routingMode: routingMode }
        }, {
            boundsAutoApply: true
        });

        // Adding the route to the map.
        myMap.geoObjects.add(currentRoute);
    }

    function clearRoute () {
        myMap.geoObjects.remove(currentRoute);
        currentRoute = currentRoutingMode = null;
    }
});
