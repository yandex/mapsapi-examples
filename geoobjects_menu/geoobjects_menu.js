ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.30954, 37.721587],
            zoom: 8
        });
    
    // Функция, которая по состоянию чекбоксов в меню
    // показывает или скрывает геообъекты из выборки.
    function checkState () {
        var shownObjects,
            byColor = new ymaps.GeoQueryResult(),
            byShape = new ymaps.GeoQueryResult();
        
        // Отберем объекты по цвету. 
        if ($('#red').prop('checked')) {
            // Будем искать по двум параметрам:
            // - для точечных объектов по полю preset;
            // - для контурных объектов по цвету заливки.
            byColor = myObjects.search('options.fillColor = "#ff1000"')
                .add(myObjects.search('options.preset = "islands#redIcon"'));
        }
        if ($('#green').prop('checked')) {
            byColor = myObjects.search('options.fillColor = "#00ff00"')
                .add(myObjects.search('options.preset = "islands#greenIcon"'))
                // После того, как мы нашли все зеленые объекты, добавим к ним
                // объекты, найденные на предыдущей итерации.
                .add(byColor);
        }
        if ($('#yellow').prop('checked')) {
            byColor = myObjects.search('options.fillColor = "#ffcc00"')
                .add(myObjects.search('options.preset = "islands#yellowIcon"'))
                .add(byColor);
        }
        // Отберем объекты по форме.
        if ($('#point').prop('checked')) {
            byShape = myObjects.search('geometry.type = "Point"');
        }
        if ($('#polygon').prop('checked')) {
            byShape = myObjects.search('geometry.type = "Polygon"').add(byShape);
        }
        if ($('#circle').prop('checked')) {
            byShape = myObjects.search('geometry.type = "Circle"').add(byShape);
        }
        
        // Мы отобрали объекты по цвету и по форме. Покажем на карте объекты,
        // которые совмещают нужные признаки.
        shownObjects = byColor.intersect(byShape).addToMap(myMap);
        // Объекты, которые не попали в выборку, нужно убрать с карты.
        myObjects.remove(shownObjects).removeFromMap(myMap);
    }
    
    $('#red').click(checkState);
    $('#green').click(checkState);
    $('#yellow').click(checkState);
    $('#point').click(checkState);
    $('#polygon').click(checkState);
    $('#circle').click(checkState);
    
    // Создадим объекты из их JSON-описания и добавим их на карту.
    window.myObjects = ymaps.geoQuery({
        type: "FeatureCollection",
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [55.34954, 37.721587]
                },
                options: {
                    preset: 'islands#yellowIcon'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Circle',
                    coordinates: [55.24954, 37.5],
                    radius: 20000
                },
                options: {
                    fillColor: "#ffcc00"
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[55.33954, 37.7], [55.43954, 37.7], [55.33954, 38.7], [55.33954, 37.7]]]
                },
                options: {
                    fillColor: "#ffcc00"
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [55.24954, 37.4]
                },
                options: {
                    preset: 'islands#greenIcon'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Circle',
                    coordinates: [55.14954, 37.61587],
                    radius: 10000
                },
                options: {
                    fillColor: '#00ff00'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [55.14954, 37.61587],
                    radius: 10000
                },
                options: {
                    preset: 'islands#redIcon'
                }
            }
        ]
    }).addToMap(myMap);
}
