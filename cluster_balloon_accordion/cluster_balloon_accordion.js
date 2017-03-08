ymaps.ready(function () {
    var mapCenter = [55.755381, 37.619044],
        map = new ymaps.Map('map', {
            center: mapCenter,
            zoom: 9,
            controls: []
        }),
        // Possible values for icon colors.
        placemarkColors = [
            '#FF1F1F', '#1F44FF', '#1FFF8E', '#FF1FF5',
            '#FFEF1F', '#FF931F', '#AE6961', '#6193AE'
        ];
        
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
        // Setting the "Accordion" standard layout for a cluster balloon.
        clusterBalloonContentLayout: 'cluster#balloonAccordion',
        // Setting a custom layout.
        clusterBalloonItemContentLayout: customItemContentLayout,
        /**
         * Setting the mode for opening the balloon.
         * In this example, the balloon will never open in the panel mode.
         */
        clusterBalloonPanelMaxMapArea: 0,
        // Setting the size of the balloon content layout (in pixels).
        clusterBalloonContentLayoutWidth: 250,
        clusterBalloonContentLayoutHeight: 200,
        /**
         * You can disable displaying icons for geo objects in the list.
         * In Internet Explorer earlier than version 9, icons are never displayed.
         * clusterBalloonAccordionShowIcons: false
         */
    });
    
    // Populating the cluster with geo objects with random positions.
    var placemarks = [];
    for (var i = 0, l = 100; i < l; i++) {
        var placemark = new ymaps.Placemark(getRandomPosition(), {
            // Defining the data that will be displayed in the balloon.
            balloonContentHeader: 'Placemark #' + (i + 1),
            balloonContentBody: getContentBody(i),
            balloonContentFooter: 'Matsuo Bashō'
        }, {
            iconColor: getRandomColor()
        });
        placemarks.push(placemark);
    }
    
    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);
    
    
    function getRandomPosition () {
        return [
            mapCenter[0] + (Math.random() * 0.6 - 0.3),
            mapCenter[1] + (Math.random() * 0.8 - 0.4)
        ];
    }

    function getRandomColor() {
        return placemarkColors[Math.round(Math.random() * placemarkColors.length)];
    }
    
    var placemarkBodies;
    function getContentBody (num) {
        if (!placemarkBodies) {
            placemarkBodies = [
                ['A snowy morning -', 'By myself', 'Chewing on dried salmon'].join('<br/>'),
                 ['/Crow’s', 'Abandoned nest,', 'A plum tree.'].join('<br/>'),
                 ['/Fragrance of bindweed', 'On my palms the whole night –', 'Thinking of Chiyo-jo.'].join('<br/>')
             ];
        }
        return '<strong>Body of the placemark #' + (num + 1) + '</strong><br/>' + placemarkBodies[num % placemarkBodies.length];
    }
    clusterer.balloon.open(clusterer.getClusters()[0]);
});
