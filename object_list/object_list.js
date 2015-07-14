ymaps.ready(init);

function init() {

    // Creating an instance of the map.
    var myMap = new ymaps.Map('map', {
            center: [50.443705, 30.530946],
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // The container for the menu.
        menu = $('<ul class="menu"/>');
        
    for (var i = 0, l = groups.length; i < l; i++) {
        createMenuGroup(groups[i]);
    }

    function createMenuGroup (group) {
        // A menu item.
        var menuItem = $('<li><a href="#">' + group.name + '</a></li>'),
        // Collection for geo objects in a group.
            collection = new ymaps.GeoObjectCollection(null, { preset: group.style }),
        // The container for the submenu.
            submenu = $('<ul class="submenu"/>');

        // Adding a collection to the map.
        myMap.geoObjects.add(collection);

        // Adding a submenu.
        menuItem
            .append(submenu)
            // Adding a menu item.
            .appendTo(menu)
            // On click, removing/adding the collection to the map and hiding/displaying the
            // submenu.
            .find('a')
            .toggle(function () {
                myMap.geoObjects.remove(collection);
                submenu.hide();
            }, function () {
                myMap.geoObjects.add(collection);
                submenu.show();
            });
        for (var j = 0, m = group.items.length; j < m; j++) {
            createSubMenu(group.items[j], collection, submenu);
        }
    }

    function createSubMenu (item, collection, submenu) {
        // A submenu item.
        var submenuItem = $('<li><a href="#">' + item.name + '</a></li>'),
        // Creating a placemark.
            placemark = new ymaps.Placemark(item.center, { balloonContent: item.name });

        // Adding a placemark to the collection.
        collection.add(placemark);
        // Adding an item to the submenu.
        submenuItem
            .appendTo(submenu)
            // When an item in the submenu is clicked, we open/close the placemark balloon.
            .find('a')
            .toggle(function () {
                placemark.balloon.open();
            }, function () {
                placemark.balloon.close();
            });
    }

    // Adding the menu to the BODY tag.
    menu.appendTo($('body'));
    // Setting the map zoom so all groups are visible.
    myMap.setBounds(myMap.geoObjects.getBounds());
}
