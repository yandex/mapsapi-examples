ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.755381, 37.619044],
            zoom: 7,
            // Not displaying any standard controls on the map, as they were not loaded.
            controls: []
        });
        
    var loadControl = new ymaps.control.Button({
            data: { content: 'Добавить метку' },
            options: { maxWidth: 200, float: 'right', selectOnClick: false }
        });
    myMap.controls.add(loadControl);
    
    loadControl.events.add('click', function () {
        if (ymaps.Placemark) {
            // If the module has already been loaded, there is no need to access the module system
            // again.
            addPlacemark();
        } else {
            // On-demand loading of the placemarks class and overlay. By default, the overlay is
            // automatically loaded after you add placemarks to the map. In this example, the
            // placemark module itself is loaded asynchronously and there is no need to load the
            // overlay separately.
            ymaps.modules.require(['Placemark', 'overlay.Placemark'])
                .spread(function (Placemark, PlacemarkOverlay) {
                    // Adding the class manually to the global viewport, since this does not happen
                    // when using the "require" method of the module system.
                    ymaps.Placemark = Placemark;
                    addPlacemark();
                });
        }
    });
    
    function addPlacemark() {
        var center = myMap.getCenter();
        // Setting a random position close to the center of the map.
        center[0] += (Math.random() * 2) - 1;
        center[1] += (Math.random() * 2) - 1;
        var placemark = new ymaps.Placemark(center);
        myMap.geoObjects.add(placemark);
    }
});
