function init () {
    /**
     * Creating a multiroute.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
      */
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: ["Moscow", "Tver"]
    }, {
        // A type of intermediate points that can be added
when editing.
        editorMidPointsType: "via",
        // In the mode for adding new waypoints, we do not allow putting points on top of the map objects.
        editorDrawOver: false
    });

    var buttonEditor = new ymaps.control.Button({
        data: { content: "Editing mode" }
    });
    
buttonEditor.events.add("select", function () {
        /**
         * Enabling edit mode.
         * As options, you can pass an object with fields:
         * addWayPoints - Allows adding new waypoints by clicking on the map. Default value: false.
         * dragWayPoints - Allows dragging existing waypoints. Default value: true.
         * removeWayPoints - Allows deleting waypoints by double-clicking them. Default value: false.
         * dragViaPoints - Allows dragging existing throughpoints. Default value: true.
         * removeViaPoints - Allows deleting throughpoints by double-clicking them. Default value: true.
         * addMidPoints - Allows adding intermediate points or waypoints by dragging the marker that appears when pointing the mouse at the active route. The type of points to add is set by the midPointsType option. Default value: true.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml#editor
          */
        multiRoute.editor.start({
            addWayPoints: true,
            removeWayPoints: true
        });
    });

    buttonEditor.events.add("deselect", function () {
        // Turning off edit mode.
        multiRoute.editor.stop();
    });

    // Creating the map with the button added to it.
    var myMap = new ymaps.Map('map', {
        center: [56.399625, 36.71120],
        zoom: 7,
        controls: [buttonEditor]
    }, {
        buttonMaxWidth: 300
    });

    // Adding a multiroute to the map.
    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
