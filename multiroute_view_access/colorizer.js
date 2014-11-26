// Класс, раскрашивающий сегменты маршрута в различные
// цвета в зависимости от типа сегмента и типа транспорта.
function Colorizer (multiRoute) {
    this.multiRoute = multiRoute;

    // Подписываемся на события обновления мультимаршрута
    // и смены активного маршрута.
    multiRoute.events
        .add("update", this.onMultiRouteUpdate, this)
        .add("activeroutechange", this.onActiveRouteChange, this);

    // Берем текущий активный маршрут и раскрашиваем его.
    this.activeRoute = multiRoute.getActiveRoute();
    this.colorize();
}

// Пресет внешнего вида для сегментов электричек.
Colorizer.suburbanPreset = {
    strokeWidth: 6,
    strokeColor: "#000000",
    strokeStyle: "shortDash"
};

// Пресет внешнего вида для сегментов автобусов, троллейбусов и трамваев.
Colorizer.busPreset = {
    strokeWidth: 6,
    strokeColor: "#0085FA",
    strokeStyle: "shortDash"
};

// Пресет внешнего вида для пеших сегментов.
Colorizer.walkPreset = {
    strokeWidth: 2,
    strokeColor: "#333333",
    strokeStyle: "solid"
};

Colorizer.prototype = {
    // Обработчик смены активного маршрута.
    onActiveRouteChange: function () {
        // Снимаем раскраску с предыдущего активного маршрута, иначе он
        // останется раскрашенным в неактивном состоянии.
        this.uncolorize();
        // Запоминаем новый активный маршрут и раскрашиваем его.
        this.activeRoute = this.multiRoute.getActiveRoute();
        this.colorize();

        if (this.activeRoute) {
            // Применяем к карте границы активного маршрута.
            this.multiRoute.getMap().setBounds(this.activeRoute.getBounds());
        }
    },

    onMultiRouteUpdate: function () {
        // При обновлении маршрута выполняем раскрашивание заново.
        this.colorize();
    },

    colorize: function () {
        // Если есть активный маршрут, перебираем все пути маршрута.
        // Для каждого пути перебираем все сегменты и устанавливаем
        // каждому из них параметры внешнего вида в зависимости от типа сегмента.
        if (this.activeRoute) {
            this.activeRoute.getPaths().each(function (path) {
                path.getSegments().each(function (segment) {
                    var segmentType = segment.properties.get("type");
                    if (segmentType == "transport") {
                        this.colorizeTransportSegment(segment);
                    } else {
                        // Сюда попадут сегменты с типами "walk" (пешеходный)
                        // и "transfer" (переход между станциями).
                        segment.options.set({ preset: Colorizer.walkPreset });
                    }
                }, this)
            }, this);
        }
    },

    uncolorize: function () {
        if (this.activeRoute) {
            // Перебираем все сегменты и для каждого из них удаляем настройки внешнего вида.
            this.activeRoute.getPaths().each(function (path) {
                path.getSegments().each(function (segment) {
                    segment.options.unset("preset")
                }, this)
            }, this);
        }
    },

    destroy: function () {
        this.uncolorize();
        this.multiRoute.events
            .remove("update", this.onMultiRouteUpdate, this)
            .remove("activeroutechange", this.onActiveRouteChange, this);
    },

    // Метод, раскрашивающий транспортные сегменты.
    colorizeTransportSegment: function (segment) {
        // Берем первую запись о транспорте из массива транспортных средств сегмента
        // и на ее основе раскрашиваем сегмент.
        // Как правило для одного сегмента тип возможных транспортных средств не
        // отличается радикально.
        // Т.е. не бывает сегментов, по которым можно проехать как на метро, так и на автобусе.
        // Различие же между автобусом и маршрутным такси в нашем случае неважно.
        var transport = segment.properties.get("transports")[0];
        if (transport.type == "suburban") {
            segment.options.set({ preset: Colorizer.suburbanPreset });
        } else if (transport.type == "underground") {
            segment.options.set({
                preset: {
                    strokeWidth: 6,
                    // Цвет линии метро берем из данных сегмента.
                    strokeColor: transport.Style.color
                }
            });
        } else {
            segment.options.set({ preset: Colorizer.busPreset });
        }
    }
};
