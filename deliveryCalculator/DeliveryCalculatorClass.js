ymaps.modules.define(
    'DeliveryCalculator',
    ['util.defineClass', 'vow'],
    function (provide, defineClass, vow) {
        /**
         * @class DeliveryCalculator Calculating delivery cost.
         * @param {Object} map Instance of the map.
         */
        function DeliveryCalculator(map) {
            this._map = map;
            this._startPoint = null;
            this._finishPoint = null;
            this._route = null;
            this._startPointBalloonContent;
            this._finishPointBalloonContent;

            map.events.add('click', this._onClick, this);
        }

        defineClass(DeliveryCalculator, {
            /**
             * Setting the coordiantes and balloon contents for a point on a route.
             * @param {String} pointType Type of point: 'start' - starting point, 'finish' - destination point.
             * @param {Number[]} position Coordinates of the point.
             * @param {String} content Content of the balloon point.
             */
            _setPointData: function (pointType, position, content) {
                if (pointType == 'start') {
                    this._startPointBalloonContent = content;
                    this._startPoint.geometry.setCoordinates(position);
                    this._startPoint.properties.set('balloonContentBody', "Waiting for data");
                } else {
                    this._finishPointBalloonContent = content;
                    this._finishPoint.geometry.setCoordinates(position);
                    this._finishPoint.properties.set('balloonContentBody', "Waiting for data");
                }
            },

            /**
             * Creating a new point on a route and adding it to the map.
             * @param {String} pointType Type of point: 'start' - starting point, 'finish' - destination point.
             * @param {Number[]} position Coordinates of the point.
             */
            _addNewPoint: function (pointType, position) {
                // If a new point on a route has no coordinates assigned, let's temporarily set the coordinates which are out of the visibility area.
                if (!position) position = [19.163570, -156.155197];
                /**
                 * Creating a draggable marker (the 'draggable' option).
                 *  When dragging ends, we call the handler '_onStartDragEnd'.
                 */
                if (pointType == 'start' && !this._startPoint) {
                    this._startPoint = new ymaps.Placemark(position, {iconContent: 'A'}, {draggable: true});
                    this._startPoint.events.add('dragend', this._onStartDragEnd, this);
                    this._map.geoObjects.add(this._startPoint);
                }
                if (pointType == 'finish' && !this._finishPoint) {
                    this._finishPoint = new ymaps.Placemark(position, {iconContent: 'B'}, {
                        draggable: true,
                        balloonAutoPan: false
                    });
                    this._finishPoint.events.add('dragend', this._onFinishDragEnd, this);
                    this._map.geoObjects.add(this._finishPoint);
                }
            },

            /**
             * Setting the point on a route.
             * A route point can be specified by coordinates or coordinates with an address.
             * If the route point is set using coordinates with the address, the address becomes the content of the balloon.
             * @param {String} pointType Type of point: 'start' - starting point, 'finish' - destination point.
             * @param {Number[]} position Coordinates of the point.
             * @param {String} address Address.
             */
            setPoint: function (pointType, position, address) {
                if (!this._startPoint || !this._finishPoint) {
                    this._addNewPoint(pointType, position);
                }
                if (!address) {
                    this._reverseGeocode(position).then(function (content) {
                        this._setPointData(pointType, position, content);
                        this._setupRoute();
                    }, this)
                } else {
                    this._setPointData(pointType, position, address);
                    this._setupRoute();
                }
            },

            /**
             * Performing reverse geocoding (getting the address from its coordinates) for the route point.
             * @param {Number[]} point Coordinates of the point.
             */
            _reverseGeocode: function (point) {
                return ymaps.geocode(point).then(function (res) {
                    /**
                     * res contains a description of the found geo objects
                     * Getting a description of the first geo object in the list in order to
                     * show it with the delivery description when the placemark is clicked.
                     */
                    return res.geoObjects.get(0) &&
                        res.geoObjects.get(0).properties.get('balloonContentBody') || '';
                });

            },

            /**
             * Performing forward geocoding (getting the coordinates from its address) for the route point.
             * @param {String} address Address.
             */
            _geocode: function (address) {
                return ymaps.geocode(address).then(function (res) {
                    /**
                     * res contains a description of the found geo objects
                     * Getting a description and the coordinates of the first geo object in the list.
                     */
                    var balloonContent = res.geoObjects.get(0) &&
                            res.geoObjects.get(0).properties.get("balloonContent") || '',
                        coords = res.geoObjects.get(0) &&
                            res.geoObjects.get(0).geometry.getCoordinates() || '';

                    return [coords, balloonContent];
                });

            },

            /**
             *
             * @param  {Number} routeLength The length of the route in kilometers.
             * @return {Number} The cost of delivery.
             */
            calculate: function (routeLength) {
                // Constants.
                var DELIVERY_TARIF = 20, // The cost per kilometer.
                    MINIMUM_COST = 500; // The minimal cost.

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
                    if (this._deferred && !this._deferred.promise().isResolved()) {
                        this._deferred.reject('New request');
                    }
                    var deferred = this._deferred = vow.defer();
                    // Drawing the route through the specified points.
                    ymaps.route([start, finish])
                        .then(function (router) {
                            if (!deferred.promise().isRejected()) {
                                var price = this.calculate(Math.round(router.getLength() / 1000)),
                                    distance = ymaps.formatter.distance(router.getLength()),
                                    message = '<span>Distance: ' + distance + '.</span><br/>' +
                                        '<span style="font-weight: bold; font-style: italic">Cost of delivery: %s rubles</span>';

                                this._route = router.getPaths(); // Getting a collection of paths that make up the route.

                                this._route.options.set({strokeWidth: 5, strokeColor: '0000ffff', opacity: 0.5});
                                this._map.geoObjects.add(this._route); // Adding the route to the map.
                                // Setting the balloon content for the starting and ending markers.
                                this._startPoint.properties.set('balloonContentBody', startBalloon + message.replace('%s', price));
                                this._finishPoint.properties.set('balloonContentBody', finishBalloon + message.replace('%s', price));

                                this._map.setBounds(this._route.getBounds(), {checkZoomRange: true}).then(function () {
                                /**
                                 * Opening the balloon over the delivery point.
                                 * Comment this out if you don't want to show the balloon automatically.
                                 * this._finishPoint.balloon.open().then(function(){
                                 * this._finishPoint.balloon.autoPan();
                                 * }, this);
                                 */
                                }, this);
                                deferred.resolve();
                            }

                        }, function (err) {
                            // If it is impossible to get directions via the specified points, the balloon with a warning will pop up.
                            this._finishPoint.properties.set('balloonContentBody', "Can't build route");
                            this._finishPoint.balloon.open();
                            this._finishPoint.balloon.autoPan();
                        }, this);

                }
            },

            /**
             * Click handler for the map. Getting coordinates of the point on the map and creating a marker.
             * @param  {Object} event Event.
             */
            _onClick: function (event) {
                if (this._startPoint) {
                    this.setPoint("finish", event.get('coords'));
                } else {
                    this.setPoint("start", event.get('coords'));
                }
            },

            /**
             * Getting the marker coordinates and calling the geocoder for the starting point.
             */
            _onStartDragEnd: function () {
                this.setPoint('start', this._startPoint.geometry.getCoordinates());
            },

            _onFinishDragEnd: function () {
                this.setPoint('finish', this._finishPoint.geometry.getCoordinates());
            },

            /**
             * Creating a route.
             * @param {Number[]|String} startPoint Coordinates of the point or its address.
             * @param {Number[]|String} finishPoint Coordinates of the point or its address.
             */
            setRoute: function (startPoint, finishPoint) {
                if (!this._startPoint) {
                    this._addNewPoint("start");
                }
                if (!this._finishPoint) {
                    this._addNewPoint("finish");
                }
                if (typeof(startPoint) === "string" && typeof(finishPoint) === "string") {
                    vow.all([this._geocode(startPoint), this._geocode(finishPoint)]).then(function (res) {
                        this._setPointData("start", res[0][0], res[0][1]);
                        this._setPointData("finish", res[1][0], res[1][1]);
                        this._setupRoute();
                    }, this);
                } else if (typeof(startPoint) === "string") {
                    vow.all([this._geocode(startPoint), this._reverseGeocode(finishPoint)]).then(function (res) {
                        this._setPointData("start", res[0][0], res[0][1]);
                        this._setPointData("finish", finishPoint, res[1]);
                        this._setupRoute();
                    }, this);
                } else if (typeof(finishPoint) === "string") {
                    vow.all([this._reverseGeocode(startPoint), this._geocode(finishPoint)]).then(function (res) {
                        this._setPointData("start", startPoint, res[0]);
                        this._setPointData("finish", res[1][0], res[1][1]);
                        this._setupRoute();
                    }, this);
                } else {
                    vow.all([this._reverseGeocode(startPoint), this._reverseGeocode(finishPoint)]).then(function (res) {
                        this._setPointData("start", startPoint, res[0]);
                        this._setPointData("finish", finishPoint, res[1]);
                        this._setupRoute();
                    }, this);

                }
            }
        });

        provide(DeliveryCalculator);
    }
);
