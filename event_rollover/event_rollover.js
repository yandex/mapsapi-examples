ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.755773, 37.617761],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myPlacemark = new ymaps.Placemark(myMap.getCenter());

    myMap.geoObjects.add(myPlacemark);

    myPlacemark.events
        .add('mouseenter', function (e) {
            // A reference to the object that triggered the event; you can get it from the 'target'
            // field.
            e.get('target').options.set('preset', 'islands#greenIcon');
        })
        .add('mouseleave', function (e) {
            e.get('target').options.unset('preset');
        });
}
