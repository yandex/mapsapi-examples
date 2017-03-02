function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.74, 37.58],
        zoom: 13,
        controls: []
    });
    
    /**
     * Creating an instance of the "Search on map" control
     * with the option enabled for the business search data provider.
     */
    var searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search'
        }
    });
    
    myMap.controls.add(searchControl);
    
    /**
     * Programmatically performing a search for specific cafes within the
     * rectangular map area.
     */
    searchControl.search('Shokoladnitsa');
}

ymaps.ready(init);

