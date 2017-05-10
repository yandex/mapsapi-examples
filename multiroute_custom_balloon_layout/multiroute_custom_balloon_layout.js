function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.752625, 37.59810],
            zoom: 14,
            controls: []
        }),
        /**
         * Creating your own layout using the layout factory.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/templateLayoutFactory.xml
          */
        balloonLayout = ymaps.templateLayoutFactory.createClass(
                "<div class='my-balloon'>" +
                "<u>Route {% if properties.type == 'driving' %}" +
                "Driving<br/>" +
                "{% else %}" +
                "Public transit" +
                "{% endif %}</u><br />" +
                "Distance: " +
                "<i>{{ properties.distance.text }}</i>,<br />" +
                "Travel time: " +
                "<i>{{ properties.duration.text }} (without traffic) </i>." +
                "</div>"
        ),
        /**
         * Creating a multiroute.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
          */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                "Arbatskaya metro station",
                "Smolenskaya metro station"
            ]
            params: {
                /**
                 * avoidTrafficJams: true,
                 * routingMode: 'masstransit'
                 */
            }
        }, {
            /**
             * Geo object layout.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml#param-options
              */
            balloonLayout: balloonLayout,
            // Disabling the panel mode for the balloon.
            balloonPanelMaxMapArea: 0
        });

    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
