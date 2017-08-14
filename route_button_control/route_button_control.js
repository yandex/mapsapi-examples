ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 9,
        // Добавим кнопку для построения маршрутов на карту.
        controls: ['routeButtonControl']
    });

    var control = myMap.controls.get('routeButtonControl');

    // Зададим состояние панели контрола маршрутов.
    control.routePanel.state.set({
        // Тип маршрутизации.
        type: 'auto',
        // Включить возможность задавать пункт отправления в поле ввода.
        fromEnabled: false,
        // Адрес или координаты пункта отправления.
        from: 'Москва, Льва Толстого 16',
        // Включить возможность задавать пункт назначения в поле ввода.
        toEnabled: true
        // Адрес или координаты пункта назначения.
        //to: 'Петербург'
    });

    // Зададим опции панели контрола маршрутов.
    control.routePanel.options.set({
        // Показать на панели кнопку, позволяющую менять местами начальную и конечную точки маршрута.
        allowSwitch: false,
        // Включить обратное геокодирование при построение маршрута.
        reverseGeocoding: true
    });

    // Откроем панель маршрута.
    control.state.set('expanded', true);

    // Создаем кнопку, для того чтобы разрешить пользователю менять местами начальную и конечную точки маршрута.
    var switchPointsButton = new ymaps.control.Button({
        data: {content: "Поменять точки местами"},
        options: {selectOnClick: false, maxWidth: 300}
    });
    // Объявляем обработчик для кнопки.
    switchPointsButton.events.add('click', function () {
        // Меняет местами начальную и конечную точки маршрута.
        control.routePanel.switchPoints();
    });
    myMap.controls.add(switchPointsButton);
});