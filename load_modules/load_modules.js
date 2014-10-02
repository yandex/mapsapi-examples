ymaps.ready(function () {
    // В функцию поступает пространство имен, которое содержит все запрощенные при инициализации модули. 
    var myMap = new ymaps.Map('map', {
            center: [47.218055565556, -1.5527777877778],
            zoom: 7,
            // В данном примере карта создается без контролов, так как те не были загружены при инициализации API.
            controls: []
        }),
        placemark = new ymaps.Placemark(
            myMap.getCenter(), {
                balloonContent: 'Нант - шестой по величине город Франции'
            }
        );
    myMap.geoObjects.add(placemark);    

});