ymaps.ready(init);

function init () {

    // Создание экземпляра карты.
    var myMap = new ymaps.Map('map', {
        center: [50.443705, 30.530946],
        zoom: 12,
        controls: []
    });

    // Загрузка YMapsML-файла.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            res.geoObjects.each(function (item) {
                addMenuItem(item, myMap);
            });
        },
        // Вызывается в случае неудачной загрузки YMapsML-файла.
        function (error) {
            alert("При загрузке YMapsML-файла произошла ошибка: " + error);
        });

    // Добавление элемента в список.
    function addMenuItem(group, map) {
        // Показать/скрыть группу геообъектов на карте.
        $("<a class=\"title\" href=\"#\">" + group.properties.get('name') + "</a>")
            .bind("click", function () {
                var link = $(this);
                // Если пункт меню "неактивный", то добавляем группу на карту,
                // иначе - удаляем с карты.
                if (link.hasClass("active")) {
                    map.geoObjects.remove(group);
                } else {
                    map.geoObjects.add(group);
                }
                // Меняем "активность" пункта меню.
                link.toggleClass("active");
                return false;
            })
            // Добавление нового пункта меню в список.
            .appendTo(
                $("<li></li>").appendTo($("#menu"))
            );
    }
}