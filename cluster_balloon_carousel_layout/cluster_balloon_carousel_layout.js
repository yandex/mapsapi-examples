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
        content = [
            [
                "Пятнадцать человек на сундук мертвеца, ",
                "Йо-хо-хо, и бутылка рому! ",
                "Пей, и дьявол тебя доведёт до конца. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Их мучила жажда, в конце концов, ",
                "Йо-хо-хо, и бутылка рому! ",
                "Им стало казаться, что едят мертвецов. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Что пьют их кровь и мослы их жуют. ",
                "Йо-хо-хо, и бутылка рому! ",
                "Вот тут-то и вынырнул чёрт Дэви Джонс. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Он вынырнул с чёрным большим ключом, ",
                "Йо-хо-хо, и бутылка рому! ",
                "С ключом от каморки на дне морском. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Таращил глаза, как лесная сова, ",
                "Йо-хо-хо, и бутылка рому! ",
                "И в хохоте жутком тряслась голова. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Сказал он: «Теперь вы пойдёте со мной, ",
                "Йо-хо-хо, и бутылка рому! ",
                "Вас всех схороню я в пучине морской». ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "И он потащил их в подводный свой дом, ",
                "Йо-хо-хо, и бутылка рому! ",
                "И запер в нём двери тем чёрным ключом. ",
                "Йо-хо-хо, и бутылка рому!"
            ]
        ],
        ClusterBalloonContentItemLayout = ymaps.templateLayoutFactory.createClass([
            '<div class=entry>',
            '<div class=bold>$[properties.balloonContentHeader]</div>',
            '<div>$[properties.balloonContentBody]</div>',
            '<div class=author>$[properties.balloonContentFooter]</div>',
            '</div>'
        ].join('')),
        placemarks = [],
        clusterer = new ymaps.Clusterer({
            // Используем макет балуна кластера "карусель"
            clusterBalloonContentBodyLayout: "cluster#balloonCarouselContent",
            // Используем собственный подмакет для отображения информации о геообъекте
            clusterBalloonContentItemLayout: ClusterBalloonContentItemLayout,
            // Устанавливаем ограничение на количество элементов в нижней панели
            clusterBalloonPagerSize: 5,

            // Установка внешнего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',

            clusterBalloonWidth: 220
        });

    for (i = 0; i < 99; i++) {
        placemarks[i] = new ymaps.Placemark(getRandomCoordinates(), {
            balloonContentHeader: 'Пиратская песня (' + (i + 1) + ')',
            balloonContentBody: getRandomContentPart(),
            balloonContentFooter: 'Р.Л.Стивенсон'
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

    function getRandomContentPart () {
        return content[Math.floor(Math.random() * content.length)].join('<br/>');
    }
}
