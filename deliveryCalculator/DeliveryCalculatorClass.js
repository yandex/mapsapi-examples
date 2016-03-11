ymaps.modules.define(
    'DeliveryCalculator',
    ['util.defineClass'],
    function (provide, defineClass) {
        /**
         * @class DeliveryCalculator Расчет стоимости доставки.
         * @param {Object} map    Экземпляр карты.
         */
        function DeliveryCalculator (map) {
            this._map = map;
            this._start = null;
            this._route = null;
            this._startBalloon;
            this._finishBalloon;

            map.events.add('click', this._onClick, this);
        }

        defineClass(DeliveryCalculator, {
            /**
             * Прокладываем маршрут через заданные точки
             * и проводим расчет доставки.
             */
            getDirection: function () {
                // Удаляем предыдущий маршрут с карты.
                if (this._route) {
                    this._map.geoObjects.remove(this._route);
                }

                if (this._start && this._finish) {
                    var start = this._start.geometry.getCoordinates(),
                        finish = this._finish.geometry.getCoordinates(),
                        startBalloon = this._startBalloon,
                        finishBalloon = this._finishBalloon;

                    // Прокладываем маршрут через заданные точки.
                    ymaps.route([start, finish])
                        .then(function (router) {
                            var distance = Math.round(router.getLength() / 1000),
                                message = '<span>Расстояние: ' + distance + 'км.</span><br/>' +
                                    '<span style="font-weight: bold; font-style: italic">Стоимость доставки: %sр.</span>';

                            this._route = router.getPaths(); // Получаем коллекцию путей, из которых состоит маршрут.

                            this._route.options.set({ strokeWidth: 5, strokeColor: '0000ffff', opacity: 0.5 });
                            this._map.geoObjects.add(this._route); // Добавляем маршрут на карту.
                            // Задаем контент балуна для начального и конечного маркера.
                            this._start.properties.set('balloonContentBody', startBalloon + message.replace('%s', this.calculate(distance)));
                            this._finish.properties.set('balloonContentBody', finishBalloon + message.replace('%s', this.calculate(distance)));

                            // Открываем балун над точкой доставки.
                            // Закомментируйте, если не хотите показывать балун автоматически.
                            this._finish.balloon.open();
                        }, this);

                    this._map.setBounds(this._map.geoObjects.getBounds());
                }
            },

            /**
             * Создаем начальную точку маршрута.
             * Если точка создана, то обновляем координаты.
             * @param {Number[]} position Координаты точки.
             */
            setStartPoint: function (position) {
                if (this._start) {
                    this._start.geometry.setCoordinates(position);
                } else {
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
             * @param {Number[]} position Координаты точки.
             */
            setFinishPoint: function (position) {
                if (this._finish) {
                    this._finish.geometry.setCoordinates(position);
                } else {
                    this._finish = new ymaps.Placemark(position, { iconContent: 'Б' }, { draggable: true });
                    this._finish.events.add('dragend', this._onFinishDragEnd, this);
                    this._map.geoObjects.add(this._finish);
                }
                if (this._start) {
                    this.geocode("finish", position);
                }
            },

            /**
             * Проводим обратное геокодирование (определяем адрес по координатам) для точек маршрута.
             * @param {String} str Тип точки: 'start' - начальная, 'finish' - конечная.
             * @param {Number[]} point Координаты точки.
             */
            geocode: function (str, point) {
                ymaps.geocode(point).then(function (result) {
                    // result содержит описание найденных геообъектов.
                    if (str == "start") {
                        // Получаем описание первого геообъекта в списке, чтобы затем показать
                        // с описанием доставки по клику на метке.
                        this._startBalloon = result.geoObjects.get(0) &&
                            result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                    } else {
                        // То же самое для конечной точки
                        this._finishBalloon = result.geoObjects.get(0) &&
                            result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                    }
                    this.getDirection();
                }, this);

            },

            /**
             *
             * @param  {Number} routeLength Длина маршрута в километрах.
             * @return {Number} Стоимость доставки.
             */
            calculate: function (routeLength) {
                // Константы.
                var DELIVERY_TARIF = 20, // Стоимость за километр.
                    MINIMUM_COST = 500; // Минимальная стоимость.

                return Math.max(routeLength * DELIVERY_TARIF, MINIMUM_COST);
            },

            /**
             * Обработчик клика по карте. Получаем координаты точки на карты и создаем маркер.
             * @param  {Object} event Событие.
             */
            _onClick: function (event) {
                if (this._start) {
                    this.setFinishPoint(event.get('coords'));
                } else {
                    this.setStartPoint(event.get('coords'));
                }
            },

            /**
             * Получаем координаты маркера и вызываем геокодер для начальной точки.
             */
            _onStartDragEnd: function () {
                var coords = this._start.geometry.getCoordinates();
                this.geocode("start", coords);
            },

            _onFinishDragEnd: function () {
                var coords = this._finish.geometry.getCoordinates();
                this.geocode("finish", coords);
            }
        });

        provide(DeliveryCalculator);
    }
);