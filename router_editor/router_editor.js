ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [57.131311, 34.576128],
            zoom: 5
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // Признак начала редактирования маршрута.
        startEditing = false,
        button = $('#editor');

    // Построение маршрута от станции метро Смоленская до станции Третьяковская.
    // Маршрут должен проходить через метро "Арбатская".
    ymaps.route([
        'Москва, метро Смоленская',
        {
            // Метро Арбатская - транзитная точка (проезжать через эту точку,
            // но не останавливаться в ней).
            type: 'viaPoint',
            point: 'Москва, метро Арбатская'
        },
        // Метро "Третьяковская".
        [55.744568, 37.60118]
    ], {
        // Автоматически позиционировать карту.
        mapStateAutoApply: true
    }).then(function (route) {
        myMap.geoObjects.add(route);
        button.click(function () {
            if (startEditing = !startEditing) {
                // Включаем редактор.
                route.editor.start({addWayPoints: true, removeWayPoints: true});
                button.val('Отключить редактор маршрута');
            } else {
                // Выключаем редактор.
                route.editor.stop();
                button.val('Включить редактор маршрута');
            }
        });
        route.editor.events.add(["waypointadd", "waypointremove", "start"], function () {
            if (route.getWayPoints().getLength() >= 10) {
                // Если на карте больше 9 точек маршрута, отключаем добавление новых точек.
                route.editor.start({addWayPoints: false, removeWayPoints: true});
            }
            else {
                // Включаем добавление новых точек.
                route.editor.start({addWayPoints: true, removeWayPoints: true});
            }
        })
    }, function (error) {
        alert("Возникла ошибка: " + error.message);
    });
}