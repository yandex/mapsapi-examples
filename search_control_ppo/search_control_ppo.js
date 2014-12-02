function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.74, 37.58],
        zoom: 13,
        controls: [];
    });
    
    // Создадим экземпляр элемента управления «поиск по карте», 
    // с установленной опцией провайдера данных для поиска по организациям.
    var searchControl = new ymaps.SearchControl({
        options: {
            provider: 'yandex#search'
        }
    });
    
    myMap.controls.add(searchControl);
    
    // Программно выполним поиск кафе в текущей 
    // прямоугольной области карты.
    searchControl.search('кафе');
};

ymaps.ready(init);

