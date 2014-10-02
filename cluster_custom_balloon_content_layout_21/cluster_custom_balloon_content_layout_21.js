jQuery(function () {
    ymaps.ready(function () {
        var mapCenter = [55.755381, 37.619044],
            map = new ymaps.Map('map', {
                center: mapCenter,
                zoom: 10,
                controls: []
            }),
            placemarks = [];
            
        // Создаем собственный макет с информацией о выбранном геообъекте.
        var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
                '<ul class=list>',
                // Выводим в цикле список всех геообъектов.
                '{% for geoObject in properties.geoObjects %}',
                    '<li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
                '{% endfor %}',
                '</ul>'
            ].join(''));
        
        
        jQuery(document).on( "click", "a.list_item", function() {
            // Определяем по какой метке произошло событие.
            var selectedPlacemark = placemarks[jQuery(this).data().placemarkid];
            alert( selectedPlacemark.properties.get('balloonContentBody') );
        });
        
        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем режим открытия балуна. 
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // По умолчанию опции балуна balloonMaxWidth и balloonMaxHeight не установлены для кластеризатора,
            // так как все стандартные макеты имеют определенные размеры.
            clusterBalloonMaxHeight: 200,
            // Устанавливаем собственный макет контента балуна.
            clusterBalloonContentLayout: customBalloonContentLayout
        });
        
        // Заполняем кластер геообъектами со случайными позициями.
        for (var i = 0, l = 100; i < l; i++) {
            var placemark = new ymaps.Placemark(getRandomPosition(), {
                // Устаналиваем данные, которые будут отображаться в балуне.
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