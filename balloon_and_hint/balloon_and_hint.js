ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map("map", {
            center: [54.83, 37.11],
            zoom: 5
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myPlacemark = new ymaps.Placemark([55.907228, 31.260503], {
            // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
            balloonContentHeader: "Балун метки",
            balloonContentBody: "Содержимое <em>балуна</em> метки",
            balloonContentFooter: "Подвал",
            hintContent: "Хинт метки"
        });

    myMap.geoObjects.add(myPlacemark);

    // Открываем балун на карте (без привязки к геообъекту).
    myMap.balloon.open([51.85, 38.37], "Содержимое балуна", {
        // Опция: не показываем кнопку закрытия.
        closeButton: false
    });

    // Показываем хинт на карте (без привязки к геообъекту).
    myMap.hint.open(myMap.getCenter(), "Одинокий хинт без метки", {
        // Опция: задержка перед открытием.
        openTimeout: 1500
    });
}