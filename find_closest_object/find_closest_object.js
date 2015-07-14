ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        }),
        cafe, metro;
    
    function findClosestObjects () {
        // Searching the selection for the cafe nearest to the found metro station, and opening its
        // balloon.        cafe.getClosestTo(metro.get(0)).balloon.open();
        
        // Opening the balloon of the cafe that is closest to the click.       
        // myMap.events.add('click', function (event) {
            cafe.getClosestTo(event.get('coords')).balloon.open();
        });
    }
    
    ///Cafe descriptions can be stored in JSON format, in order to then generate geo objects from the descriptions using ymaps.geoQuery.    cafe = ymaps.geoQuery({
        type: 'FeatureCollection',
        features: [{
                type: 'Feature',
                properties: {
                    balloonContent: 'Кофейня "Дарт Вейдер" - у нас есть печеньки!'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [55.724166, 37.545849]
                }
            }, {
                type: 'Feature',
                properties: {
                    balloonContent: 'Кафе "Горлум" - пирожные прелесть.'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [55.717495, 37.567886]
                }
            }, {
                type: 'Feature',
                properties: {
                    balloonContent: 'Кафе "Кирпич" - крепкий кофе для крепких парней.'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [55.7210180,37.631057]
                }
            }
        ]
    // Adding points to the map immediately.    }).addToMap(myMap);

    // Using reverse geocoding to find the metro station "Kropotkinskaya".    metro =
    // ymaps.geoQuery(ymaps.geocode([55.744828, 37.603423], {kind: 'metro'}))
    // Waiting for the response from the server and then processing the received results.       
    // .then(findClosestObjects);
}
