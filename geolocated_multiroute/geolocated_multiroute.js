ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 9,
        // Добавим кнопку для построения маршрутов на карту.
        controls: ['routeButtonControl']
    });

    // Определяем местоположение пользователя.
    ymaps.geolocation.get().then(function (res) {
        // Координаты текущего местоположения пользователя.
        var coords = res.geoObjects.get(0).geometry.getCoordinates(),
            control = myMap.controls.get('routeButtonControl');

        // Зададим координаты пункта отправления.
        control.routePanel.state.set('from', coords);
        // Откроем панель маршрута.
        control.state.set('expanded', true);
    });
});