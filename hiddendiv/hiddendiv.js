ymaps.ready(init);

var myMap;

function init () {
    /**
     * Initializing tabs.
     * After executing the tabs() command, tab-2 gets style='display:none'.
     * The map will be initialized, but the size will be null.
     * This is a good thing in this case, since the invisible map won't load invisible tiles.
     */
    $('#tabs').tabs();
    myMap = new ymaps.Map('tab-2', {
        center: [55.76, 37.64], // Moscow
        zoom: 10
    });

    /**
     * We'll recalculate the map size when the new tab is displayed.
     * The map will get the maximum possible values when its tab is activated
     * and null values when the first tab is selected.
     * We'll subscribe to the 'tabsshow' event (not 'tabselect',
     * since it requires that the element with the map is already visible).
     */
    $('#tabs').bind('tabsshow', function (event, ui) {
        myMap.container.fitToViewport();
    });
}
