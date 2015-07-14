var myMap;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map('map', {
        // St. Petersburg
        center: [59.93772, 30.313622],
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    myMap.behaviors
        // Disabling some of the behaviors enabled by default:
  - drag - moving the map while holding down the left mouse button;
  - magnifier.rightButton - zooming in on the area selected with the right mouse button.
        .disable(['drag', 'rightMouseButtonMagnifier'])
        // Enabling the ruler.
        .enable('ruler');

    // Using options to change the property of a behavior: zooming with the scroll wheel will be
    // slow, 1/2 zoom level per second.
    myMap.options.set('scrollZoomSpeed', 0.5);
}
