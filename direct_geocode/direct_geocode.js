ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 9
    });

    // Find coordinates of the center of Nizhny Novgorod.
    ymaps.geocode('Нижний Новгород', {
        /**
         * Request options
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
          */
        // Sorting the results from the center of the map window. boundedBy: myMap.getBounds(),
        // strictBounds: true, Together with the boundedBy option, the search will be strictly
        // inside the area specified in boundedBy. If you need only one result, we're saving the
        // users bandwidth.
        results: 1
    }).then(function (res) {
            // Selecting the first result of geocoding.
            var firstGeoObject = res.geoObjects.get(0),
                // The coordinates of the geo object.
                coords = firstGeoObject.geometry.getCoordinates(),
                // The viewport of the geo object.
                bounds = firstGeoObject.properties.get('boundedBy');

            // Adding first found geo object to the map.
            myMap.geoObjects.add(firstGeoObject);
            // Scaling the map to the geo object viewport.
            myMap.setBounds(bounds, {
                // Checking the availability of tiles at the given zoom level.
                checkZoomRange: true
            });

            /**
             * All data in the form of a javascript object.
             */
            console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll());
            /**
             * The metadata of the request and geocoder response.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderResponseMetaData.xml
              */
            console.log('Метаданные ответа геокодера: ', res.metaData);
            /**
             * Metadata of the geocoder returned for the found object.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderMetaData.xml
              */
            console.log('Метаданные геокодера: ', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData'));
            /**
             * The accuracy of the response (precision) is only returned for houses.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/precision.xml
              */
            console.log('precision', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.precision'));
            /**
             * The type of found object (kind).
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/kind.xml
              */
            console.log('Тип геообъекта: %s', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.kind'));
            console.log('Название объекта: %s', firstGeoObject.properties.get('name'));
            console.log('Описание объекта: %s', firstGeoObject.properties.get('description'));
            console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'));

            /**
             * To add a placemark with its own styles and balloon content at the coordinates found
             * by the geocoder, create a new placemark at the coordinates of the found placemark and
             * add it to the map in place of the found one.
             */
            /**
             var myPlacemark = new ymaps.Placemark(coords, { iconContent: 'My Placemark', balloonContent: 'Content of the <strong>My Placemark</strong> balloon' } { preset: 'islands#violetStretchyIcon' }); myMap.geoObjects.add(myPlacemark);
             { iconContent: 'моя метка', balloonContent: 'Содержимое балуна <strong>моей метки</strong>' }             
             
             
             
             

             */
        });
}
