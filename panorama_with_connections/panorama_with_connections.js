ymaps.ready(function () {
    // To begin with, we have to check whether the user's browser supports the panorama player.
    if (!ymaps.panorama.isSupported()) {
        // If it doesn't, we won't do anything.
        return;
    }
    /**
     * Creating an object that contains the data of three connected panoramas.
     * The first two are custom panoramas we have created ourselves, and the third  is a Yandex panorama.
     * We'll use standard connection arrows to connect the first two panoramas,
     * and a custom connection marker to connect the first panorama to the Yandex panorama.
     */
    var panoData = {
        // Data for the first panorama.
        firstPano: {
            type: 'custom',
            angularBBox: [Math.PI / 2, 2 * Math.PI + Math.PI / 4, -Math.PI / 2, Math.PI / 4],
            position: [0, 0, 0],
            tileSize: [512, 512],
            tileLevels: [{
                getTileUrl: function (x, y) {
                    return 'tiles/panorama1/hq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [7168, 3584];
                }
            }, {
                getTileUrl: function (x, y) {
                    return 'tiles/panorama1/lq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [512, 256];
                }
            }],
            // Standard connection arrows on the panorama.
            connectionArrows: [{
                panoID: 'secondPano',
                direction: [-45, 0]
            }],
            // Custom connection markers on the panorama.
            markerConnections: [{
                panoID: 'thirdPano',
                iconSrc: {
                    'default': 'images/marker-default.jpg',
                    hovered: 'images/marker-hovered.jpg'
                },
                iconPosition: [0.5, 1.5, 0.3]
            }]
        },
        // Data for the second panorama.
        secondPano: {
            type: 'custom',
            angularBBox: [Math.PI / 2, 2 * Math.PI, -Math.PI / 2, 0],
            position: [0, 0, 0],
            tileSize: [512, 512],
            tileLevels: [{
                getTileUrl: function (x, y) {
                    return 'tiles/panorama2/hq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [7168, 3584];
                }
            }, {
                getTileUrl: function (x, y) {
                    return 'tiles/panorama2/lq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [512, 256];
                }
            }],
            // Adding a reverse connection back to the first panorama.
            connectionArrows: [{
                panoID: 'firstPano',
                direction: [90, 0]
            }, {
                panoID: 'secondPano',
                direction: [45, 0]
            }],
            markerConnections: []
        },
        /**
         * Yandex.Panorama.
         * We will receive information about the panorama from the Yandex servers
         * using the ymaps.panorama.locate function.
         */
        thirdPano: {
            type: 'yandex',
            // The coordinates of the point where the panorama should be opened.
            coords: [55.733643, 37.588437]
        }
    };

    // A function to extract data of the required panorama from the panoData object.
    function getConnectedPanoramaData(panoID) {
        return panoData[panoID];
    }
    // A function that downloads the marker image from the server.
    function loadImage(src) {
        return new ymaps.vow.Promise(function (resolve) {
            var image = new Image();
            image.onload = function () {
                resolve(image);
            };
            image.crossOrigin = 'anonymous';
            image.src = src;
        });
    }

    // Creating a class that describes the connection from one panorama to another using a standard arrow.
    function ConnectionArrow(currentPanorama, direction, nextPanorama) {
        this.properties = new ymaps.data.Manager();
        this._currentPanorama = currentPanorama;
        this._direction = direction;
        this._connectedPanorama = nextPanorama;
    }

    ymaps.util.defineClass(ConnectionArrow, {
        getConnectedPanorama: function () {
            /**
             * If the connection leads to a custom panorama,
             * create the MyPanorama panorama object.
             * To connect to a Yandex panorama, use the
             * ymaps.panorama.locate function to get the panorama object.
             */
            if (this._connectedPanorama.type == 'custom') {
                return ymaps.vow.resolve(new MyPanorama(this._connectedPanorama));
            } else if (this._connectedPanorama.type == 'yandex') {
                return ymaps.panorama.locate(this._connectedPanorama.coords).then(
                    function(panoramas) {
                        if (panoramas.length) {
                            return panoramas[0];
                        }  else {
                            return ymaps.vow.reject(new Error('No panorama found.'));
                        }
                    }
                );
            }
        },
        // Directing the view at the panorama that we are connecting to.
        getDirection: function () {
            return this._direction;
        },
        // Link to the current panorama that the connection leads out of.
        getPanorama: function () {
            return this._currentPanorama;
        }
    })

    // Creating a class that describes the connection marker.
    function MarkerConnection(currentPanorama, imgSrc, position, nextPanorama) {
        // The properties field must be defined in the class.
        this.properties = new ymaps.data.Manager();
        this._panorama = currentPanorama;
        this._position = position;
        this._imgSrc = imgSrc;
        this._connectedPanorama = nextPanorama;
    }

    ymaps.util.defineClass(MarkerConnection, {
        getIconSet: function () {
            return ymaps.vow.Promise.all([
                loadImage(this._imgSrc.default),
                loadImage(this._imgSrc.hovered)
            ]).spread(function (defaultImage, hoveredImage) {
                return {
                    'default': {
                        image: defaultImage,
                        offset: [0, 0]
                    },
                    hovered: {
                        image: hoveredImage,
                        offset: [0, 0]
                    }
                };
            });
        },
        // The current panorama that the connection leads out of.
        getPanorama: function () {
            return this._panorama;
        },
        // The position of the marker on the current panorama.
        getPosition: function () {
            return this._position;
        },
        /**
         * In order to switch to another panorama when the marker is clicked,
         * we implement the getConnectedPanorama method.
         */
        getConnectedPanorama: function () {
            if (this._connectedPanorama.type == 'custom') {
                return ymaps.vow.resolve(new MyPanorama(this._connectedPanorama));
            } else if (this._connectedPanorama.type == 'yandex') {
                return ymaps.panorama.locate(this._connectedPanorama.coords).then(
                    function(panoramas) {
                        if (panoramas.length) {
                            return panoramas[0];
                        } else {
                            return ymaps.vow.reject(new Error('No panorama found.'));
                        }
                    }
                );
            }
        }
    });

    // Panorama class.
    function MyPanorama(obj) {
        ymaps.panorama.Base.call(this);
        this._angularBBox = obj.angularBBox;
        this._position = obj.position;
        this._tileSize = obj.tileSize;
        this._tileLevels = obj.tileLevels;
        /**
         * Getting an array of class instances that describe switching
         * from one panorama 
to another using the standard connection arrow.
         */
        this._connectionArrows = obj.connectionArrows.map(function (connectionArrow) {
            return new ConnectionArrow(
                this, // The current panorama.
                connectionArrow.direction, // Directing the view to the panorama that we are connecting to.
                getConnectedPanoramaData(connectionArrow.panoID) //Data of the panorama that we are connecting to.
            );
        }, this);
        // Getting an array of connection markers.
        this._connectionMarkers = obj.markerConnections.map(function (marker) {
            return new MarkerConnection(
                this, // The current panorama.
                marker.iconSrc, //The marker image.
                marker.iconPosition, // The marker position.
                getConnectedPanoramaData(marker.panoID) //Data of the panorama that we are connecting to.
            );
        }, this);

    }

    ymaps.util.defineClass(MyPanorama, ymaps.panorama.Base, {
        /**
         * To add standard connection arrows to the panorama,
         * implement the getConnectionArrows method.
         */
        getConnectionArrows: function () {
            return this._connectionArrows;
        },
        /**
         * To add transition markers to the panorama,
         * implement the getConnections method.
         */
        getConnectionMarkers: function () {
            return this._connectionMarkers;
        },
        getAngularBBox: function () {
            return this._angularBBox;
        },
        getPosition: function () {
            return this._position;
        },
        getTileSize: function () {
            return this._tileSize;
        },
        getTileLevels: function () {
            return this._tileLevels;
        },
        getCoordSystem: function () {
            return ymaps.coordSystem.cartesian;
        }
    });

    var panorama = new MyPanorama(panoData.firstPano);

    // Displaying a panorama on a page.
    var player = new ymaps.panorama.Player('player', panorama, {
        direction: [25, 0]
    });
});
