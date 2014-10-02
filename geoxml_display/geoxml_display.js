ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],// Москва
            zoom: 2,
            controls: ['zoomControl']
        }),
        ymapsmlButton = $('.load-ymapsml'),
        kmlButton = $('.load-kml');

    // Отключение кеширования атрибута disabled в Firefox.
    ymapsmlButton.get(0).disabled = false;
    kmlButton.get(0).disabled = false;

    // При нажатии на кнопку загружаем соответствующий XML-файл.
    // и отображаем его данные на карте.
    ymapsmlButton.click(function (e) {
        ymaps.geoXml.load('https://maps.yandex.ru/export/usermaps/93jfWjoXws37exPmKH-OFIuj3IQduHal/')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });
    kmlButton.click(function (e) {
        ymaps.geoXml.load('https://openflights.org/demo/openflights-sample.kml')
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