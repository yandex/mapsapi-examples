ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map("map", {
            center: [54.83, 37.11],
            zoom: 5
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myPlacemark = new ymaps.Placemark([55.907228, 31.260503], {
            // In order for the balloon and hint to open on the placemark, you need to set certain properties.
            balloonContentHeader: "The placemark balloon",
            balloonContentBody: "Content of the <em>placemark</em> balloon",
            balloonContentFooter: "Basement",
            hintContent: "The placemark hint"
        });

    myMap.geoObjects.add(myPlacemark);

    // Opening the balloon on the map (without binding to the geo object).
    myMap.balloon.open([51.85, 38.37], "Balloon content", {
        // Option: do not show the close button.
        closeButton: false
    });

    // Showing the hint on the map (without binding to the geo object).
    myMap.hint.open(myMap.getCenter(), "Lone hint without a placemark", {
        // Option: delay before opening.
        openTimeout: 1500
    });
}
