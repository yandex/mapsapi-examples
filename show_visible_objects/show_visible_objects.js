ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.73, 37.75],
        zoom: 8
    }, {
        searchControlProvider: 'yandex#search'
    });
    
    // Создадим объекты на основе JSON-описания геометрий.
    var objects = ymaps.geoQuery([{
            type: 'Point',
            coordinates: [55.73, 37.75]
        }, {
            type: 'Point',
            coordinates: [55.10, 37.45]
        }, {
            type: 'Point',
            coordinates: [55.25, 37.35]
        }, {
            type: 'Point',
            coordinates: [55.25, 67.35]
        }]);
    
        // Найдем объекты, попадающие в видимую область карты.
    objects.searchInside(myMap)
        // И затем добавим найденные объекты на карту.
        .addToMap(myMap);
    
    myMap.events.add('boundschange', function () {
        // После каждого сдвига карты будем смотреть, какие объекты попадают в видимую область.
        var visibleObjects = objects.searchInside(myMap).addToMap(myMap);
        // Оставшиеся объекты будем удалять с карты.
        objects.remove(visibleObjects).removeFromMap(myMap);
    });
}
