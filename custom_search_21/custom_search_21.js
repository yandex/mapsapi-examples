var myMap;
function init () {
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.63],
        zoom: 14,
        controls: []
    });

    /**
     * @class 
     * Провайдер данных для элемента управления
     * ymaps.control.SearchControl.
     * Осуществляет поиск геообъектов в по массиву points.
     * Реализует интерфейс IGeocodeProvider.
     * @name CustomSearchProvider
     * @param  {Object[]} points Array of points. @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IGeocodeProvider.xml
     *      *
     */
    function CustomSearchProvider (points) {
        this._points = points;
    }

    // The provider searches the "text" field using the standard method String.ptototype.indexOf.
    CustomSearchProvider.prototype.geocode = function (request, options) {
        var deferred = ymaps.vow.defer(),
            geoObjects = new ymaps.GeoObjectCollection(),
            // How many results to skip.
            offset = options.skip || 0,
            // The number of results to return.
            limit = options.results || 20,
            found = 0, 
            filteredGeoObjects;

        // Looking for the query in the "text" property of each item in the array and writing the
        // found results to a new one.
        filteredGeoObjects = this._points.filter(function (point) {
            return point.text.toLowerCase().indexOf(request.toLowerCase()) != -1;
        });
        
        // Writing the number of results found.
        found = filteredGeoObjects.length;            

        filteredGeoObjects
            // When forming the response, "offset" and "limit" can be taken into account.
            .splice(offset, limit)
            // Adding points to the resulting collection.
            .forEach(function (point) {
                var coords = point.coords,
                    text = point.text;

                geoObjects.add(new ymaps.Placemark(coords, {
                    name: text + ' name',
                    description: text + ' description',
                    balloonContentBody: '<p>' + text + '</p>',
                    boundedBy: [coords, coords]
                }));
            });

        deferred.resolve({
            // Geo objects in search results.
            geoObjects: geoObjects,
            // Response metainformation.
            metaData: {
                geocoder: {
                    // String with the processed request.
                    request: request,
                    // The number of found results.
                    found: found,
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

    var myCollection = new ymaps.GeoObjectCollection(),
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
            { coords: [55.73, 37.68], text: 'Салон красоты №1' },
            { coords: [55.75, 37.64], text: 'Салон красоты №2' },
            { coords: [55.75, 37.64], text: 'Салон красоты №3' },
            { coords: [55.75, 37.64], text: 'Салон красоты №4' },
            { coords: [55.75, 37.64], text: 'Салон красоты №5' },
            { coords: [55.75, 37.64], text: 'Салон красоты №6' },
            { coords: [55.75, 37.64], text: 'Салон красоты №7' },
            { coords: [55.75, 37.64], text: 'Салон красоты №8' },
            { coords: [55.75, 37.64], text: 'Салон красоты №9' },
            { coords: [55.75, 37.64], text: 'Салон красоты №10' },
            { coords: [55.75, 37.64], text: 'Салон красоты №11' },
            { coords: [55.75, 37.64], text: 'Салон красоты №12' },
            { coords: [55.75, 37.64], text: 'Салон красоты №13' },
            { coords: [55.75, 37.64], text: 'Салон красоты №14' },
            { coords: [55.75, 37.64], text: 'Салон красоты №15' },
            { coords: [55.75, 37.64], text: 'Салон красоты №16' },
            { coords: [55.86, 37.76], text: 'Баня' },
            { coords: [55.38, 37.69], text: 'Гараж' },
            { coords: [55.91, 37.50], text: 'Дом' },
            { coords: [55.62, 37.32], text: 'Прачечная' },
            { coords: [55.85, 37.41], text: 'Стадион' },
            { coords: [55.67, 37.24], text: 'Вокзал' }
        ];

    // Adding a collection of placemarks to the map.
    myMap.geoObjects.add(myCollection);

    // Populating the collection with data.
    myPoints.forEach(function (point) {
        myCollection.add(new ymaps.Placemark(
            point.coords, {
                balloonContentBody: point.text
            }
        ));
    });

    /**
     * Creating an instance of the ymaps.control.SearchControl class.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.SearchControl.xml
      */
    var mySearchControl = new ymaps.control.SearchControl({
        options: {
            // Replacing the standard data provider (geocoder) with our own.
            provider: new CustomSearchProvider(myPoints),
            // We won't show another placemark when selecting a search result, because the
            // placemarks in the myCollection collection have already been added to the map.
            noPlacemark: true
        }
    });

    // Adding a control to the map.
    myMap.controls.add(mySearchControl);
}

ymaps.ready(init);
