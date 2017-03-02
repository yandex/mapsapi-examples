ymaps.modules.define(
    'DeliveryCalculator',
    ['util.defineClass'],
    function (provide, defineClass) {
        /**
         * @class DeliveryCalculator Calculating delivery cost.
         * @param {Object} map    Instance of the map.
         */
        function DeliveryCalculator (map) {
            this._map = map;
            this._startPoint = null;
            this._route = null;
            this._startPointBalloonContent;
            this._finishPointBalloonContent;

            map.events.add('click', this._onClick, this);
        }

        defineClass(DeliveryCalculator, {
            /**
             * Creating the starting point of a route.
             * If the point is created, we update the coordinates.
             * @param {Number[]} position Coordinates of the point.
             */
            setStartPoint: function (position) {
                if (this._startPoint) {
                    this._startPoint.geometry.setCoordinates(position);
                } else {
                    /**
                     * Creating a draggable marker (the 'draggable' option).
                     *  When dragging ends, we call the handler '_onStartDragEnd'.
                     */
                    this._startPoint = new ymaps.Placemark(position, {iconContent: 'A'}, {draggable: true});
                    this._startPoint.events.add('dragend', this._onStartDragEnd, this);
                    this._map.geoObjects.add(this._startPoint);
                }
                this.geocode('start', position);
            },

            /**
             * Creating the destination point of the route.
             * If the point already exists, we update the coordinates.
             * @param {Number[]} position Coordinates of the point.
             */
            setFinishPoint: function (position) {
                if (this._finishPoint) {
                    this._finishPoint.geometry.setCoordinates(position);
                } else {
                    this._finishPoint = new ymaps.Placemark(position, { iconContent: 'B' }, { draggable: true });
                    this._finishPoint.events.add('dragend', this._onFinishDragEnd, this);
                    this._map.geoObjects.add(this._finishPoint);
                }
                if (this._startPoint) {
                    this.geocode('finish', position);
                }
            },

            /**
             * Performing reverse geocoding (getting the address from its coordinates) for the route's points.
             * @param {String} pointType Type of point: 'start' - starting point, 'finish' - destination point.
             * @param {Number[]} point Coordinates of the point.
             */
            geocode: function (pointType, point) {
                ymaps.geocode(point).then(function (result) {
                    // result contains a description of the found geo objects.
                    if (pointType == 'start') {
                        /**
                         * Getting a description of the first geo object in the list in order to
                         * show it with the delivery description when the placemark is clicked.
                         */
                        this._startPointBalloonContent = result.geoObjects.get(0) &&
                            result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                    } else {
                        // The same for the ending point
                        this._finishPointBalloonContent = result.geoObjects.get(0) &&
                            result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                    }
                    this._setupRoute();
                }, this);

            },

            /**
             *
             * @param  {Number} routeLength The length of the route in kilometers.
             * @return {Number} The cost of delivery.
             */
            calculate: function (routeLength) {
                // Constants.
 The cost per kilometer.
 The minimal cost.

                return Math.max(routeLength * DELIVERY_TARIF, MINIMUM_COST);
            },

            /**
             * Drawing the route through the set points
             * and making delivery calculations.
             */
            _setupRoute: function () {
                // Deleting the previous route from the map.
                if (this._route) {
                    this._map.geoObjects.remove(this._route);
                }

                if (this._startPoint && this._finishPoint) {
                    var start = this._startPoint.geometry.getCoordinates(),
                        finish = this._finishPoint.geometry.getCoordinates(),
                        startBalloon = this._startPointBalloonContent,
                        finishBalloon = this._finishPointBalloonContent;

                    // Drawing the route through the specified points.
                    ymaps.route([start, finish])
                        .then(function (router) {
                            var distance = Math.round(router.getLength() / 1000),
                                message = '<span>Distance: ' + distance + 'km.</span><br/>' +
                                    '<span style="font-weight: bold; font-style: italic">Cost of delivery: %sр.</span>';

                            this._route = router.getPaths(); // Getting a collection of paths that make up the route.

                            this._route.options.set({ strokeWidth: 5, strokeColor: '0000ffff', opacity: 0.5 });
                            this._map.geoObjects.add(this._route); // Adding the route to the map.
 Setting the balloon content for the starting and ending markers.
                            this._startPoint.properties.set('balloonContentBody', startBalloon + message.replace('%s', this.calculate(distance)));
                            this._finishPoint.properties.set('balloonContentBody', finishBalloon + message.replace('%s', this.calculate(distance)));

                            /**
                             * Opening the balloon over the delivery point.
                             *  Comment this out if you don't want to show the balloon automatically.
                             */
                            this._finishPoint.balloon.open();
                        }, this);

                    this._map.setBounds(this._map.geoObjects.getBounds());
                }
            },

            /**
             * Click handler for the map. Getting coordinates of the point on the map and creating a marker.
             * @param  {Object} event Event.
             */
            _onClick: function (event) {
                if (this._startPoint) {
                    this.setFinishPoint(event.get('coords'));
                } else {
                    this.setStartPoint(event.get('coords'));
                }
            },

            /**
             * Getting the marker coordinates and calling the geocoder for the starting point.
             */
            _onStartDragEnd: function () {
                this.geocode('start', this._startPoint.geometry.getCoordinates());
            },

            _onFinishDragEnd: function () {
                this.geocode('finish', this._finishPoint.geometry.getCoordinates());
            }
        });

        provide(DeliveryCalculator);
    }
);
