ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.43, 37.75],
            zoom: 8
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objects = ymaps.geoQuery([
            {
                type: 'Point',
                coordinates: [55.73, 37.75]
            },
            {
                type: 'Point',
                coordinates: [55.10, 37.45]
            },
            {
                type: 'Point',
                coordinates: [55.25, 37.35]
            }
        ]).addToMap(myMap),
        circle = new ymaps.Circle([[55.43, 37.7], 10000], null, { draggable: true });
        
    circle.events.add('drag', function () {
        // Objects that fall in the circle will turn red.
        var objectsInsideCircle = objects.searchInside(circle);
        objectsInsideCircle.setOptions('preset', 'islands#redIcon');
        // The remaining objects are blue.
        objects.remove(objectsInsideCircle).setOptions('preset', 'islands#blueIcon');
    });
    myMap.geoObjects.add(circle);
}
