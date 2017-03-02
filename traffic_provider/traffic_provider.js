ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [56.136, 40.390],
            zoom: 10,
            controls: []
        });
    
    // Creating a "Now" traffic provider with the layer of information points enabled.
    var actualProvider = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });
    // And then adding it to the map.
    actualProvider.setMap(myMap);
    
    /**
     * Removing the provider from the map is also performed through setMap.
     * actualProvider.setMap(null);
     */
}
