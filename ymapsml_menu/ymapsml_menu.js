ymaps.ready(init);

function init () {

    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
        center: [50.443705, 30.530946],
        zoom: 12,
        controls: []
    });

    // Loading a YMapsML file.
    ymaps.geoXml.load('data.xml')
        .then(function (res) {
            res.geoObjects.each(function (item) {
                addMenuItem(item, myMap);
            });
        },
        // Called if loading the YMapsML file was unsuccessful.
        function (error) {
            alert("При загрузке YMapsML-файла произошла ошибка: " + error);
        });

    // Adding an element to the list.
    function addMenuItem(group, map) {
        // Showing/hiding a group of geo objects on the map.
        $("<a class=\"title\" href=\"#\">" + group.properties.get('name') + "</a>")
            .bind("click", function () {
                var link = $(this);
                // If the menu item is "inactive," we add the group to the map. Otherwise, we
                // delete it from the map.
                if (link.hasClass("active")) {
                    map.geoObjects.remove(group);
                } else {
                    map.geoObjects.add(group);
                }
                // Changing the "active" state of the menu item.
                link.toggleClass("active");
                return false;
            })
            // Adding a new menu item to the list.
            .appendTo(
                $("<li></li>").appendTo($("#menu"))
            );
    }
}
