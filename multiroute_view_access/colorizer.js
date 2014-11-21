function Colorizer (multiRoute) {
    this.multiRoute = multiRoute;

    multiRoute.events
        .add("update", this.onMultiRouteUpdate, this)
        .add("activeroutechange", this.onActiveRouteChange, this);

    this.activeRoute = multiRoute.getActiveRoute();
    this.colorize();
}

Colorizer.suburbanPreset = {
    strokeWidth: 6,
    strokeColor: "#000000",
    strokeStyle: "shortDash"
};

Colorizer.busPreset = {
    strokeWidth: 6,
    strokeColor: "#0085FA",
    strokeStyle: "shortDash"
};

Colorizer.walkPreset = {
    strokeWidth: 2,
    strokeColor: "#333333",
    strokeStyle: "solid"
};

Colorizer.prototype = {
    onActiveRouteChange: function () {
        this.uncolorize();
        this.activeRoute = this.multiRoute.getActiveRoute();
        this.colorize();

        if (this.activeRoute) {
            this.multiRoute.getMap().setBounds(this.activeRoute.getBounds());
        }
    },

    onMultiRouteUpdate: function () {
        this.colorize();
    },

    colorize: function () {
        if (this.activeRoute) {
            this.activeRoute.getPaths().each(function (path) {
                path.getSegments().each(function (segment) {
                    var segmentType = segment.properties.get("type");
                    if (segmentType == "transport") {
                        this.colorizeTransportSegment(segment);
                    } else {
                        segment.options.set({ preset: Colorizer.walkPreset });
                    }
                }, this)
            }, this);
        }
    },

    uncolorize: function () {
        if (this.activeRoute) {
            this.activeRoute.getPaths().each(function (path) {
                path.getSegments().each(function (segment) {
                    segment.options.unset("preset")
                }, this)
            }, this);
        }
    },

    colorizeTransportSegment: function (segment) {
        var transport = segment.properties.get("transports")[0];
        if (transport.type == "suburban") {
            segment.options.set({ preset: Colorizer.suburbanPreset });
        } else if (transport.type == "underground") {
            segment.options.set({
                preset: {
                    strokeWidth: 6,
                    strokeColor: transport.Style.color
                }
            });
        } else {
            segment.options.set({ preset: Colorizer.busPreset });
        }
    }
};