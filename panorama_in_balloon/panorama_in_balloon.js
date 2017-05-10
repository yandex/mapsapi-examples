ymaps.ready(function () {
    // To begin with, we have to check whether the user's browser supports the panorama player.
    if (!ymaps.panorama.isSupported()) {
        // If it doesn't, we won't do anything.
        return;
    }

    var myMap = new ymaps.Map('map', {
            center: [59.938557, 30.316198],
            zoom: 10,
            controls: []
        }),

        /**
         * Clicking the placemark opens a balloon
         * that contains a Yandex panorama at the current geo point.
         */
        myPlacemark1 = new ymaps.Placemark([59.938557, 30.316198], {
            // For this placemark, we need to open an aerial panorama.
            panoLayer: 'yandex#airPanorama'
        }, {
            preset: 'islands#redIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

        myPlacemark2 = new ymaps.Placemark([59.900557, 30.44319], {
            // For this placemark, we'll request a land panorama.
            panoLayer: 'yandex#panorama'
        }, {
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        });

    // A function that defines the balloon content layout for the placemark.
    function setBalloonContentLayout (placemark, panorama) {
        // Creating the balloon content layout.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:250px;height:150px"/>', {
                /**
                 * Redefining the build function in order to create the panorama player
                 * when making the layout.
                 */
                build: function () {
                    // First, we call the "build" method of the parent class.
                    BalloonContentLayout.superclass.build.call(this);
                    // Adding the panorama player to the balloon content.
                    this._openPanorama();
                },
                /**
                 * Redefining the clear function in the same way, in order to delete
                 * the panorama player when deleting the layout from the map.
                 */
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Adding the panorama player.
                _openPanorama: function () {
                    if (!this._panoramaPlayer) {
                        // Getting the container that our panorama will be placed in.
                        var el = this.getParentElement().querySelector('#panorama');
                        this._panoramaPlayer = new ymaps.panorama.Player(el, panorama, {
                            controls: ['panoramaName']
                        });
                    }
                },
                // Deleting the panorama player.
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            });
        // Setting the created layout in the placemark options.
        placemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    /**
     * In this function, we check if there is a panorama at this point.
     * If we found a panorama, we set a layout with this panorama for the balloon,
     * otherwise we set simple text contents for the balloon.
     */
    function requestForPanorama (e) {
        var placemark = e.get('target'),
            // Coordinates of the point that we will request a panorama for.
            coords = placemark.geometry.getCoordinates(),
            // Panorama type (aerial or land).
            panoLayer = placemark.properties.get('panoLayer');

        placemark.properties.set('balloonContent', "Checking for panoramas...");

        // Requesting the panorama object.
        ymaps.panorama.locate(coords, {
            layer: panoLayer
        }).then(
            function (panoramas) {
                if (panoramas.length) {
                    // Setting the layout containing the found panorama for the balloon.
                    setBalloonContentLayout(placemark, panoramas[0]);
                } else {
                    /**
                     * If a panorama wasn't found, we define
                     * a basic text in the balloon content.
                     */
                    placemark.properties.set('balloonContent', "No panoramas at this point.");
                }
            },
            function (err) {
                placemark.properties.set('balloonContent',
                    "Error occurred when opening the panorama: " + err.toString());
            }
        );
    }

    /**
     * Listening for the 'balloonopen' event on placemarks: as soon as the balloon is opened the 
     * first time, we check whether there is a panorama at this point. If found, we create a 
     * layout with this panorama.
     * We only listen for the balloon open event once.
     */
    myPlacemark1.events.once('balloonopen', requestForPanorama);
    myPlacemark2.events.once('balloonopen', requestForPanorama);

    myMap.geoObjects.add(myPlacemark1);
    myMap.geoObjects.add(myPlacemark2);


    /**
     * If the 'draggable' option will be enabled for placemarks, in order for the panorama
     * to be displayed for a new point when dragging the placemark, uncomment the code below:
     */

    /*
     function onDragEnd (e) {
         var placemark = e.get('target');

          // As soon as the user moved the placemark to another point,
          // we're deleting the balloon layout specified earlier.

         placemark.options.unset('balloonContentLayout');
         // Also we'll remove the text content of the balloon.
         placemark.properties.unset('balloonContent');


          // Subscribing again to the event of the balloon opening.
          // We will listen to this event only once.

         placemark.events.once('balloonopen', requestForPanorama);
     }


      // Listening to the placemark event 'dragend'. When it is fired,
      // we will delete the balloon layout with the old panorama, and then
      // check if the panorama exists at the new point.

     myPlacemark1.events.add('dragend', onDragEnd);
     myPlacemark2.events.add('dragend', onDragEnd);
     */
});
