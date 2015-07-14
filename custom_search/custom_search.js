function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.7, 37.5],
            zoom: 9,
            controls: ['zoomControl']
        }),
    // Creating a collection.
        myCollection = new ymaps.GeoObjectCollection(),
    // Creating an array with the data.
        myPoints = [
            { coords: [55.77, 37.46], text: 'Трактир' },
            { coords: [55.66, 37.48], text: 'Кафе' },
            { coords: [55.65, 37.42], text: 'Ресторан' },
            { coords: [55.64, 37.54], text: 'Музей' },
            { coords: [55.54, 37.52], text: 'Библиотека' },
            { coords: [55.53, 37.56], text: 'Школа' },
            { coords: [55.61, 37.61], text: 'Аптека' },
            { coords: [55.80, 37.58], text: 'Бар' },
            { coords: [55.71, 37.35], text: 'Институт' },
            { coords: [55.74, 37.57], text: 'Университет' },
            { coords: [55.58, 37.69], text: 'Больница' },
            { coords: [55.57, 37.70], text: 'Цирк' },
            { coords: [55.55, 37.64], text: 'Магазин' },
            { coords: [55.50, 37.75], text: 'Булочная' },
            { coords: [55.81, 37.73], text: 'Полиция' },
            { coords: [55.73, 37.68], text: 'Салон красоты' },
            { coords: [55.86, 37.76], text: 'Баня' },
            { coords: [55.38, 37.69], text: 'Гараж' },
            { coords: [55.91, 37.50], text: 'Дом' },
            { coords: [55.62, 37.32], text: 'Прачечная' },
            { coords: [55.85, 37.41], text: 'Стадион' },
            { coords: [55.67, 37.24], text: 'Вокзал' }
        ];

    // Populating the collection with data.
    for (var i = 0, l = myPoints.length; i < l; i++) {
        var point = myPoints[i];
        myCollection.add(new ymaps.Placemark(
            point.coords, {
                balloonContentBody: point.text
            }
        ));
    }

    // Adding a collection of placemarks to the map.
    myMap.geoObjects.add(myCollection);

    // Creating an instance of the ymaps.control.SearchControl class.
    var mySearchControl = new ymaps.control.SearchControl({
        options: {
            // Replacing the standard data provider (geocoder) with our own.
            provider: new CustomSearchProvider(myPoints),
            // We won't show another placemark when selecting a search result, because the
            // placemarks in the myCollection collection have already been added to the map.
            noPlacemark: true,
            resultsPerPage: 5
        }});

    // Adding the control in the upper right corner,
    myMap.controls
        .add(mySearchControl, { right: 10, top: 10 });
}


// The data provider for ymaps.control.SearchControl. Performs a search for geo objects in the
// "points" array. Implements the IGeocodeProvider interface.
function CustomSearchProvider(points) {
    this.points = points;
}

// The provider searches the "text" field using the standard method String.ptototype.indexOf.
CustomSearchProvider.prototype.geocode = function (request, options) {
    var deferred = new ymaps.vow.defer(),
        geoObjects = new ymaps.GeoObjectCollection(),
    // How many results to skip.
        offset = options.skip || 0,
    // The number of results to return.
        limit = options.results || 20;
        
    var points = [];
    // Searching in the "text" property of each item in the array.
    for (var i = 0, l = this.points.length; i < l; i++) {
        var point = this.points[i];
        if (point.text.toLowerCase().indexOf(request.toLowerCase()) != -1) {
            points.push(point);
        }
    }
    // When forming the response, "offset" and "limit" can be taken into account.
    points = points.splice(offset, limit);
    // Adding points to the resulting collection.
    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i],
            coords = point.coords,
                    text = point.text;

        geoObjects.add(new ymaps.Placemark(coords, {
            name: text + ' name',
            description: text + ' description',
            balloonContentBody: '<p>' + text + '</p>',
            boundedBy: [coords, coords]
        }));
    }

    deferred.resolve({
        // Geo objects in search results.
        geoObjects: geoObjects,
        // Response metainformation.
        metaData: {
            geocoder: {
                // String with the processed request.
                request: request,
                // The number of found results.
                found: geoObjects.getLength(),
                // The number of returned results.
                results: limit,
                // The number of skipped results.
                skip: offset
            }
        }
    });

    // Returning a promise object.
    return deferred.promise();
};

ymaps.ready(init);

