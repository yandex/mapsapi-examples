ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [56.136, 40.390],
            zoom: 10
        });
    
    // Создадим провайдер пробок "Сейчас" с включенным слоем инфоточек.
    var actualProvider = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });
    // И затем добавим его на карту.
    actualProvider.setMap(myMap);
    
    // Удаление провайдера с карты также производится через метод setMap.
    // actualProvider.setMap(null);
}