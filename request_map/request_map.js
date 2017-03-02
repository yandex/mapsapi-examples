// Initializing as soon as the API is loaded and the DOM is ready
ymaps.ready(init);

// Initialization and destruction of the map when the button is clicked.
function init () {
    var myMap;

    $('#toggle').bind({
        click: function () {
            if (!myMap) {
                myMap = new ymaps.Map('map', {
                    center: [55.010251, 82.958437], // Novosibirsk
                    zoom: 9
                }, {
                    searchControlProvider: 'yandex#search'
                });
                $("#toggle").attr('value', 'Hide the map');
            }
            else {
                myMap.destroy();// Destructor of the map
                myMap = null;
                $("#toggle").attr('value', 'Show the map again');
            }
        }
    });
}
