function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.752625, 37.59810],
            zoom: 14,
            controls: []
        }),
        /**
         * Создание собственного макета с помощью фабрики макетов.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/templateLayoutFactory.xml
         */
        balloonLayout = ymaps.templateLayoutFactory.createClass(
            "<div class='my-balloon'>" +
            '<a class="close" href="#">&times;</a>' +
            "<b>Маршрут {% if properties.type == 'driving' %}" +
            "на автомобиле<br/>" +
            "{% else %}" +
            "на общественном транспорте" +
            "{% endif %}</b><br />" +
            "Расстояние: " +
            "<i>{{ properties.distance.text }}</i>,<br />" +
            "Время в пути: " +
            "<i>{{ properties.duration.text }} (без учета пробок) </i>" +
            "</div>", {

                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.my-balloon', this.getParentElement());
                    this._$element.find('.close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },

                onCloseClick: function (e) {
                    e.preventDefault();
                    this.events.fire('userclose');
                }
            }
        ),
        /**
         * Создание мультимаршрута.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                "метро Арбатская",
                "метро Смоленская"
            ],
            params: {
                // avoidTrafficJams: true,
                //routingMode: 'masstransit'
            }
        }, {
            /**
             * Макет геообъекта.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml#param-options
             */
            balloonLayout: balloonLayout,
            // Отключаем режим панели для балуна.
            balloonPanelMaxMapArea: 0
        });

    myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);
