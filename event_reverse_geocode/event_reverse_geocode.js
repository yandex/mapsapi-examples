ymaps.ready(init);

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Listening for a click on the map
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        // Moving the placemark if it was already created
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // Otherwise, creating it.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Listening for the dragging end event on the placemark.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    });

    // Creating a placemark
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'searching...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    // Determining the address by coordinates (reverse geocoding).
    function getAddress(coords) {
        myPlacemark.properties.set('iconContent', 'searching...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    iconCaption: firstGeoObject.properties.get('name'),
                    balloonContent: firstGeoObject.properties.get('text')
                });
        });
    }
}
