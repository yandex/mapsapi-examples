function init () {
    // Creating a multiroute.
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            "Москва, ул. Барклая",
            "Москва, шоссе Энтузиастов 70"
        ],
        params: {
            routingMode: 'masstransit'
        }
    });

    ymaps.modules.require([
        'MultiRouteColorizer'
    ], function (MultiRouteColorizer) {
        // Creating an object that color codes the lines of route segments.
        new MultiRouteColorizer(multiRoute);
    });

    // Creating the map.
    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 2,
        controls: []
    }, {
        buttonMaxWidth: 300
    });

    // Adding a multiroute to the map.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
