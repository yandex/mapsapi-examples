ymaps.ready(function () {
    var mapCenter = [55.755381, 37.619044],
        map = new ymaps.Map('map', {
            center: mapCenter,
            zoom: 9,
            controls: []
        }),
        // Возможные значения цветов иконок.
        placemarkColors = [
            '#FF1F1F', '#1F44FF', '#1FFF8E', '#FF1FF5',
            '#FFEF1F', '#FF931F', '#AE6961', '#6193AE'
        ];
        
    // Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );
    
    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Аккордеон".
        clusterBalloonContentLayout: 'cluster#balloonAccordion',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 250,
        clusterBalloonContentLayoutHeight: 200,
        // Можно отключить отображение иконок геообъектов в списке. 
        // В браузере Internet Explorer ниже 9й версии иконки никогда не будут отображаться.
        // clusterBalloonAccordionShowIcons: false
    });
    
    // Заполняем кластер геообъектами со случайными позициями.
    var placemarks = [];
    for (var i = 0, l = 100; i < l; i++) {
        var placemark = new ymaps.Placemark(getRandomPosition(), {
            // Устаналиваем данные, которые будут отображаться в балуне.
            balloonContentHeader: 'Метка №' + (i + 1),
            balloonContentBody: getContentBody(i),
            balloonContentFooter: 'Мацуо Басё'
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
                ['Снег согнул бамбук,', 'Словно мир вокруг него', 'Перевернулся.'].join('<br/>'),
                ['Пустое гнездо.', 'Так и покинутый дом -', 'Выехал сосед.'].join('<br/>'),
                ['В жару крестьянин', 'Прилег на цветы вьюнка.', 'Так же прост наш мир.'].join('<br/>') 
            ];
        }
        return '<strong>Тело метки №' + (num + 1) + '</strong><br/>' + placemarkBodies[num % placemarkBodies.length];
    }
    clusterer.balloon.open(clusterer.getClusters()[0]);
});