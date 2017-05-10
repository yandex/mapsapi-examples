ymaps.ready(['Heatmap']).then(function init() {
    var obj = json;

    var myMap = new ymaps.Map('map', {
        center: [55.733835, 37.588227],
        zoom: 11,
        controls: []
    });

    var data = [];
    for (var i = 0; i < obj.length; i++) {
        data.push([obj[i].Cells.geoData.coordinates[1], obj[i].Cells.geoData.coordinates[0]])
    }
    var heatmap = new ymaps.Heatmap(data, {
        // The radius of influence.
        radius: 15,
        // Whether to reduce the pixel size of the dots when reducing the zoom. False - Do not reduce the size.
        dissipating: false,
        // The transparency of the heatmap.
        opacity: 0.8,
        // The transparency of the median weight point.
        intensityOfMidpoint: 0.2,
        // JSON description of the gradient.
        gradient: {
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)'
        }
    });
    heatmap.setMap(myMap);
});
