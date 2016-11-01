ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то ничего не будем делать.
        return;
    }
    // Создаем объект, содержащий данные панорамы.
    // Панорама имеет неполный угол обзора по вертикали.
    var panoData = {
            angularBBox: [0.35, 8 * Math.PI/3, -0.61, 2 * Math.PI/3],
            position: [0, 0, 0],
            tileSize: [512, 512],
            tileLevels: [{
                // URL тайлов для высокого уровня детализации.
                getTileUrl: function (x, y) {
                    return 'tiles/hq/' + x + '-' + y + '.jpg';
                },
                // Размер изображения для высокого уровня детализации.
                getImageSize: function () {
                    return [10752, 1658];
                }
            }, {
                // URL тайлов для низкого уровня детализации.
                getTileUrl: function (x, y) {
                    return 'tiles/lq/' + x + '-' + y + '.jpg';
                },
                // Размер изображения для низкого уровня детализации.
                getImageSize: function () {
                    return [1024, 158];
                }
            }]
        },

        // Создаем объект, в котором будет храниться
        // информация о маркере.
        markerData = {
            src: {
                'default': 'images/marker-default.png',
                hovered: 'images/marker-hovered.png'
            },
            position: [-2, -0.8, 0.2]
        };

    // Функция возвращает Promise-объект, который будет разрешен
    // объектом HTMLImageElement.
    function loadImage(src) {
        return new ymaps.vow.Promise(function (resolve) {
            var image = new Image();
            image.onload = function () {
                resolve(image);
            };
            image.crossOrigin = 'anonymous';
            image.src = src;
        });
    }

    // Функция, которая рисует маркер с помощью Canvas.
    function renderImage(text) {
        var ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = 128;
        ctx.canvas.height = 32;
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 128, 32);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 16);
        return ctx.canvas;
    }

    // Класс маркера.
    function Marker(img, panorama) {
        // В классе должно быть определено поле properties.
        this.properties = new ymaps.data.Manager();
        this._panorama = panorama;
        this._position = img.position;
        this._imgSrc = img.src;
    }

    // Определяем в классе Marker нужные методы.
    ymaps.util.defineClass(Marker, {
        getIconSet: function () {
            return ymaps.vow.Promise.all([
                loadImage(this._imgSrc.default),
                loadImage(this._imgSrc.hovered)
            ]).spread(function (defaultImage, hoveredImage) {
                return {
                    'default': {
                        image: defaultImage,
                        offset: [0, 0]
                    },
                    hovered: {
                        image: hoveredImage,
                        offset: [0, 0]
                    },
                    expanded: {
                        image: renderImage("Книги по JavaScript"),
                        offset: [0, -10]
                    }
                };
            });
        },
        getPanorama: function () {
            return this._panorama;
        },
        getPosition: function () {
            return this._position;
        }
    });

    // Объявляем класс панорамы.
    function MyPanorama(angularBBox, position, tileSize, tileLevels) {
        // Вызываем конструктор родительского класса.
        ymaps.panorama.Base.call(this);
        this._angularBBox = angularBBox;
        this._position = position;
        this._tileSize = tileSize;
        this._tileLevels = tileLevels;

    }

    ymaps.util.defineClass(MyPanorama, ymaps.panorama.Base, {
        // Переопределяем метод getMarkers.
        getMarkers: function () {
            return [new Marker(markerData, this)];
        },
        getAngularBBox: function () {
            return this._angularBBox;
        },
        getPosition: function () {
            return this._position;
        },
        getTileSize: function () {
            return this._tileSize;
        },
        getTileLevels: function () {
            return this._tileLevels;
        },
        getCoordSystem: function () {
            return ymaps.coordSystem.cartesian;
        }
    });

    var panorama = new MyPanorama(panoData.angularBBox, panoData.position, panoData.tileSize, panoData.tileLevels);

    // Отображаем панораму на странице.
    var player = new ymaps.panorama.Player('player', panorama, {
        direction: [240, 0],
        span: [50, 50]
    });
})
