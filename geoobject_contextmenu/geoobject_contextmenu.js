ymaps.ready(init);

function init () {
    // Creating the map.
    var myMap = new ymaps.Map("map", {
            center: [47.60, 41.8],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Creating a placemark.
    var myPlacemark = new ymaps.Placemark([47.60, 42.10], {
        iconContent: 'Щелкни по мне правой кнопкой мыши!'
    }, {
        // Red icon that stretches to fit content.
        preset: "islands#redStretchyIcon"
    });

    // The context menu allows you to change the placemark settings. It is opened by right-clicking
    // the placemark.
    myPlacemark.events.add('contextmenu', function (e) {
        // If the placemark menu is already displayed, remove it.
        if ($('#menu').css('display') == 'block') {
            $('#menu').remove();
        } else {
            // HTML content of the context menu.
            var menuContent =
                '<div id="menu">\
                    <ul id="menu_list">\
                        <li>Название: <br /> <input type="text" name="icon_text" /></li>\
                        <li>Подсказка: <br /> <input type="text" name="hint_text" /></li>\
                        <li>Балун: <br /> <input type="text" name="balloon_text" /></li>\
                    </ul>\
                <div align="center"><input type="submit" value="Сохранить" /></div>\
                </div>';

            // Putting a context menu on the page
            $('body').append(menuContent);

            // Setting the menu position.
            $('#menu').css({
                left: e.get('pagePixels')[0],
                top: e.get('pagePixels')[1]
            });

            // Filling the fields of the context menu with the current values of the placemark
            // properties.
            $('#menu input[name="icon_text"]').val(myPlacemark.properties.get('iconContent'));
            $('#menu input[name="hint_text"]').val(myPlacemark.properties.get('hintContent'));
            $('#menu input[name="balloon_text"]').val(myPlacemark.properties.get('balloonContent'));

            // When the "Save" button is clicked, we change placemark properties to the values
            // entered in the context menu form.
            $('#menu input[type="submit"]').click(function () {
                myPlacemark.properties.set({
                    iconContent: $('input[name="icon_text"]').val(),
                    hintContent: $('input[name="hint_text"]').val(),
                    balloonContent: $('input[name="balloon_text"]').val()
                });
                // Removing the context menu.
                $('#menu').remove();
            });
        }
    });

    myMap.geoObjects.add(myPlacemark);
}
