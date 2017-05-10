ymaps.ready(function () {
    var myMap = new ymaps.Map('YMapsID', {
        center: [55.733835, 37.588227],
        zoom: 12,
        /**
         * Please note that in the API 2.1, the map is created with controls by default.
         * If you don't need to add them to the map, pass an empty array in the "controls" field in its parameters.
         */
        controls: []
    });

    var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        balloonContentBody: [
            '<address>',
            '<strong>Yandex office in Moscow</strong>',
            '<br/>',
            'Address: 119021, Moscow, Lva Tolstogo Street, 16',
            '<br/>',
            'For more information, see: <a href="https://company.yandex.ru/">https://company.yandex.ru</a>',
            '</address>'
        ].join('')
    }, {
        preset: 'islands#redDotIcon'
    });

    myMap.geoObjects.add(myPlacemark);
});
