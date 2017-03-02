ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        yellowCollection = new ymaps.GeoObjectCollection(null, {
            preset: 'islands#yellowIcon'
        }),
        blueCollection = new ymaps.GeoObjectCollection(null, {
            preset: 'islands#blueIcon'
        }),
        yellowCoords = [[55.73, 37.75], [55.81, 37.75]],
        blueCoords = [[55.73, 37.65], [55.81, 37.65]];

    for (var i = 0, l = yellowCoords.length; i < l; i++) {
        yellowCollection.add(new ymaps.Placemark(yellowCoords[i]));
    }
    for (var i = 0, l = blueCoords.length; i < l; i++) {
        blueCollection.add(new ymaps.Placemark(blueCoords[i]));
    }

    myMap.geoObjects.add(yellowCollection).add(blueCollection);

    // You can subscribe to events of child elements through collections.
    yellowCollection.events.add('click', function () { alert('Yellow placemark clicked') });
    blueCollection.events.add('click', function () { alert('Blue placemark clicked') });

    // You can set options of child elements through collections.
    blueCollection.options.set('preset', 'islands#blueDotIcon');
}
