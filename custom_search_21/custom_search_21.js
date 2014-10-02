var myMap;
function init () {
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.63],
        zoom: 14,
        controls: []
    });

    /**
     * @class 
     * Провайдер данных для элемента управления ymaps.control.SearchControl.
     * Осуществляет поиск геообъектов в по массиву points.
     * Реализует интерфейс IGeocodeProvider.
     * @name CustomSearchProvider
     * @param {Object[]} points Массив с точками.
     *
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IGeocodeProvider.xml
     */
    function CustomSearchProvider (points) {
        this._points = points;
    }

    // Провайдер ищет по полю text стандартным методом String.ptototype.indexOf.
    CustomSearchProvider.prototype.geocode = function (request, options) {
        var deferred = ymaps.vow.defer(),
            geoObjects = new ymaps.GeoObjectCollection(),
            // Сколько результатов нужно пропустить.
            offset = options.skip || 0,
            // Количество возвращаемых результатов.
            limit = options.results || 20,
            found = 0, 
            filteredGeoObjects;

        // Ищем запрос в свойстве text каждого элемента массива
        // и записываем найденные результаты в новый.
        filteredGeoObjects = this._points.filter(function (point) {
            return point.text.toLowerCase().indexOf(request.toLowerCase()) != -1;
        });
        
        // Записываем количество найденных результатов.
        found = filteredGeoObjects.length;            

        filteredGeoObjects
            // При формировании ответа можно учитывать offset и limit.
            .splice(offset, limit)
            // Добавляем точки в результирующую коллекцию.
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
            // Геообъекты поисковой выдачи.
            geoObjects: geoObjects,
            // Метаинформация ответа.
            metaData: {
                geocoder: {
                    // Строка обработанного запроса.
                    request: request,
                    // Количество найденных результатов.
                    found: found,
                    // Количество возвращенных результатов.
                    results: limit,
                    // Количество пропущенных результатов.
                    skip: offset
                }
            }
        });

        // Возвращаем объект-обещание.
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

    // Добавляем коллекцию меток на карту.
    myMap.geoObjects.add(myCollection);

    // Заполняем коллекцию данными.
    myPoints.forEach(function (point) {
        myCollection.add(new ymaps.Placemark(
            point.coords, {
                balloonContentBody: point.text
            }
        ));
    });

    /**
     * Создаем экземпляр класса ymaps.control.SearchControl
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.SearchControl.xml
     */
    var mySearchControl = new ymaps.control.SearchControl({
        options: {
            // Заменяем стандартный провайдер данных (геокодер) нашим собственным.
            provider: new CustomSearchProvider(myPoints),
            // Не будем показывать еще одну метку при выборе результата поиска,
            // т.к. метки коллекции myCollection уже добавлены на карту.
            noPlacemark: true
        }
    });

    // Добавляем элемент управления на карту.
    myMap.controls.add(mySearchControl);
}

ymaps.ready(init);