ymaps.ready(function () {
    // To begin with, we have to check whether the user's browser supports the panorama player.
    if (!ymaps.panorama.isSupported()) {
        // If it doesn't, we won't do anything.
        return;
    }
    /**
     * Creating an object containing the data of the panorama.
     * The panorama has a partial angle of view vertically.
     */
    var panoData = {
            angularBBox: [0.35, 8 * Math.PI/3, -0.61, 2 * Math.PI/3],
            position: [0, 0, 0],
            tileSize: [512, 512],
            tileLevels: [{
                // URL of tiles for the highest zoom level.
                getTileUrl: function (x, y) {
                    return 'tiles/hq/' + x + '-' + y + '.jpg';
                },
                // The size of the image for the highest zoom level.
                getImageSize: function () {
                    return [10752, 1658];
                }
            }, {
                // URL of tiles for the lowest zoom level.
                getTileUrl: function (x, y) {
                    return 'tiles/lq/' + x + '-' + y + '.jpg';
                },
                // The size of the image for the lowest zoom level.
                getImageSize: function () {
                    return [1024, 158];
                }
            }]
        },

        /**
         * Creating an object that will store
         * marker information.
         */
        markerData = {
            src: {
                'default': 'images/marker-default.png',
                hovered: 'images/marker-hovered.png'
            },
            position: [-2, -0.8, 0.2]
        };

    /**
     * The function returns a Promise that is resolved
     * by the HTMLImageElement object.
     */
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

    // A function that draws the marker using Canvas.
    function renderImage(text) {
        var ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = 128;
        ctx.canvas.height = 32;
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 128, 32);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 16);
        return ctx.canvas;
    }

    // The marker class.
    function Marker(img, panorama) {
        // The properties field must be defined in the class.
        this.properties = new ymaps.data.Manager();
        this._panorama = panorama;
        this._position = img.position;
        this._imgSrc = img.src;
    }

    // Defining the necessary methods in the Marker class.
    ymaps.util.defineClass(Marker, {
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
                    },
                    expanded: {
                        image: renderImage("Books on JavaScript"),
                        offset: [0, -10]
                    }
                };
            });
        },
        getPanorama: function () {
            return this._panorama;
        },
        getPosition: function () {
            return this._position;
        }
    });

    // Declaring the panorama class.
    function MyPanorama(angularBBox, position, tileSize, tileLevels) {
        // Calling the parent class constructor.
        ymaps.panorama.Base.call(this);
        this._angularBBox = angularBBox;
        this._position = position;
        this._tileSize = tileSize;
        this._tileLevels = tileLevels;

    }

    ymaps.util.defineClass(MyPanorama, ymaps.panorama.Base, {
        // Redefining the getMarkers method.
        getMarkers: function () {
            return [new Marker(markerData, this)];
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

    var panorama = new MyPanorama(panoData.angularBBox, panoData.position, panoData.tileSize, panoData.tileLevels);

    // Displaying the panorama on the page.
    var player = new ymaps.panorama.Player('player', panorama, {
        direction: [240, 0],
        span: [50, 50]
    });
})
