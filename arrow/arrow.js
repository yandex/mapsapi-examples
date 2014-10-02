ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.733835, 37.588227],
        zoom: 5
    });
    // Пользовательские модули не дописываются в неймспейс ymaps.
    // Поэтому доступ к ним мы можем получить асинхронно через метод ymaps.modules.require.
    ymaps.modules.require(['geoObject.Arrow'], function (Arrow) {
        var arrow = new Arrow([[57.733835, 38.788227], [55.833835, 35.688227]], null, {
            geodesic: true,
            strokeWidth: 5,
            opacity: 0.5,
            strokeStyle: 'shortdash'
        });
        myMap.geoObjects.add(arrow);
    });
});

/*
 * Класс, позволяющий создавать стрелку на карте.
 * Является хелпером к созданию полилинии, у которой задан специальный оверлей.
 * При использовании модулей в реальном проекте рекомендуем размещать их в отдельных файлах.
 */
ymaps.modules.define("geoObject.Arrow", [
    'Polyline',
    'overlay.Arrow',
    'util.extend'
], function (provide, Polyline, ArrowOverlay, extend) {
    /**
     * @param {Number[][] | Object | ILineStringGeometry} geometry Геометрия ломаной.
     * @param {Object} properties Данные ломаной.
     * @param {Object} options Опции ломаной.
     * Поддерживается тот же набор опций, что и в классе ymaps.Polyline.
     * @param {Number} [options.arrowAngle=20] Угол в градусах между основной линией и линиями стрелки.
     * @param {Number} [options.arrowMinLength=3] Минимальная длина стрелки. Если длина стрелки меньше минимального значения, стрелка не рисуется.
     * @param {Number} [options.arrowMaxLength=20] Максимальная длина стрелки.
     */
    var Arrow = function (geometry, properties, options) {
        return new Polyline(geometry, properties, extend({}, options, {
            lineStringOverlay: ArrowOverlay
        }));
    };
    provide(Arrow);
});

/*
 * Класс, реализующий интерфейс IOverlay.
 * Получает на вход пиксельную геометрию линии и добавляет стрелку на конце линии.
 */
ymaps.modules.define("overlay.Arrow", [
    'overlay.Polygon',
    'util.extend',
    'event.Manager',
    'option.Manager',
    'Event',
    'geometry.pixel.Polygon'
], function (provide, PolygonOverlay, extend, EventManager, OptionManager, Event, PolygonGeometry) {
    var domEvents = [
            'click',
            'contextmenu',
            'dblclick',
            'mousedown',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseup',
            'multitouchend',
            'multitouchmove',
            'multitouchstart',
            'wheel'
        ],

        /**
         * @param {geometry.pixel.Polyline} pixelGeometry Пиксельная геометрия линии.
         * @param {Object} data Данные оверлея.
         * @param {Object} options Опции оверлея.
         */
        ArrowOverlay = function (pixelGeometry, data, options) {
            // Поля .events и .options обязательные для IOverlay.
            this.events = new EventManager();
            this.options = new OptionManager(options);
            this._map = null;
            this._data = data;
            this._geometry = pixelGeometry;
            this._overlay = null;
        };

    ArrowOverlay.prototype = extend(ArrowOverlay.prototype, {
        // Реализовываем все методы и события, которые требует интерфейс IOverlay.
        getData: function () {
            return this._data;
        },

        setData: function (data) {
            if (this._data != data) {
                var oldData = this._data;
                this._data = data;
                this.events.fire('datachange', {
                    oldData: oldData,
                    newData: data
                });
            }
        },

        getMap: function () {
            return this._map;
        },

        setMap: function (map) {
            if (this._map != map) {
                var oldMap = this._map;
                if (!map) {
                    this._onRemoveFromMap();
                }
                this._map = map;
                if (map) {
                    this._onAddToMap();
                }
                this.events.fire('mapchange', {
                    oldMap: oldMap,
                    newMap: map
                });
            }
        },

        setGeometry: function (geometry) {
            if (this._geometry != geometry) {
                var oldGeometry = geometry;
                this._geometry = geometry;
                if (this.getMap() && geometry) {
                    this._rebuild();
                }
                this.events.fire('geometrychange', {
                    oldGeometry: oldGeometry,
                    newGeometry: geometry
                });
            }
        },

        getGeometry: function () {
            return this._geometry;
        },

        getShape: function () {
            return null;
        },

        isEmpty: function () {
            return false;
        },

        _rebuild: function () {
            this._onRemoveFromMap();
            this._onAddToMap();
        },

        _onAddToMap: function () {
            // Военная хитрость - чтобы в прозрачной ломаной хорошо отрисовывались самопересечения,
            // мы рисуем вместо линии многоугольник.
            // Каждый контур многоугольника будет отвечать за часть линии.
            this._overlay = new PolygonOverlay(new PolygonGeometry(this._createArrowContours()));
            this._startOverlayListening();
            // Эта строчка свяжет два менеджера опций.
            // Опции, заданные в родительском менеджере,
            // будут распространяться и на дочерний.
            this._overlay.options.setParent(this.options);
            this._overlay.setMap(this.getMap());
        },

        _onRemoveFromMap: function () {
            this._overlay.setMap(null);
            this._overlay.options.setParent(null);
            this._stopOverlayListening();
        },

        _startOverlayListening: function () {
            this._overlay.events.add(domEvents, this._onDomEvent, this);
        },

        _stopOverlayListening: function () {
            this._overlay.events.remove(domEvents, this._onDomEvent, this);
        },

        _onDomEvent: function (e) {
            // Мы слушаем события от дочернего служебного оверлея
            // и прокидываем их на внешнем классе.
            // Это делается для того, чтобы в событии было корректно определено
            // поле target.
            this.events.fire(e.get('type'), new Event({
                target: this
            // Свяжем исходное событие с текущим, чтобы все поля данных дочернего события
            // были доступны в производном событии.
            }, e));
        },

        _createArrowContours: function () {
            var contours = [],
                mainLineCoordinates = this.getGeometry().getCoordinates(),
                arrowLength = calculateArrowLength(
                    mainLineCoordinates,
                    this.options.get('arrowMinLength', 3),
                    this.options.get('arrowMaxLength', 20)
                );
            contours.push(getContourFromLineCoordinates(mainLineCoordinates));
            // Будем рисовать стрелку только если длина линии не меньше длины стрелки.
            if (arrowLength > 0) {
                // Создадим еще 2 контура для стрелочек.
                var lastTwoCoordinates = [
                        mainLineCoordinates[mainLineCoordinates.length - 2],
                        mainLineCoordinates[mainLineCoordinates.length - 1]
                    ],
                // Для удобства расчетов повернем стрелку так, чтобы она была направлена вдоль оси y,
                // а потом развернем результаты обратно.
                    rotationAngle = getRotationAngle(lastTwoCoordinates[0], lastTwoCoordinates[1]),
                    rotatedCoordinates = rotate(lastTwoCoordinates, rotationAngle),

                    arrowAngle = this.options.get('arrowAngle', 20) / 180 * Math.PI,
                    arrowBeginningCoordinates = getArrowsBeginningCoordinates(
                        rotatedCoordinates,
                        arrowLength,
                        arrowAngle
                    ),
                    firstArrowCoordinates = rotate([
                        arrowBeginningCoordinates[0],
                        rotatedCoordinates[1]
                    ], -rotationAngle),
                    secondArrowCoordinates = rotate([
                        arrowBeginningCoordinates[1],
                        rotatedCoordinates[1]
                    ], -rotationAngle);

                contours.push(getContourFromLineCoordinates(firstArrowCoordinates));
                contours.push(getContourFromLineCoordinates(secondArrowCoordinates));
            }
            return contours;
        }
    });

    function getArrowsBeginningCoordinates (coordinates, arrowLength, arrowAngle) {
        var p1 = coordinates[0],
            p2 = coordinates[1],
            dx = arrowLength * Math.sin(arrowAngle),
            y = p2[1] - arrowLength * Math.cos(arrowAngle);
        return [[p1[0] - dx, y], [p1[0] + dx, y]];
    }

    function rotate (coordinates, angle) {
        var rotatedCoordinates = [];
        for (var i = 0, l = coordinates.length, x, y; i < l; i++) {
            x = coordinates[i][0];
            y = coordinates[i][1];
            rotatedCoordinates.push([
                x * Math.cos(angle) - y * Math.sin(angle),
                x * Math.sin(angle) + y * Math.cos(angle)
            ]);
        }
        return rotatedCoordinates;
    }

    function getRotationAngle (p1, p2) {
        return Math.PI / 2 - Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    }

    function getContourFromLineCoordinates (coords) {
        var contour = coords.slice();
        for (var i = coords.length - 2; i > -1; i--) {
            contour.push(coords[i]);
        }
        return contour;
    }

    function calculateArrowLength (coords, minLength, maxLength) {
        var linePixelLength = 0;
        for (var i = 1, l = coords.length; i < l; i++) {
            linePixelLength += getVectorLength(
                coords[i][0] - coords[i - 1][0],
                coords[i][1] - coords[i - 1][1]
            );
            if (linePixelLength / 3 > maxLength) {
                return maxLength;
            }
        }
        var finalArrowLength = linePixelLength / 3;
        return finalArrowLength < minLength ? 0 : finalArrowLength;
    }

    function getVectorLength (x, y) {
        return Math.sqrt(x * x + y * y);
    }

    provide(ArrowOverlay);
});
