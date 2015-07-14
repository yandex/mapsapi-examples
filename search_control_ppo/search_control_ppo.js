function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.74, 37.58],
        zoom: 13,
        controls: []
    });
    
    // Creating an instance of the "search on map" control, with the data provider for searching by
    // organizations set.
    var searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search'
        }
    });
    
    myMap.controls.add(searchControl);
    
    // Programmatically searching for a cafe in the current rectangular map area.
    searchControl.search('кафе');
}

ymaps.ready(init);

