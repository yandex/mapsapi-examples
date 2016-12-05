ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.95, 32.44],
            zoom: 2
        }),

        myPlacemark1 = new ymaps.Placemark([55.85, 60.64], {
            balloonContent: 'Маленькая иконка'
        }, {
            iconLayout: 'default#image',
            iconImageClipRect: [[0,0], [26, 47]],
            iconImageHref: 'images/sprite.png',
            iconImageSize: [15, 27],
            iconImageOffset: [-15, -27],
        }),

        myPlacemark2 = new ymaps.Placemark([55.85, 32.64], {
            balloonContent: 'Средняя иконка'
        }, {
            iconLayout: 'default#image',
            iconImageClipRect: [[34,0], [62, 46]],
            iconImageHref: 'images/sprite.png',
            iconImageSize: [26, 46],
            iconImageOffset: [-26, -46]
        }),

        myPlacemark3 = new ymaps.Placemark([55.85, 1.0], {
            balloonContent: 'Большая иконка'
        }, {
            iconLayout: 'default#image',
            iconImageClipRect: [[69,0], [97, 46]],
            iconImageHref: 'images/sprite.png',
            iconImageSize: [35, 63],
            iconImageOffset: [-35, -63]
        });

    myMap.geoObjects.add(myPlacemark1)
        .add(myPlacemark2)
        .add(myPlacemark3);
}
