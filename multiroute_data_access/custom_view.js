ymaps.modules.define('MultiRouteCustomView', [
    'util.defineClass'
], function (provide, defineClass) {
    // Class for a simple textual view of the multiroute model.
    function CustomView (multiRouteModel) {
        this.multiRouteModel = multiRouteModel;
        // Declaring the initial state.
        this.state = "init";
        this.stateChangeEvent = null;
        // The element the text will be displayed in.
        this.outputElement = $('<div></div>').appendTo('#viewContainer');

        this.rebuildOutput();

        /**
         * Subscribing to model events in order to
         *  update the multiroute's text description.
         */
        multiRouteModel.events
            .add(["requestsuccess", "requestfail", "requestsend"], this.onModelStateChange, this);
    }

    // Mapping table for the state ID to its handler.
    CustomView.stateProcessors = {
        init: "processInit",
        requestsend: "processRequestSend",
        requestsuccess: "processSuccessRequest",
        requestfail: "processFailRequest"
    };

    // Mapping table for the route type to its handler.
    CustomView.routeProcessors = {
        "driving": "processDrivingRoute",
        "masstransit": "processMasstransitRoute",
        "pedestrian": "processPedestrianRoute"
    };

    defineClass(CustomView, {
        // Handler for model events.
        onModelStateChange: function (e) {
            // Storing the model state and reconstructing the text description.
            this.state = e.get("type");
            this.stateChangeEvent = e;
            this.rebuildOutput();
        },

        rebuildOutput: function () {
            // Taking the handler for the current state from the table and executing it.
            var processorName = CustomView.stateProcessors[this.state];
            this.outputElement.html(
                this[processorName](this.multiRouteModel, this.stateChangeEvent)
            );
        },

        processInit: function () {
            return "Initialization ...";
        },

        processRequestSend: function () {
            return "Requesting data ...";
        },

        processSuccessRequest: function (multiRouteModel, e) {
            var routes = multiRouteModel.getRoutes(),
                result = ["The data was received successfully.];"

            if (routes.length) {
                result.push("Total routes: " + routes.length + ".");
                for (var i = 0, l = routes.length; i < l; i++) {
                    result.push(this.processRoute(i, routes[i]));
                }
            } else {
                result.push("No rotes found.");
            }
            return result.join("<br/>");
        },

        processFailRequest: function (multiRouteModel, e) {
            return e.get("error").message;
        },

        processRoute: function (index, route) {
            // Taking the handler for this route type from the table and applying it.
            var processorName = CustomView.routeProcessors[route.properties.get("type")];
            return (index + 1) + ". " + this[processorName](route);
        },

        processDrivingRoute: function (route) {
            var result = ["Car route.];"

            result.push(this.createCommonRouteOutput(route));
            return result.join("<br/>");
        },

        processMasstransitRoute: function (route) {
            var result = ["Route on public transport.];"

            result.push(this.createCommonRouteOutput(route));
            result.push("The route description: <ul>" + this.createMasstransitRouteOutput(route) + "</ul>");
            return result.join("<br/>");
        },

        processPedestrianRoute: function (route) {
            var result = ["The walking route.];"

            result.push(this.createCommonRouteOutput(route));
            return result.join("<br/>");
        },

        // A method that creates a common part of the description for all types of routes.
        createCommonRouteOutput: function (route) {
            return "The length of the route: " + route.properties.get("distance").text + "<br/>" +
                "Time to travel: " + route.properties.get("duration").text;
        },

        /**
         * The method builds a list of text descriptions for all segments
         * of the route on public transport.
         */
        createMasstransitRouteOutput: function (route) {
            var result = [];
            for (var i = 0, l = route.getPaths().length; i < l; i++) {
                var path = route.getPaths()[i];
                for (var j = 0, k = path.getSegments().length; j < k; j++) {
                    result.push("<li>" + path.getSegments()[j].properties.get("text") + "</li>");
                }
            }
            return result.join("");
        },

        destroy: function () {
            this.outputElement.remove();
            this.multiRouteModel.events
                .remove(["requestsuccess", "requestfail", "requestsend"], this.onModelStateChange, this);
        }
    });

    provide(CustomView);
});
