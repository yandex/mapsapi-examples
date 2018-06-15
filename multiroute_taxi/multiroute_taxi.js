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
                title: 'Вызов такси',
                // Пользователь сможет построить только маршрут на такси.
                routePanelTypes: {taxi: true}
            },
            state: {
                routePanelType: "pedestrian"
            }
        });
    // Зададим тип маршрутизации по умолчанию.
    routePanelControl.routePanel.state.set({
        type: "taxi"
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
}