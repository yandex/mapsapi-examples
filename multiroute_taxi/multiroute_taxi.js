ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.77, 37.60],
        zoom: 13,
        controls: []
    });
    // Создадим панель маршрутизации.
    var routePanelControl = new ymaps.control.RoutePanel({
        options: {
            // Добавим заголовок панели.
            showHeader: true,
            // Зададим текст заголовка панели.
            title: 'Вызов такси',
            // Пользователь сможет построить только маршрут на такси.
            routePanelTypes: {taxi: true},
            // Зададим ширину панели.
            maxWidth: '210px'
        }
    });
    // Зададим тип маршрутизации по умолчанию.
    routePanelControl.routePanel.state.set({
        // Зададим тип маршрутизации - такси.
        type: "taxi",
        // Зададим адрес пункта назначения.
        to: 'Павелецкий вокзал',
        // Отключим возможность задавать пункт отправления в поле ввода.
        toEnabled: false
    });
    var zoomControl = new ymaps.control.ZoomControl({
        options: {
            size: 'small',
            float: 'none',
            position: {
                bottom: 145,
                right: 10
            }
        }
    });

    myMap.controls.add(routePanelControl).add(zoomControl);
    // Зададим местоположение пользователя в качестве начальной точки маршрута.
    routePanelControl.routePanel.geolocate('from');
}
