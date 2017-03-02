function init () {
    // Creating a multiroute model.
    var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([
            [55.734876, 37.59308],
            "Masnitskaya st., Moscow"
        ], {
            /**
             * Waypoints can be dragged.
             * The route adjusts when this happens.
             */
            wayPointDraggable: true,
            boundsAutoApply: true
        }),

        // Creating a drop-down list for selecting the route type.
        routeTypeSelector = new ymaps.control.ListBox({
            data: {
                content: 'How to get there'
            },
            items: [
                new ymaps.control.ListBoxItem({data: {content: "Auto"},state: {selected: true}}),
                new ymaps.control.ListBoxItem({data: {content: "Transport"}}),
                new ymaps.control.ListBoxItem({data: {content: "Walk"}})
            ],
            options: {
                itemSelectOnClick: false
            }
        }),
        // Getting direct links to the list items.
        autoRouteItem = routeTypeSelector.get(0),
        masstransitRouteItem = routeTypeSelector.get(1),
        pedestrianRouteItem = routeTypeSelector.get(2);

    // Subscribing to click events on drop-down list items.
    autoRouteItem.events.add('click', function (e) { changeRoutingMode('auto', e.get('target')); });
    masstransitRouteItem.events.add('click', function (e) { changeRoutingMode('masstransit', e.get('target')); });
    pedestrianRouteItem.events.add('click', function (e) { changeRoutingMode('pedestrian', e.get('target')); });

    ymaps.modules.require([
        'MultiRouteCustomView'
    ], function (MultiRouteCustomView) {
        /**
         * Creating an instance of a textual display of the multiroute model.
         * See the custom_view.js file.
         */
        new MultiRouteCustomView(multiRouteModel);
    });

    // Creating the map with the button added to it.
    var myMap = new ymaps.Map('map', {
            center: [55.750625, 37.626],
            zoom: 7,
            controls: [routeTypeSelector]
        }, {
            buttonMaxWidth: 300
        }),

        // It will be based on the existing multiroute model.
        multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
            /**
             * Waypoints can be dragged.
             * The route adjusts when this happens.
             */
            wayPointDraggable: true,
            boundsAutoApply: true
        });

    // Adding a multiroute to the map.
    myMap.geoObjects.add(multiRoute);

    function changeRoutingMode(routingMode, targetItem) {
        multiRouteModel.setParams({ routingMode: routingMode }, true);

        // Disabling an option of selecting elements
        autoRouteItem.deselect();
        masstransitRouteItem.deselect();
        pedestrianRouteItem.deselect();

        // Selecting an element and closing the list.
        targetItem.select();
        routeTypeSelector.collapse();
    }
}

ymaps.ready(init);
