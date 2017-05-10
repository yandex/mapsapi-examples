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

    /**
     * Building a route from Smolenskaya metro station to Tretyakov station.
     * The route should pass through Arbatskaya station.
     */
    ymaps.route([
        'Moscow, Smolenskaya metro station',
        {
            /**
             * Metro Arbatskaya is a through point (passing through this point,
             * but not stopping at it).
             */

            type: 'viaPoint',
            point: 'Moscow, metro Arbatskaya'
        },
        // Metro Tretyakovskaya.
        [55.744568, 37.60118]
    ], {
        // Automatically positioning the map.
        mapStateAutoApply: true
    }).then(function (route) {
        myMap.geoObjects.add(route);
        button.click(function () {
            if (startEditing = !startEditing) {
                // Turning on the editor.
                route.editor.start({addWayPoints: true, removeWayPoints: true});
                button.text('Disable the route editor');
            } else {
                // Turning off the editor.
                route.editor.stop();
                button.text('Enable the route editor');
            }
        });
        route.editor.events.add(["waypointadd", "waypointremove", "start"], function () {
            if (route.getWayPoints().getLength() >= 10) {
                // Disabling adding new points if the map has more than 9 waypoints.
                route.editor.start({addWayPoints: false, removeWayPoints: true});
            }
            else {
                // Enabling adding new points.
                route.editor.start({addWayPoints: true, removeWayPoints: true});
            }
        })
    }, function (error) {
        alert("An error occurred: " + error.message);
    });
}
