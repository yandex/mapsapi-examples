jQuery(function () {
    ymaps.ready(function () {
        var mapCenter = [55.755381, 37.619044],
            map = new ymaps.Map('map', {
                center: mapCenter,
                zoom: 10,
                controls: []
            }),
            placemarks = [];
            
        // Creating a custom layout with information about the selected geo object.
        var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
                '<ul class=list>',
                // Outputting a list of all geo objects in the cycle.
                '{% for geoObject in properties.geoObjects %}',
                    '<li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
                '{% endfor %}',
                '</ul>'
            ].join(''));
        
        
        jQuery(document).on( "click", "a.list_item", function() {
            // Determining what placemark the event occurred on.
            var selectedPlacemark = placemarks[jQuery(this).data().placemarkid];
            alert( selectedPlacemark.properties.get('balloonContentBody') );
        });
        
        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Setting the mode for opening the balloon. In this example, the balloon will never
            // open in the panel mode.
            clusterBalloonPanelMaxMapArea: 0,
            // By default, the balloon options balloonMaxWidth and balloonMaxHeight are not set for
            // the clusterer, since all standard layouts have defined dimensions.
            clusterBalloonMaxHeight: 200,
            // Setting a custom layout for balloon content.
            clusterBalloonContentLayout: customBalloonContentLayout
        });
        
        // Populating the cluster with geo objects with random positions.
        for (var i = 0, l = 100; i < l; i++) {
            var placemark = new ymaps.Placemark(getRandomPosition(), {
                // Defining the data that will be displayed in the balloon.
                balloonContentHeader: 'Заголовок метки №' + (i + 1),
                balloonContentBody: 'Информация о метке №' + (i + 1),
                placemarkId: i
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
        clusterer.balloon.open(clusterer.getClusters()[0]);
    });
});
