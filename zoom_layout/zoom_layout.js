ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9,
            controls: []
        }),

        // Creating a custom layout for the zoom slider.
        ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
            "<div id='zoom-in' class='btn'><i class='icon-plus'></i></div><br>" +
            "<div id='zoom-out' class='btn'><i class='icon-minus'></i></div>" +
            "</div>", {

            /**
             * Redefining methods of the layout, in order to perform
             * additional steps when building and clearing the layout.
             */
            build: function () {
                // Calling the "build" parent method.
                ZoomLayout.superclass.build.call(this);

                /**
                 * Binding handler functions to the context and storing references
                 * to them in order to unsubscribe from the event later.
                 */
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Beginning to listen for clicks on the layout buttons.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                // Removing click handlers.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Calling the "clear" parent method.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    myMap.controls.add(zoomControl);
}
