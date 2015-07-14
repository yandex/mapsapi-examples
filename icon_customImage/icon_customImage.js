ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Собственный значок метки'
        }, {
            // Options. You must specify this type of layout.
            iconLayout: 'default#image',
            // Custom image for the placemark icon.
            iconImageHref: 'images/myIcon.gif',
            // The size of the placemark.
            iconImageSize: [30, 42],
            // The offset of the upper left corner of the icon relative to its "tail" (the anchor
            // point).
            iconImageOffset: [-3, -42]
        });

    myMap.geoObjects.add(myPlacemark);
});
