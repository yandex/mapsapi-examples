ymaps.ready(function () {
    var mapCenter = [55.755381, 37.619044],
        map = new ymaps.Map('map', {
            center: mapCenter,
            zoom: 9,
            controls: []
        });
        
    // Creating a custom layout with information about the selected geo object.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // The "raw" flag means that data is inserted "as is" without escaping HTML.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );
    
    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        /**
         * Setting the mode for opening the balloon.
         * In this example, the balloon will never open in the panel mode.
         */
        clusterBalloonPanelMaxMapArea: 0,
        // Setting the size of the balloon content layout (in pixels).
        clusterBalloonContentLayoutWidth: 350,
        // Setting a custom layout.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Setting the width of the left column, which contains a list of all geo objects in the cluster.
        clusterBalloonLeftColumnWidth: 120
    });
    
    // Populating the cluster with geo objects with random positions.
    var placemarks = [];
    for (var i = 0, l = 100; i < l; i++) {
        var placemark = new ymaps.Placemark(getRandomPosition(), {
            // Defining the data that will be displayed in the balloon.
            balloonContentHeader: 'Placemark #' + (i + 1),
            balloonContentBody: getContentBody(i),
            balloonContentFooter: 'Matsuo Bashō'
        });
        placemarks.push(placemark);
    }
    
    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);
    
    function getRandomPosition () {
        return [
            mapCenter[0] + (Math.random() * 0.3 - 0.15),
            mapCenter[1] + (Math.random() * 0.5 - 0.25)
        ];
    }
    
    var placemarkBodies;
    function getContentBody (num) {
        if (!placemarkBodies) {
            placemarkBodies = [
                ['Lonely stillness', 'A single cicada’s cry', 'Sinking into stone'].join('<br/>'),
                ['Moonlight slanting', 'Through all this long bamboo grove ', 'And nightingale song.'].join('<br/>'),
                ['It is deep autumn', 'My neighbor', 'How does he live, I wonder.'].join('<br/>')
            ];
        }
        return '<strong>Body of the placemark #' + (num + 1) + '</strong><br/>' + placemarkBodies[num % placemarkBodies.length]; 
    }
    clusterer.balloon.open(clusterer.getClusters()[0]);
});
