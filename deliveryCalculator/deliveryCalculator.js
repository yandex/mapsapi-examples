ymaps.ready(['DeliveryCalculator']).then(function init() {
    var myMap = new ymaps.Map('map', {
            center: [60.906882, 30.067233],
            zoom: 9,
            type: 'yandex#map',
            controls: []
        }),
        searchStartPoint = new ymaps.control.SearchControl({
            options: {
                useMapBounds: true,
                noPlacemark: true,
                noPopup: true,
                placeholderContent: 'Address of the starting point',
                size: 'large'
            }
        }),
        searchFinishPoint = new ymaps.control.SearchControl({
            options: {
                useMapBounds: true,
                noCentering: true,
                noPopup: true,
                noPlacemark: true,
                placeholderContent: 'Address of the destination point',
                size: 'large',
                float: 'none',
                position: {left: 10, top: 44}
            }
        }),
        calculator = new ymaps.DeliveryCalculator(myMap),
        routeButton = new ymaps.control.Button({
            data: {content: 'Moscow-St. Petersburg'},
            options: {selectOnClick: false, maxWidth: 200}
        });

    myMap.controls.add(searchStartPoint)
        .add(searchFinishPoint)
        .add(routeButton, {float: 'none', position: {left: 10, bottom: 40}});

    searchStartPoint.events
        .add('resultselect', function (e) {
            var results = searchStartPoint.getResultsArray(),
                selected = e.get('index'),
                point = results[selected].geometry.getCoordinates(),
                balloonContent = results[selected].properties.get("balloonContent");

            // Setting the start of the route.
            calculator.setPoint("start", point, balloonContent);

        })
        .add('load', function (event) {
            /**
             * The 'skip' field indicates that it's not shuffling through search result pages.
             * The 'getResultsCount' field indicates that there is at least one result.
             */
            if (!event.get('skip') && searchStartPoint.getResultsCount()) {
                searchStartPoint.showResult(0);
            }
        });

    searchFinishPoint.events
        .add('resultselect', function (e) {
            var results = searchFinishPoint.getResultsArray(),
                selected = e.get('index'),
                point = results[selected].geometry.getCoordinates(),
                balloonContent = results[selected].properties.get("balloonContent");

            // Setting the route destination.
            calculator.setPoint("finish", point, balloonContent);
        })
        .add('load', function (event) {
            /**
             * The 'skip' field indicates that it's not shuffling through search result pages.
             * The 'getResultsCount' field indicates that there is at least one result.
             */
            if (!event.get('skip') && searchFinishPoint.getResultsCount()) {
                searchFinishPoint.showResult(0);
            }
        });

    routeButton.events
        .add('click', function () {
            calculator.setRoute([59.939095, 30.315868], [55.757026, 37.615032])
        });
});
