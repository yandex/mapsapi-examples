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
            this._startPoint = null;
            this._route = null;
            this._startPointBalloonContent;
            this._finishPointBalloonContent;

            map.events.add('click', this._onClick, this);
        }

        defineClass(DeliveryCalculator, {
            /**
             * Создаем начальную точку маршрута.
             * Если точка создана, то обновляем координаты.
             * @param {Number[]} position Координаты точки.
             */
            setStartPoint: function (position) {
                if (this._startPoint) {
                    this._startPoint.geometry.setCoordinates(position);
                } else {
                    // Создаем маркер с возможностью перетаскивания (опция `draggable`).
                    // По завершении перетаскивания вызываем обработчик `_onStartDragEnd`.
                    this._startPoint = new ymaps.Placemark(position, {iconContent: 'А'}, {draggable: true});
                    this._startPoint.events.add('dragend', this._onStartDragEnd, this);
                    this._map.geoObjects.add(this._startPoint);
                }
                this.geocode('start', position);
            },

            /**
             * Создаем конечную точку маршрута.
             * Если точка создана, то обновляем координаты.
             * @param {Number[]} position Координаты точки.
             */
            setFinishPoint: function (position) {
                if (this._finishPoint) {
                    this._finishPoint.geometry.setCoordinates(position);
                } else {
                    this._finishPoint = new ymaps.Placemark(position, { iconContent: 'Б' }, { draggable: true });
                    this._finishPoint.events.add('dragend', this._onFinishDragEnd, this);
                    this._map.geoObjects.add(this._finishPoint);
                }
                if (this._startPoint) {
                    this.geocode('finish', position);
                }
            },

            /**
             * Проводим обратное геокодирование (определяем адрес по координатам) для точек маршрута.
             * @param {String} pointType Тип точки: 'start' - начальная, 'finish' - конечная.
             * @param {Number[]} point Координаты точки.
             */
            geocode: function (pointType, point) {
                ymaps.geocode(point).then(function (result) {
                    // result содержит описание найденных геообъектов.
                    if (pointType == 'start') {
                        // Получаем описание первого геообъекта в списке, чтобы затем показать
                        // с описанием доставки по клику на метке.
                        this._startPointBalloonContent = result.geoObjects.get(0) &&
                            result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                    } else {
                        // То же самое для конечной точки
                        this._finishPointBalloonContent = result.geoObjects.get(0) &&
                            result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                    }
                    this._setupRoute();
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
             * Прокладываем маршрут через заданные точки
             * и проводим расчет доставки.
             */
            _setupRoute: function () {
                // Удаляем предыдущий маршрут с карты.
                if (this._route) {
                    this._map.geoObjects.remove(this._route);
                }

                if (this._startPoint && this._finishPoint) {
                    var start = this._startPoint.geometry.getCoordinates(),
                        finish = this._finishPoint.geometry.getCoordinates(),
                        startBalloon = this._startPointBalloonContent,
                        finishBalloon = this._finishPointBalloonContent;

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
                            this._startPoint.properties.set('balloonContentBody', startBalloon + message.replace('%s', this.calculate(distance)));
                            this._finishPoint.properties.set('balloonContentBody', finishBalloon + message.replace('%s', this.calculate(distance)));

                            // Открываем балун над точкой доставки.
                            // Закомментируйте, если не хотите показывать балун автоматически.
                            this._finishPoint.balloon.open();
                        }, this);

                    this._map.setBounds(this._map.geoObjects.getBounds());
                }
            },

            /**
             * Обработчик клика по карте. Получаем координаты точки на карте и создаем маркер.
             * @param  {Object} event Событие.
             */
            _onClick: function (event) {
                if (this._startPoint) {
                    this.setFinishPoint(event.get('coords'));
                } else {
                    this.setStartPoint(event.get('coords'));
                }
            },

            /**
             * Получаем координаты маркера и вызываем геокодер для начальной точки.
             */
            _onStartDragEnd: function () {
                this.geocode('start', this._startPoint.geometry.getCoordinates());
            },

            _onFinishDragEnd: function () {
                this.geocode('finish', this._finishPoint.geometry.getCoordinates());
            }
        });

        provide(DeliveryCalculator);
    }
);