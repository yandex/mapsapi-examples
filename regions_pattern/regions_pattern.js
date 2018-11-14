ymaps.ready(init);

function init() {

    var map = new ymaps.Map('map', {
        center: [68, 100],
        zoom: 2,
        type: null,
        controls: ['zoomControl']
    },{
        restrictMapArea: [[10, 10], [85,-160]]
    });
    map.controls.get('zoomControl').options.set({size: 'small'});

    // Добавим заливку цветом.
    var pane = new ymaps.pane.StaticPane(map, {
        zIndex: 100,
        css: {
            width: '100%', height: '100%', backgroundColor: '#f7f7f7'
        }
    });
    map.panes.append('background', pane);
    // Каждый регион мы будем относить к одной из 4-x групп
    // в зависимости от населения, проживающего на его территории.
    var percents = [0.3, 1.0, 2.0, 15];
    // Зададим изображения, которые будут использоваться для этих групп.
    var images = [
        'images/1.png',
        'images/2.png',
        'images/3.png',
        'images/4.png'
    ];
    var objectManager = new ymaps.ObjectManager();
    // Загрузим регионы.
    ymaps.borders.load('RU', {
        lang: 'ru',
        quality: 2
    }).then(function (result) {
        // Подготовим данные для objectManager.
        result.features.forEach(function (feature) {
            // Добавим iso код региона в качестве feature.id для objectManager.
            var iso = feature.properties.iso3166;
            feature.id = iso;
            // Получим процент населения, проживающего на данной территории.
            // Данные лежат в файле data.js.
            var population = populationData[iso].percent;
            // Зададим изображение в зависимости от количества проживающего населения.
            for (var i = 0; i < percents.length; i++) {
                if (population < percents[i]) {
                    feature.options = {
                        fillImageHref: images[i],
                        fillMethod: 'tile',
                        fillColor: '#ffffff'
                    };
                    break;
                }
            }
        });
        // Добавим регионы на карту.
        objectManager.add(result);
        map.geoObjects.add(objectManager);
    })
}