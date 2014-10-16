ymaps.ready(init);

function init () {
    var center = [55.819543, 37.611619],
        map = new ymaps.Map(
            'map', {
                center: center,
                zoom: 5
            }, {
                geoObjectClusterDisableClickZoom: true
            }
        ),
        i,
        ClusterBalloonItemContentLayout = ymaps.templateLayoutFactory.createClass([
            '<div class=entry>',
            '<div class=bold>$[properties.balloonContentHeader]</div>',
            '<div>$[properties.balloonContentBody]</div>',
            '<div class=author>$[properties.balloonContentFooter]</div>',
            '</div>'
        ].join('')),
        placemarks = [],
        clusterer = new ymaps.Clusterer({
            // Используем макет балуна кластера "аккордеон"
            clusterBalloonContentBodyLayout: "cluster#balloonAccordionContent",
            // Используем собственный подмакет для отображения информации о геообъекте
            clusterBalloonAccordionItemContentLayout: ClusterBalloonItemContentLayout,

            clusterBalloonWidth: 300,
            clusterBalloonHeight: 200
        }),
        icons = ['pizza', 'burger', 'film', 'food', 'market', 'pharmacy'];

    for (i = 0; i < 99; i++) {
        var icon = getRandomIcon();
        placemarks[i] = new ymaps.Placemark(getRandomCoordinates(), {
            clusterCaption: 'Метка ' + (i + 1),
            balloonContentHeader: 'Чайлд Роланд к Тёмной Башне пришёл',
            balloonContentBody: ['...',
                                 'Его слова — мне дальше не пройти,',
                                 'Мне надо повернуть на этот тракт,',
                                 'Что уведет от Темной Башни в мрак…',
                                 'Я понял: предо мной — конец пути,',
                                 'И рядом цель, что я мечтал найти…',
                                 'Но смысл за годы обратился в прах,',
                                 '...'].join('<br/>'),
            balloonContentFooter: 'Роберт Браунинг'
        }, {
            // иконка геообъекта на карте
            iconImageHref: 'images/pin_' + icon + '.png',
            iconImageSize: [32, 36],
            iconImageOffet: [-16, -36],
            // иконка геообъекта в балуне кластера
            balloonIconImageHref: 'images/' + icon + '.png',
            balloonIconImageOffset: [2, 2],
            balloonIconImageSize: [14, 14]
        });
    }

    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);

    function getRandomCoordinates () {
        return [
            center[0] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1),
            center[1] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1)
        ];
    }

    function getRandomIcon () {
        return icons[Math.floor(Math.random() * icons.length)];

    }
}