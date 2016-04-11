ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то ничего не будем делать.
        return;
    }

    // Сначала описываем уровни масштабирования панорамного изображения.
    // Для этого заводим класс, реализующий интерфейс IPanoramaTileLevel.
    // Параметрами конструктора будут шаблон URL тайлов и размер уровня.
    function TileLevel (urlTemplate, imageSize) {
        this._urlTemplate = urlTemplate;
        this._imageSize = imageSize;
    }

    ymaps.util.defineClass(TileLevel, {
        getTileUrl: function (x, y) {
            // Определяем URL тайла для переданных индексов.
            return this._urlTemplate.replace('%c', y + '-' + x);
        },

        getImageSize: function () {
            return this._imageSize;
        }
    });

    // Теперь описываем панораму.
    function Panorama () {
        ymaps.panorama.Base.call(this);
        // Наша панорама будет содержать два уровня масштабирования
        // панорамного изображения: низкого и высокого качества.
        this._tileLevels = [
            new TileLevel('tiles/lq/%c.jpg', [512, 256]),
            new TileLevel('tiles/hq/%c.jpg', [7168, 3584])
        ];
    }

    // Наследуем класс панорамы от ymaps.panorama.Base, который частично
    // реализует IPanoramaTileLevel за нас.
    ymaps.util.defineClass(Panorama, ymaps.panorama.Base, {
        getPosition: function () {
            // Панорама будет располагаться в начале координат...
            return [0, 0, 0];
        },

        getCoordSystem: function () {
            // ...декартовой системы.
            return ymaps.coordSystem.cartesian;
        },

        getAngularBBox: function () {
            // Область, которую занимает панорама на панорамной сфере.
            // В нашем случае это будет вся сфера.
            return [
                0.5 * Math.PI,
                2 * Math.PI,
                -0.5 * Math.PI,
                0
            ];
        },

        getTileSize: function () {
            // Размер тайлов, на которые нарезано изображение.
            return [512, 512];
        },

        getTileLevels: function () {
            return this._tileLevels;
        }
    });

    // Теперь создаем плеер с экземпляром нашей панорамы.
    var player = new ymaps.panorama.Player('player', new Panorama());
});
