ymaps.ready(init);

function init() {
    // Creating the map.
    var myMap = new ymaps.Map("map", {
            center: [55.72, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a polyline.
    var myPolyline = new ymaps.Polyline([
        // Specifying the coordinates of the vertices.
        [55.80, 37.50],
        [55.80, 37.40],
        [55.70, 37.50],
        [55.70, 37.40]
    ], {}, {
        // Setting geo object options. Color with transparency.
        strokeColor: "#00000088",
        // The line width.
        strokeWidth: 4,
        // The maximum number of vertices in the polyline.
        editorMaxPoints: 6,
        // Adding a new item to the context menu that allows deleting the polyline.
        editorMenuManager: function (items) {
            items.push({
                title: "Удалить линию",
                onClick: function () {
                    myMap.geoObjects.remove(myPolyline);
                }
            });
            return items;
        }
    });

    // Adding a line to the map.
    myMap.geoObjects.add(myPolyline);

    // Turning on the edit mode.
    myPolyline.editor.startEditing();
}
