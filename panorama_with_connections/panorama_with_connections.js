ymaps.ready(function () {
    // To begin with, we have to check whether the user's browser supports the panorama player.
    if (!ymaps.panorama.isSupported()) {
        // If it doesn't, we won't do anything.
        return;
    }
    /**
     * Creating an object containing data for three connected panoramas.
     * We created the first two panoramas ourselves, and the third one is a Yandex panorama.
     * We can set transitions between the first two panoramas using the standard arrows,
     * and set the transition from the first one to the Yandex panorama via a transition marker.
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
            // Transitions on the panorama using the standard arrow.
            thoroughfares: [{
                panoID: 'secondPano',
                direction: [-45, 0]
            }],
            // Transitions on the panorama using markers.
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
            // Adding a reverse transition back to the first panorama.
            thoroughfares: [{
                panoID: 'firstPano',
                direction: [90, 0]
            }, {
                panoID: 'secondPano',
                direction: [45, 0]
            }],
            markerConnections: []
        },
        /**
         * Yandex panorama.
         * We'll get the rest of the information about the panorama from Yandex servers
         * using the ymaps.panorama.locate function.
         */
        thirdPano: {
            type: 'yandex',
            // Coordinates of the point to open the Yandex panorama at.
            coords: [55.733643, 37.588437]
        }
    };

    // Function for extracting data for the necessary panorama from the panoData object.
    function getConnectedPanoramaData(panoID) {
        return panoData[panoID];
    }
    // Function for downloading the marker image from the server.
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

    // Creating a class that describes the transition between panoramas using the standard arrow.
    function Thoroughfare(currentPanorama, direction, nextPanorama) {
        this.properties = new ymaps.data.Manager();
        this._currentPanorama = currentPanorama;
        this._direction = direction;
        this._connectedPanorama = nextPanorama;
    }

    ymaps.util.defineClass(Thoroughfare, {
        getConnectedPanorama: function () {
            /**
             * If the transition is to a custom panorama,
             * we create the MyPanorama panorama object.
             * If we need to transition to a Yandex panorama, we use the 
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
                            return ymaps.vow.reject(new Error('The panorama not found.'));
                        }
                    }
                );
            }
        },
        // Directing the view at the panorama that we are transitioning to.
        getDirection: function () {
            return this._direction;
        },
        // Link to the current panorama that we are transitioning out of.
        getPanorama: function () {
            return this._currentPanorama;
        }
    })

    // Creating a class that describes the transition marker.
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
        // The current panorama that we are transitioning out of.
        getPanorama: function () {
            return this._panorama;
        },
        // The position of the marker on the current panorama.
        getPosition: function () {
            return this._position;
        },
        /**
         * In order to transition to another panorama when the marker is clicked,
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
                            return ymaps.vow.reject(new Error('Panorama not found.'));
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
         * Getting an array of class instances that describe the arrow transition
         * from one panorama to another.
         */
        this._thoroughfares = obj.thoroughfares.map(function (thoroughfare) {
            return new Thoroughfare(
                this, // The current panorama.
                thoroughfare.direction, // Directing the view to the panorama that we are transitioning to.
                getConnectedPanoramaData(thoroughfare.panoID) // Data of the panorama that we are transitioning to.
            );
        }, this);
        // Getting an array of transition markers.
        this._connections = obj.markerConnections.map(function (marker) {
            return new MarkerConnection(
                this, // The current panorama.
                marker.iconSrc,  // The marker image.
                marker.iconPosition, // The marker position.
                getConnectedPanoramaData(marker.panoID) // Data of the panorama that we are transitioning to.
            );
        }, this);

    }

    ymaps.util.defineClass(MyPanorama, ymaps.panorama.Base, {
        /**
         * To add standard transition arrows to the panorama,
         * implement the getThoroughfares method.
         */
        getThoroughfares: function () {
            return this._thoroughfares;
        },
        /**
         * To add transition markers to the panorama,
         * implement the getConnections method.
         */
        getConnections: function () {
            return this._connections;
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

    // Displaying the panorama on a page.
    var player = new ymaps.panorama.Player('player', panorama, {
        direction: [25, 0]
    });
});
