function init () {
    // Creating a multiroute model.
    var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([
        [55.734876, 37.59308],
        "Москва, ул. Мясницкая"
    ], {
        // Waypoints can be dragged. The route adjusts when this happens.
        wayPointDraggable: true,
        boundsAutoApply: true
    });

    // Creating a button that switches the model to routing on public transport.
    var masstransitButton = new ymaps.control.Button({
        data: { content: "На общественном транспорте"},
        options: { selectOnClick: true }
    });

    // Declaring handlers for the button.
    masstransitButton.events.add('select', function () {
        multiRouteModel.setParams({ routingMode: 'masstransit' }, true);
    });

    masstransitButton.events.add('deselect', function () {
        multiRouteModel.setParams({ routingMode: 'auto' }, true);
    });

    ymaps.modules.require([
        'MultiRouteCustomView'
    ], function (MultiRouteCustomView) {
        // Creating an instance of a textual display of the multiroute model. See the
        // custom_view.js file.
        new MultiRouteCustomView(multiRouteModel);
    });

    // Creating the map with the button added to it.
    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
        controls: [masstransitButton]
    }, {
        buttonMaxWidth: 300
    });

    // It will be based on the existing multiroute model.
    var multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
        // Waypoints can be dragged. The route adjusts when this happens.
        wayPointDraggable: true,
        boundsAutoApply: true
    });

    // Adding a multiroute to the map.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
