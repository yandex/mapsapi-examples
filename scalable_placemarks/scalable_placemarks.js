var createChipsLayout = function (templateLayoutFactory, calculateSize) {
    // Получим фигуру активной области "Круг".
    var getPixelCircle = function (diameter) {
        var radius = diameter / 2;
        return {type: 'Circle', coordinates: [0, 0], radius: radius};
    };
    // Зададим размер метки.
    var setSize = function (element, zoom, layout) {
        var options = layout.getData().options,
        // Получим размер метки в зависимости от уровня зума.
            size = calculateSize(zoom);
        // Зададим высоту и ширину метки.
        element.style.width = element.style.height = size + 'px';
        // Зададим смещение.
        element.style.marginLeft = element.style.marginTop = -size / 2 + 'px';
        // Зададим фигуру активной области.
        options.set('shape', getPixelCircle(size));
    };

    var init = function (map, layout) {
        // Получим текущий уровень зума.
        var zoom = map.getZoom();
        // Подпишемся на событие "Окончание плавного движения карты".
        map.events.add('actionend', function () {
            // Запустим перестраивание макета при изменении уровня зума.
            var currentZoom = map.getZoom();
            if (currentZoom != zoom) {
                zoom = currentZoom;
                layout.rebuild();
            }
        });
    };
    // Создадим макет метки.
    var Chips = templateLayoutFactory.createClass(
        '<div class="placemark"></div>',
        {
            build: function () {
                Chips.superclass.build.call(this);
                var map = this.getData().geoObject.getMap();
                if (!this.inited) {
                    this.inited = true;
                    init(map, this);
                }
                setSize(this.getParentElement(), map.getZoom(), this);
            },
            clear: function () {
                Chips.superclass.clear.call(this);
            },
            rebuild: function () {
                Chips.superclass.rebuild.call(this);
            }
        },
        {}
    );

    return Chips;
};

ymaps.ready(function () {
    var map = new ymaps.Map('map', {
        center: [55.755249, 37.617437],
        zoom: 4
    });

    map.geoObjects.add(new ymaps.Placemark([55.755249, 36.317437], {
        balloonContent: 'Линейная зависимость размера метки от уровня зума',
        hintContent: 'Линейная зависимость'
    }, {
        iconLayout: createChipsLayout(ymaps.templateLayoutFactory, function (zoom) {
            // Минимальный размер метки будет 8px, а максимальный мы ограничивать не будем.
            // Размер метки будет расти с линейной зависимостью от уровня зума.
            return 4 * zoom + 8;
        })
    }));

    map.geoObjects.add(new ymaps.Placemark([55.755249, 37.617437], {
        balloonContent: 'Квадратичная зависимость размера метки от уровня зума',
        hintContent: 'Квадратичная зависимость'
    }, {
        iconLayout: createChipsLayout(ymaps.templateLayoutFactory, function (zoom) {
            // Минимальный размер метки будет 8px, а максимальный 200px.
            // Размер метки будет расти с квадратичной зависимостью от уровня зума.
            return Math.min(Math.pow(zoom, 2) + 8, 200);
        })
    }));
});