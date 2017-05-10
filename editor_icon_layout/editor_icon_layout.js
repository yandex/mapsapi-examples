ymaps.ready(init);

function init() {
    // Creating the map.
    var myMap = new ymaps.Map("map", {
        center: [90, 15],
        zoom: 3,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Creating a polyline.
    var myPolyline = new ymaps.Polyline([
            // Specifying the coordinates of the vertices.
            [70, 20],
            [70, 40],
            [90, 15],
            [70, -10]
        ], {}, {
            /**
             * Setting geo object options.
             * Color with transparency.
             */
            strokeColor: '#FF008888'
        });

    myPolyline.editor.options.set({
        /**
         * Specifying options with postfixes linked to the current state of the vertex.
         * The layout class for placemarks on the vertices of a polyline.
         */
        vertexLayout: 'default#image',
        // URL of the image file.
        vertexIconImageHref: 'images/button3.png',
        // Dimensions of the image layer.
        vertexIconImageSize: [16, 16],
        // Offset of the image relative to the anchor point.
        vertexIconImageOffset: [-8, -8],

        // Options with this given postfix are used when the user hovers over a vertex with the mouse pointer.
        vertexLayoutHover: 'default#image',
        vertexIconImageSizeHover: [28, 28],
        vertexIconImageOffsetHover: [-14, -14],

        // Options with this given postfix are used when the context menu is open on a vertex.
        vertexLayoutActive: 'default#image',
        vertexIconImageHrefActive: 'images/button4.png',
        vertexIconImageSizeActive: [16, 16],
        vertexIconImageOffsetActive: [-8, -8],

        // Options with this given postfix are used when the user drags a vertex.
        vertexLayoutDrag: 'default#image',
        vertexIconImageHrefDrag: 'images/button4.png',
        vertexIconImageSizeDrag: [16, 16],
        vertexIconImageOffsetDrag: [-8, -8],

        // Specifying options with postfixes for interim placemarks which are linked to the current state of the interim placemarks.
        edgeLayout: 'default#image',
        edgeIconImageHref: 'images/button1.png',
        edgeIconImageSize: [16, 16],
        edgeIconImageOffset: [-8, -8],

        // Options with this given postfix are used when the user hovers over an interim placemark with the mouse pointer.
        edgeLayoutHover: 'default#image',
        edgeIconImageSizeHover: [28, 28],
        edgeIconImageOffsetHover: [-14, -14],

        // Options with this given postfix are used when the user drags an interim placemark.
        edgeLayoutDrag: 'default#image',
        edgeIconImageHrefDrag: 'images/button2.png',
        edgeIconImageSizeDrag: [16, 16],
        edgeIconImageOffsetDrag: [-8, -8]
    });

    // Adding a line to the map.
    myMap.geoObjects.add(myPolyline);

    // Turning on the edit mode.
    myPolyline.editor.startEditing();
}
