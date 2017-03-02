ymaps.modules.define('MultiRouteColorizer', [
    'util.defineClass'
], function (provide, defineClass) {
    /**
     * A class that color codes route segments in various colors depending on the
     *  type of segment and type of transport.
     */
    function Colorizer (multiRoute) {
        this.multiRoute = multiRoute;

        /**
         * Subscribing to the multiroute update event
         * and changing the active route.
         */
        multiRoute.events
            .add("update", this.onMultiRouteUpdate, this)
            .add("activeroutechange", this.onActiveRouteChange, this);

        // Taking the current active route and coloring it.
        this.activeRoute = multiRoute.getActiveRoute();
        this.colorize();
    }

    // Preset appearance for train segments.
    Colorizer.suburbanPreset = {
        strokeWidth: 6,
        strokeColor: "#000000",
        strokeStyle: "shortDash"
    };

    // Preset appearance for bus, trolley, and tram segents.
    Colorizer.busPreset = {
        strokeWidth: 6,
        strokeColor: "#0085FA",
        strokeStyle: "shortDash"
    };

    // Preset appearance for walking segments.
    Colorizer.walkPreset = {
        strokeWidth: 2,
        strokeColor: "#333333",
        strokeStyle: "solid"
    };

    defineClass(Colorizer, {
        // Handler for changing the active route.
        onActiveRouteChange: function () {
            /**
             * Removing the color from the previous active route. Otherwise, it will stay
             *  colored in the inactive state.
             */
            this.uncolorize();
            // Storing the new active route and coloring it.
            this.activeRoute = this.multiRoute.getActiveRoute();
            this.colorize();

            if (this.activeRoute) {
                // Applying the borders of the active route to the map.
                this.multiRoute.getMap().setBounds(this.activeRoute.getBounds());
            }
        },

        onMultiRouteUpdate: function () {
            // When updating the route, color coding is repeated.
            this.colorize();
        },

        colorize: function () {
            /**
             * Searching through all the paths of the active route, if there is an active route.
             *  For each path, it goes through all the segments and sets the appearance
             *  parameters for each of them according to the type of segment.
             */
            if (this.activeRoute) {
                this.activeRoute.getPaths().each(function (path) {
                    path.getSegments().each(function (segment) {
                        var segmentType = segment.properties.get("type");
                        if (segmentType == "transport") {
                            this.colorizeTransportSegment(segment);
                        } else {
                            /**
                             * This includes segments with the types "walk" (walking)
                             *  and "transfer" (transfer between stations).
                             */
                            segment.options.set({ preset: Colorizer.walkPreset });
                        }
                    }, this)
                }, this);
            }
        },

        uncolorize: function () {
            if (this.activeRoute) {
                // Searching through all the segments and deleting the appearance settings for each of them.
                this.activeRoute.getPaths().each(function (path) {
                    path.getSegments().each(function (segment) {
                        segment.options.unset("preset")
                    }, this)
                }, this);
            }
        },

        destroy: function () {
            this.uncolorize();
            this.multiRoute.events
                .remove("update", this.onMultiRouteUpdate, this)
                .remove("activeroutechange", this.onActiveRouteChange, this);
        },

        // Method that color codes transport segments.
        colorizeTransportSegment: function (segment) {
            /**
             * Taking the first record about transport from the segment's array of transport
             *  and color coding the segment based on this record.
             *  For a single segment, the possible methods of transportation do not normally
             *  have radically different types.
             *  In other words, there aren't any segments that you can travel on both the subway and the bus.
             *  In our case, the difference between a bus and a taxi minibus is not important.
             */
            var transport = segment.properties.get("transports")[0];
            if (transport.type == "suburban") {
                segment.options.set({ preset: Colorizer.suburbanPreset });
            } else if (transport.type == "underground") {
                segment.options.set({
                    preset: {
                        strokeWidth: 6,
                        // Taking the color of the subway line from the segment data.
                        strokeColor: transport.Style.color
                    }
                });
            } else {
                segment.options.set({ preset: Colorizer.busPreset });
            }
        }
    });

    provide(Colorizer);
});
