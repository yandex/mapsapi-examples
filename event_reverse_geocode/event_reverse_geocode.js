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
        myPlacemark.properties.set('iconCaption', 'searching...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Forming a string with the object's data.
                    iconCaption: [
                        // The name of the municipality or the higher territorial-administrative formation.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Getting the path to the toponym; if the method returns null, then requesting the name of the building.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // Specifying a string with the address of the object as the balloon content.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }
}
