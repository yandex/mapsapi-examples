ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [57.131311, 34.576128],
            zoom: 5
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // Indicates the beginning of route editing.
        startEditing = false,
        button = $('#editor');

    // Building a route from Smolenskaya metro station to Tretyakov station. The route should pass
    // through Arbatskaya station.
    ymaps.route([
        'Москва, метро Смоленская',
        {
            // Metro Arbatskaya is a through point (passing through this point, but not stopping at
            // it).
            type: 'viaPoint',
            point: 'Москва, метро Арбатская'
        },
        // Metro Tretyakovskaya.
        [55.74062, 37.62561]
    ], {
        // Automatically positioning the map.
        mapStateAutoApply: true
    }).then(function (route) {
        myMap.geoObjects.add(route);
        button.click(function () {
            if (startEditing = !startEditing) {
                // Turning on the editor.
                route.editor.start({ addWayPoints: true });
                button.val('Отключить редактор маршрута');
            } else {
                // Turning off the editor.
                route.editor.stop();
                button.val('Включить редактор маршрута');
            }
        });
    }, function (error) {
        alert("Возникла ошибка: " + error.message);
    });
}
