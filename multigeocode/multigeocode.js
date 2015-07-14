function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.734046, 37.588628],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });
    
    // You can create a selection from the request to the geocoder. In this case, the results will
    // be added to the sample when the server returns the response. Please note that the best
    // solution is multiple geocoding on the server. For more information about multiple geocoding,
    // see the Developer's Guide.
    var objects = ymaps.geoQuery(ymaps.geocode('Москва, Слесарный переулок, д.3'))
    // You can also add multiple geocoder requests to the selection. They will be executed in
    // sequence.
        .add(ymaps.geocode('Люберцы, Октябрьский проспект д.143'))
        .add(ymaps.geocode([55.734046, 37.588628]))
        .add(ymaps.geocode('Мытищи, ул. Олимпийский проспект, владение 13, корпус А'))
        .add(ymaps.geocode('Москва, 3-я Хорошевская улица д.2, стр.1'))
        .add(ymaps.geocode('Москва, Нижний Сусальный переулок, д.5, стр.4'))
    // After all requests are processed, they will be added to the map.
        .addToMap(myMap);
    
    // Note that all operations are asynchronous, so you will need to wait for data to be prepared
    // before you can continue working with the selection.
    objects.then(function () {
        // This code will be executed after all the requests to the geocoder return a response and
        // objects are added to the map.
        objects.get(0).balloon.open();
    });
}

ymaps.ready(init);

