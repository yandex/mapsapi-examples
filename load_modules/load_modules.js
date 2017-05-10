ymaps.ready(function () {
    // The function receives the namespace that contains everything you've requested during initialization of modules. 
    var myMap = new ymaps.Map('map', {
            center: [47.218055565556, -1.5527777877778],
            zoom: 7,
            // In this example, the map is created without controls, because they were not loaded during API initialization.
            controls: []
        }),
        placemark = new ymaps.Placemark(
            myMap.getCenter(), {
                balloonContent: 'Nantes is the sixth largest city in France'
            }
        );
    myMap.geoObjects.add(placemark);    

});
