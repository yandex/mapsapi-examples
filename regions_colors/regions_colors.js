ymaps.ready(init);

function init() {

    var map = new ymaps.Map('map', {
        center: [48.704272, 65.602030],
        zoom: 4,
        type: 'yandex#map',
        controls: ['zoomControl']
    });
    map.controls.get('zoomControl').options.set({size: 'small'});

    var objectManager = new ymaps.ObjectManager();
    // Загрузим регионы.
    ymaps.borders.load('KZ', {
        lang: 'ru',
        quality: 2
    }).then(function (result) {
        // Очередь раскраски.
        var queue = [];
        // Создадим объект regions, где ключи это ISO код региона.
        var regions = result.features.reduce(function (acc, feature) {
            // Добавим ISO код региона в качестве feature.id для objectManager.
            var iso = feature.properties.iso3166;
            feature.id = iso;
            // Добавим опции региона по умолчанию.
            feature.options = {
                fillOpacity: 0.6,
                strokeColor: '#FFF',
                strokeOpacity: 0.5
            };
            acc[iso] = feature;
            return acc;
        }, {});

        // Функция, которая раскрашивает регион и добавляет всех нераскрасшенных соседей в очередь на раскраску.
        function paint(iso) {
            // Получим ссылку на раскрашиваемый регион и на его соседей.
            var region = regions[iso];
            var neighbors = region.properties.neighbors;
            // Если у региона есть опция fillColor, значит мы его уже раскрасили.
            if (region.options.fillColor) {
                return;
            }
            // Зададим цвета для раскрашивания.
            // Обратите внимание, для раскраски более крупных карт нужно задавать пятый цвет.
            var сolours = ['#F0F075', '#FB6C3F', '#3D4C76', '#49C0B5'];
            // Если у региона есть соседи, то нужно проверить, какие цвета уже заняты.
            if (neighbors.length !== 0) {
                neighbors.forEach(function (neighbor) {
                    var fillColor = regions[neighbor].options.fillColor;
                    // Если регион раскрашен, то исключаем его цвет.
                    if (fillColor) {
                        var index = сolours.indexOf(fillColor);
                        if (index != -1) {
                            сolours.splice(index, 1);
                        }
                        // Если регион не раскрашен, то добавляем его в очередь на раскраску.
                    } else if (queue.indexOf(neighbor) === -1) {
                        queue.push(neighbor);
                    }
                });
            }
            // Раскрасим регион в первый доступный цвет.
            region.options.fillColor = сolours[0];
        }

        for (var iso in regions) {
            // Если регион не раскрашен, добавим его в очередь на раскраску.
            if (!regions[iso].options.fillColor) {
                queue.push(iso);
            }
            // Раскрасим все регионы из очереди.
            while (queue.length > 0) {
                paint(queue.shift());
            }
        }
        // Добавим регионы на карту.
        result.features = [];
        for (var reg in regions) {
            result.features.push(regions[reg]);
        }
        objectManager.add(result);
        map.geoObjects.add(objectManager);
    })
}
