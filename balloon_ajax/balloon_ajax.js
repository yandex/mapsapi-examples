ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map("map", {
            center: [54.83, 37.11],
            zoom: 5
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // A placemark with balloon contents loaded using AJAX.
        placemark = new ymaps.Placemark([55.8, 37.72], {
            iconContent: "Узнать адрес",
            hintContent: "Перетащите метку и кликните, чтобы узнать адрес"
        }, {
            // Disabling the replacement of the conventional balloon with the balloon panel.
            balloonPanelMaxMapArea: 0,
            draggable: "true",
            preset: "islands#blueStretchyIcon",
            // Making the balloon open even if there is no content.
            openEmptyBalloon: true
        });

    // Handling the event of opening the balloon on the geo object: begin loading data, then
    // updating its contents.
    placemark.events.add('balloonopen', function (e) {
        placemark.properties.set('balloonContent', "Идет загрузка данных...");

        // Imitating a delay when loading data (for demonstration purposes).
        setTimeout(function () {
            ymaps.geocode(placemark.geometry.getCoordinates(), {
                results: 1
            }).then(function (res) {
                var newContent = res.geoObjects.get(0) ?
                        res.geoObjects.get(0).properties.get('name') :
                        'Не удалось определить адрес.';

                // Setting the new content of the balloon in the corresponding placemark property.
                placemark.properties.set('balloonContent', newContent);
            });
        }, 1500);
    });

    myMap.geoObjects.add(placemark);
}
