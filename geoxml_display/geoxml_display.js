ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [59.994675, 29.702651],// Москва
            zoom: 10,
            controls: ['zoomControl']
        }),
        gpxButton = $('.load-gpx'),
        kmlButton = $('.load-kml');

    // Отключение кеширования атрибута disabled в Firefox.
    gpxButton.get(0).disabled = false;
    kmlButton.get(0).disabled = false;

    // При нажатии на кнопку загружаем соответствующий XML-файл.
    // и отображаем его данные на карте.
   gpxButton.click(function (e) {
        ymaps.geoXml.load('geoObjects.gpx')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });
    kmlButton.click(function (e) {
        ymaps.geoXml.load('geoObjects.kml')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });

    // Обработчик загрузки XML-файлов.
    function onGeoXmlLoad (res) {
        myMap.geoObjects.add(res.geoObjects);
        if (res.mapState) {
            res.mapState.applyToMap(myMap);
        }
    }
}