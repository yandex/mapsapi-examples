ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [59.994675, 29.702651],// Moscow
            zoom: 10,
            controls: ['zoomControl']
        }),
        gpxButton = $('.load-gpx'),
        kmlButton = $('.load-kml'),
        kmlFlightsButton = $('.load-kml-flights');

    // Disabling caching the "disabled" attribute in Firefox.
    gpxButton.get(0).disabled = false;
    kmlButton.get(0).disabled = false;
    kmlFlightsButton.get(0).disabled = false;

    /**
     * When the button is clicked, we load the appropriate
     * XML file and display its data on the map.
     */
    gpxButton.click(function (e) {
        ymaps.geoXml.load('geoObjects.gpx')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });
    kmlButton.click(function (e) {
        ymaps.geoXml.load('geoObjects.kml')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });
    kmlFlightsButton.click(function (e) {
        ymaps.geoXml.load('http://openflights.org/demo/openflights-sample.kml')
            .then(function (res) {
                res.geoObjects.each(function (obj) {
                    obj.options.set({preset: 'islands#blackCircleIcon'});
                    if (!obj.geometry) {
                        obj.each(function (obj) {
                            obj.options.set({strokeColor: "9090e8"});
                        });
                    }
                });
                onGeoXmlLoad(res);
            });
        e.target.disabled = true;
    });

    // The handler for loading XML files.
    function onGeoXmlLoad(res) {
        myMap.geoObjects.add(res.geoObjects);
        if (res.mapState) {
            res.mapState.applyToMap(myMap);
        }
        else {
            myMap.setBounds(res.geoObjects.getBounds());
        }
    }
}
