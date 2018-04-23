ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [30, 50],
            zoom: 4
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Создаем многоугольник.
    var myPolygon = new ymaps.Polygon([
        [
            [30, 40],
            [30, 50],
            [40, 50],
            [40, 40],
            [30, 40]
        ]
    ], {}, {
        // Разрешаем перетаскивать многоугольник.
        draggable: true,
        // Максимально допустимое количество вершин.
        editorMaxPoints: 5,
        // Убираем возможность удалить точку через меню.
        editorMenuManager: function() {
            return [];
        },
        // Убираем возможность удалить точку по двойному клику.
        editorDblClickHandler: function() {}
    });
    // Добавляем многоугольник на карту.
    myMap.geoObjects.add(myPolygon);

    // Включаем режим редактирования с возможностью добавления новых вершин.
    myPolygon.editor.startEditing();

    // Подписываемся на перетаскивание вершины.
    myPolygon.editor.events.add('vertexdrag', function(e) {
        // Получаем глобальные пиксельные координаты вершины.
        var globalPixels = e.get('globalPixels');
        // Получаем широту и долготу вершины.
        var pointCoordinates = myMap.options.get('projection').fromGlobalPixels(globalPixels, myMap.getZoom());
        // Получаем индекс вершины.
        var pointIndex = e.get('vertexModel').getIndex();
        // Получаем координаты полигона.
        var polygonCoordinates = myPolygon.geometry.getCoordinates();
        // Перемещаем остальные вершины так, чтобы на карты был всегда прямоугольник.
        switch (pointIndex) {
            case 0:
                polygonCoordinates[0][3][1] = pointCoordinates[1];
                polygonCoordinates[0][1][0] = pointCoordinates[0];
                break;
            case 1:
                polygonCoordinates[0][4][0] = pointCoordinates[0];
                polygonCoordinates[0][0][0] = pointCoordinates[0];
                polygonCoordinates[0][2][1] = pointCoordinates[1];
                break;
            case 2:
                polygonCoordinates[0][1][1] = pointCoordinates[1];
                polygonCoordinates[0][3][0] = pointCoordinates[0];
                break;
            case 3:
                polygonCoordinates[0][2][0] = pointCoordinates[0];
                polygonCoordinates[0][0][1] = pointCoordinates[1];
                polygonCoordinates[0][4][1] = pointCoordinates[1];
                break;
        }
        // Перестраиваем прямоугольник.
        myPolygon.geometry.setCoordinates(polygonCoordinates);
    })

}