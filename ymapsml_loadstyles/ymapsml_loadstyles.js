ymaps.ready(init);

function init () {
    // Создание экземпляра карты.
    var myMap = new ymaps.Map('map', {
            center: [56.76, 38.64],
            zoom: 7
        });

    // Загрузка YMapsML-файла.
    ymaps.geoXml.load('overlays_styles.xml')
        .then(
        function () {
            //Загрузка YMapsML-файла
            ymaps.geoXml.load('overlays.xml')
                .then(
                function (res) {
                    // Добавление геообъектов на карту.
                    myMap.geoObjects.add(res.geoObjects);
                },
                // Вызывается в случае неудачной загрузки YMapsML-файла.
                function (error) {
                    alert('При загрузке YMapsML-файла произошла ошибка: ' + error);
                }
            );
        },
        // Вызывается в случае неудачной загрузки стилей.
        function (error) {
            alert('При загрузке стилей произошла ошибка: ' + error);
        }
    );

}