ymaps.ready(function init () {
    var myMap = new ymaps.Map('map', {
            center: [60.906882, 30.067233],
            zoom: 9,
            type: 'yandex#map',
            controls: []
        }),
        searchStartPoint = new ymaps.control.SearchControl({
            options: {
                useMapBounds: true,
                noPlacemark: true,
                noPopup: true,
                placeholderContent: 'Адрес начальной точки',
                size: 'large'
            }
        }),
        searchFinishPoint = new ymaps.control.SearchControl({
            options: {
                useMapBounds: true,
                noCentering: true,
                noPopup: true,
                noPlacemark: true,
                placeholderContent: 'Адрес конечной точки',
                size: 'large',
                float: 'none',
                position: { left: 10, top: 44 }
            }
        }),
        calculator = new DeliveryCalculator(myMap);

    myMap.controls.add(searchStartPoint);
    myMap.controls.add(searchFinishPoint);

    searchStartPoint.events.add('resultselect', function (e) {
        var results = searchStartPoint.getResultsArray(),
            selected = e.get('index'),
            point = results[selected].geometry.getCoordinates();

        // Задаем начало маршрута.
        calculator.setStartPoint(point);
    })
        .add('load', function (event) {
            // По полю skip определяем, что это не дозагрузка данных.
            // По getRusultsCount определяем, что есть хотя бы 1 результат.
            if (!event.get('skip') && searchStartPoint.getResultsCount()) {
                searchStartPoint.showResult(0);
            }
        });

    searchFinishPoint.events.add('resultselect', function (e) {
        var results = searchFinishPoint.getResultsArray(),
            selected = e.get('index'),
            point = results[selected].geometry.getCoordinates();

        // Задаем конец маршрута.
        calculator.setFinishPoint(point);
    })
        .add('load', function (event) {
            // По полю skip определяем, что это не дозагрузка данных.
            // По getRusultsCount определяем, что есть хотя бы 1 результат.
            if (!event.get('skip') && searchFinishPoint.getResultsCount()) {
                searchFinishPoint.showResult(0);
            }
        });
});

/**
 * @class DeliveryCalculator Расчет стоимости доставки
 * @param {Object} map    Экземпляр карты
 */
function DeliveryCalculator (map) {
    this._map = map;
    this._start = null;
    this._route = null;
    this._startBalloon;
    this._finishBalloon;

    map.events.add('click', this._onClick, this);
}

DeliveryCalculator.prototype = {
    /**
     * Прокладываем маршрут через заданные точки
     * и проводим расчет доставки
     */
    getDirection: function () {
        // Удаляем предыдущий маршрут с карты
        if(this._route) {
            this._map.geoObjects.remove(this._route);
        }

        if (this._start && this._finish) {
            var self = this,
                start = this._start.geometry.getCoordinates(),
                finish = this._finish.geometry.getCoordinates(),
                startBalloon = this._startBalloon,
                finishBalloon = this._finishBalloon;

            // Прокладываем маршрут через заданные точки.
            ymaps.route([start, finish])
                .then(function (router) {
                    var distance = Math.round(router.getLength() / 1000),
                        message = '<span>Расстояние: ' + distance + 'км.</span><br/>' +
                            '<span style="font-weight: bold; font-style: italic">Стоимость доставки: %sр.</span>';

                    self._route = router.getPaths(); // Получаем коллекцию путей, из которых состоит маршрут.

                    self._route.options.set({ strokeWidth: 5, strokeColor: '0000ffff', opacity: 0.5 });
                    self._map.geoObjects.add(self._route); // Добавляем маршрут на карту.
                    // Задаем контент балуна для начального и конечного маркера
                    self._start.properties.set('balloonContentBody', startBalloon + message.replace('%s', self.calculate(distance)));
                    self._finish.properties.set('balloonContentBody', finishBalloon + message.replace('%s', self.calculate(distance)));

                    // Открываем балун над точкой доставки.
                    // Закомментируйте, если не хотите показывать балун автоматически.
                    self._finish.balloon.open();
                });

            this._map.setBounds(this._map.geoObjects.getBounds());
        }
    },

    /**
     * Создаем начальную точку маршрута.
     * Если точка создана, то обновляем координаты.
     * @param {Number[]} position Координаты точки
     */
    setStartPoint: function (position) {
        if(this._start) {
            this._start.geometry.setCoordinates(position);
        }
        else {
            // Создаем маркер с возможностью перетаскивания (опция `draggable`).
            // По завершении перетаскивания вызываем обработчик `_onStartDragEnd`.
            this._start = new ymaps.Placemark(position, {iconContent: 'А'}, {draggable: true});
            this._start.events.add('dragend', this._onStartDragEnd, this);
            this._map.geoObjects.add(this._start);
        }
        this.geocode("start", position);
    },

    /**
     * Создаем конечную точку маршрута.
     * Если точка создана, то обновляем координаты.
     * @param {Number[]} position Координаты точки
     */
    setFinishPoint: function (position) {
        if(this._finish) {
            this._finish.geometry.setCoordinates(position);
        }
        else {
            this._finish = new ymaps.Placemark(position, { iconContent: 'Б' }, { draggable: true });
            this._finish.events.add('dragend', this._onFinishDragEnd, this);
            this._map.geoObjects.add(this._finish);
        }
        if (this._start) {
            this.geocode("finish", position);
        }
    },

    /**
     * Проводим обратное геокодирование (определяем адрес по координатам) для точек маршрута
     * @param {String} str Тип точки: 'start' - начальная, 'finish' - конечная
     * @param {Number[]} point Координаты точки
     */
    geocode: function (str, point) {
        ymaps.geocode(point).then(function(result) {
            // result содержит описание найденных геообъектов
            if (str == "start") {
                // получаем описание первого геообъекта в списке, чтобы затем показать
                // с описанием доставки по клику на метке
                this._startBalloon = result.geoObjects.get(0) &&
                    result.geoObjects.get(0).properties.get('balloonContentBody') || '';
            } else {
                // то же самое для конечной точки
                this._finishBalloon = result.geoObjects.get(0) &&
                    result.geoObjects.get(0).properties.get('balloonContentBody') || '';
            }
            this.getDirection();
        }, this);

    },

    /**
     *
     * @param  {Number} routeLength Длина маршрута в километрах
     * @return {Number} Стоимость доставки
     */
    calculate: function (routeLength) {
        // Константы.
        var DELIVERY_TARIF = 20, // стоимость за километр
            MINIMUM_COST = 500; // минимальная стоимость

        return Math.max(routeLength * DELIVERY_TARIF, MINIMUM_COST);
    },

    /**
     * Обработчик клика по карте. Получаем координаты точки на карты и создаем маркер.
     * @param  {Object} event Событие
     */
    _onClick: function (event) {
        if (this._start) {
            this.setFinishPoint(event.get('coords'));
        } else {
            this.setStartPoint(event.get('coords'));
        }
    },

    /**
     * Получаем координаты маркера и вызываем геокодер для начальной точки
     */
    _onStartDragEnd: function () {
        var coords = this._start.geometry.getCoordinates();
        this.geocode("start", coords);
    },

    _onFinishDragEnd: function () {
        var coords = this._finish.geometry.getCoordinates();
        this.geocode("finish", coords);
    }
};

DeliveryCalculator.prototype.constructor = DeliveryCalculator;
