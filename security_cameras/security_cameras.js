ymaps.ready(init);

function init() {
    var obj = json;

    var myMap = new ymaps.Map('map', {
        center: [55.733835, 37.588227],
        zoom: 11,
        controls: []
    });

    ymaps.modules.require(['Heatmap'], function (Heatmap) {
        var data = [];
        for (var i = 0; i < obj.length; i ++) {
            data.push([obj[i].Cells.geoData.coordinates[1], obj[i].Cells.geoData.coordinates[0]])
        }
        var heatmap = new Heatmap(data, {
            // Радиус влияния.
            radius: 20,
            // Нужно ли уменьшать пиксельный размер точек при уменьшении зума. False - не нужно.
            dissipating: false,
            // Прозрачность тепловой карты.
            opacity: 0.8,
            // Прозрачность у медианной по весу точки.
            intensityOfMidpoint: 0.2,
            // JSON описание градиента.
            gradient: {
                0.1: 'rgba(128, 255, 0, 0.7)',
                0.2: 'rgba(255, 255, 0, 0.8)',
                0.7: 'rgba(234, 72, 58, 0.9)',
                1.0: 'rgba(162, 36, 25, 1)'
            }
        });
        heatmap.setMap(myMap);
    });
}