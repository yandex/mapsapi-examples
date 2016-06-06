ymaps.ready(function () {
    // To begin with, we have to check whether the user's browser supports the panorama player.
    if (!ymaps.panorama.isSupported()) {
        // If it doesn't, we won't do anything.
        return;
    }

    // First we describe the zoom levels of the panorama image.
 To do this, we set up a class that implements the IPanoramaTileLevel interface.
 The constructor parameters will be the template for the tile URLs and the size of the level.
    function TileLevel (urlTemplate, imageSize) {
        this._urlTemplate = urlTemplate;
        this._imageSize = imageSize;
    }

    ymaps.util.defineClass(TileLevel, {
        getTileUrl: function (x, y) {
            // Defining the tile URL for the passed indexes.
            return this._urlTemplate.replace('%c', y + '-' + x);
        },

        getImageSize: function () {
            return this._imageSize;
        }
    });

    // Now we are describing the panorama.
    function Panorama () {
        ymaps.panorama.Base.call(this);
        // Our panorama will have two zoom levels for the panorama image: low quality and high quality.
        this._tileLevels = [
            new TileLevel('tiles/lq/%c.jpg', [512, 256]),
            new TileLevel('tiles/hq/%c.jpg', [7168, 3584])
        ];
    }

    // Inheriting the panorama class from ymaps.panorama.Base, which partially
 implements IPanoramaTileLevel for us.
    ymaps.util.defineClass(Panorama, ymaps.panorama.Base, {
        getPosition: function () {
            // The panorama will be located at the beginning of...
            return [0, 0, 0];
        },

        getCoordSystem: function () {
            // ...the Cartesian coordinate system.
            return ymaps.coordSystem.cartesian;
        },

        getAngularBBox: function () {
            // The area that the panorama occupies on the panoramic field.
 In our case, it will be the entire sphere.
            return [
                0.5 * Math.PI,
                2 * Math.PI,
                -0.5 * Math.PI,
                0
            ];
        },

        getTileSize: function () {
            // The size of the tiles that the image is divided into.
            return [512, 512];
        },

        getTileLevels: function () {
            return this._tileLevels;
        }
    });

    // Now we are creating a panorama player with an instance of our panorama.
    var player = new ymaps.panorama.Player('player', new Panorama());
});
</p>

