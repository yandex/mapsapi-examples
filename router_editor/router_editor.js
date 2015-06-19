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
        [55.74062, 37.62561]
    ], {
        // Автоматически позиционировать карту.
        mapStateAutoApply: true
    }).then(function (route) {
        myMap.geoObjects.add(route);
        button.click(function () {
            if (startEditing = !startEditing) {
                // Включаем редактор.
                route.editor.start({ addWayPoints: true });
                button.val('Отключить редактор маршрута');
            } else {
                // Выключаем редактор.
                route.editor.stop();
                button.val('Включить редактор маршрута');
            }
        });
    }, function (error) {
        alert("Возникла ошибка: " + error.message);
    });
}