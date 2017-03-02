ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [56.136, 40.390],
            zoom: 10,
            controls: []
        });

    // Creating the "Traffic" control.
    var trafficControl = new ymaps.control.TrafficControl({ state: {
            // Displaying traffic "Now".
            providerKey: 'traffic#actual',
            // Begin immediately showing traffic on the map.
            trafficShown: true
        }});
    // Adding the control to the map.
    myMap.controls.add(trafficControl);
    // Getting a reference to the "Now" traffic provider and enabling the display of information points.
    trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true);    
}
