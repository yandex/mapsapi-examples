ymaps.ready(function () {
    var myMap,
        service = new GeolocationService(),
        myLocation = service.getLocation({
            // Режим получения наиболее точных данных.
            enableHighAccuracy: true,
            // Максимальное время ожидания ответа (в миллисекундах).
            timeout: 10000,
            // Максимальное время жизни полученных данных (в миллисекундах).
            maximumAge: 1000
        });

    myLocation.then(function (loc) {
        var myCoords = [loc.latitude, loc.longitude],
            myPlacemark = new ymaps.Placemark(myCoords, {}, {
                iconImageHref: 'images/geolocation.png',
                iconImageSize: [24, 24],
                iconImageOffset: [-12, -12]
            });

        myMap = new ymaps.Map('YMapsID', {
            center: myCoords,
            zoom: loc.zoom || 9,
            behaviors: ['default', 'scrollZoom']
        });

        myMap.geoObjects.add(myPlacemark);
    });
});