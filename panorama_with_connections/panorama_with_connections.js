ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то ничего не будем делать.
        return;
    }
    // Создаем объект, содержащий данные трех связанных панорам.
    // Первые две панорамы мы создали сами, а третья панорама - это Яндекс.Панорама.
    // Переход между первыми двумя панорамами зададим через стандартные стрелки,
    // а переход с первой панорамы на Яндекс.Панораму - через маркер-переход.
    var panoData = {
        // Данные первой панорамы.
        firstPano: {
            type: 'custom',
            angularBBox: [Math.PI / 2, 2 * Math.PI + Math.PI / 4, -Math.PI / 2, Math.PI / 4],
            position: [0, 0, 0],
            tileSize: [512, 512],
            tileLevels: [{
                getTileUrl: function (x, y) {
                    return 'tiles/panorama1/hq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [7168, 3584];
                }
            }, {
                getTileUrl: function (x, y) {
                    return 'tiles/panorama1/lq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [512, 256];
                }
            }],
            // Переходы на панораме по стандартной стрелке.
            thoroughfares: [{
                panoID: 'secondPano',
                direction: [-45, 0]
            }],
            // Переходы на панораме через маркеры.
            markerConnections: [{
                panoID: 'thirdPano',
                iconSrc: {
                    'default': 'images/marker-default.jpg',
                    hovered: 'images/marker-hovered.jpg'
                },
                iconPosition: [6, 1.5, 1.3]
            }]
        },
        // Данные второй панорамы.
        secondPano: {
            type: 'custom',
            angularBBox: [Math.PI / 2, 2 * Math.PI, -Math.PI / 2, 0],
            position: [0, 0, 0],
            tileSize: [512, 512],
            tileLevels: [{
                getTileUrl: function (x, y) {
                    return 'tiles/panorama2/hq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [7168, 3584];
                }
            }, {
                getTileUrl: function (x, y) {
                    return 'tiles/panorama2/lq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [512, 256];
                }
            }],
            // Добавим обратный переход на первую панораму.
            thoroughfares: [{
                panoID: 'firstPano',
                direction: [90, 0]
            }, {
                panoID: 'secondPano',
                direction: [45, 0]
            }],
            markerConnections: []
        },
        // Яндекс.Панорама.
        // Информацию о панораме будем получать далее с серверов Яндекса
        // с помощью функции ymaps.panorama.locate.
        thirdPano: {
            type: 'yandex',
            // Координаты точки, в которой нужно открыть Яндекс.Панораму.
            coords: [55.733643, 37.588437]
        }
    };

    // Функция для извлечения данных нужной панорамы из объекта panoData.
    function getConnectedPanoramaData(panoID) {
        return panoData[panoID];
    }
    // Функция, загружающая изображение маркера с сервера.
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

    // Создаем класс, описывающий переход между панорамами по стандартной стрелке.
    function Thoroughfare(currentPanorama, direction, nextPanorama) {
        this.properties = new ymaps.data.Manager();
        this._currentPanorama = currentPanorama;
        this._direction = direction;
        this._connectedPanorama = nextPanorama;
    }

    ymaps.util.defineClass(Thoroughfare, {
        getConnectedPanorama: function () {
            // Если переход будет осуществляться на пользовательскую панораму,
            // то создаем объект панорамы MyPanorama.
            // Если нужно перейти на Яндекс.Панораму, то для получения объекта
            // панорамы воспользуемся функцией ymaps.panorama.locate.
            if (this._connectedPanorama.type == 'custom') {
                return ymaps.vow.resolve(new MyPanorama(this._connectedPanorama));
            } else if (this._connectedPanorama.type == 'yandex') {
                return ymaps.panorama.locate(this._connectedPanorama.coords).then(
                    function(panoramas) {
                        if (panoramas.length) {
                            return panoramas[0];
                        }  else {
                            return ymaps.vow.reject(new Error('Панорама не нашлась.'));
                        }
                    }
                );
            }
        },
        // Направление взгляда на панораму, на которую будет осуществляться переход.
        getDirection: function () {
            return this._direction;
        },
        // Ссылка на текущую панораму, из которой осуществляется переход.
        getPanorama: function () {
            return this._currentPanorama;
        }
    })

    // Создаем класс, описывающий маркер-переход.
    function MarkerConnection(currentPanorama, imgSrc, position, nextPanorama) {
        // В классе должно быть определено поле properties.
        this.properties = new ymaps.data.Manager();
        this._panorama = currentPanorama;
        this._position = position;
        this._imgSrc = imgSrc;
        this._connectedPanorama = nextPanorama;
    }

    ymaps.util.defineClass(MarkerConnection, {
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
                    }
                };
            });
        },
        // Текущая панорама, из которой осуществляется переход.
        getPanorama: function () {
            return this._panorama;
        },
        // Позиция маркера на текущей панораме.
        getPosition: function () {
            return this._position;
        },
        // Чтобы по клику на маркер осуществлялся переход на другую панораму,
        // реализуем метод getConnectedPanorama.
        getConnectedPanorama: function () {
            if (this._connectedPanorama.type == 'custom') {
                return ymaps.vow.resolve(new MyPanorama(this._connectedPanorama));
            } else if (this._connectedPanorama.type == 'yandex') {
                return ymaps.panorama.locate(this._connectedPanorama.coords).then(
                    function(panoramas) {
                        if (panoramas.length) {
                            return panoramas[0];
                        } else {
                            return ymaps.vow.reject(new Error('Панорама не нашлась.'));
                        }
                    }
                );
            }
        }
    });

    // Класс панорамы.
    function MyPanorama(obj) {
        ymaps.panorama.Base.call(this);
        this._angularBBox = obj.angularBBox;
        this._position = obj.position;
        this._tileSize = obj.tileSize;
        this._tileLevels = obj.tileLevels;
        // Получаем массив экземпляров класса, описывающего переход по стрелке из
        // одной панорамы на другую.
        this._thoroughfares = obj.thoroughfares.map(function (thoroughfare) {
            return new Thoroughfare(
                this, // Текущая панорама.
                thoroughfare.direction, // Направление взгляда на панораму, на которую делаем переход.
                getConnectedPanoramaData(thoroughfare.panoID) // Данные панорамы, на которую делаем переход.
            );
        }, this);
        // Получаем массив маркеров-переходов.
        this._connections = obj.markerConnections.map(function (marker) {
            return new MarkerConnection(
                this, // Текущая панорама.
                marker.iconSrc, // Изображение маркера.
                marker.iconPosition, // Позиция маркера.
                getConnectedPanoramaData(marker.panoID) // Данные панорамы, на которую делаем переход.
            );
        }, this);

    }

    ymaps.util.defineClass(MyPanorama, ymaps.panorama.Base, {
        // Чтобы добавить на панораму стандартные стрелки переходов,
        // реализуем метод getThoroughfares.
        getThoroughfares: function () {
            return this._thoroughfares;
        },
        // Чтобы добавить на панораму маркеры-переходы,
        // нужно реализовать метод getConnections.
        getConnections: function () {
            return this._connections;
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

    var panorama = new MyPanorama(panoData.firstPano);

    // Отображаем панораму на странице.
    var player = new ymaps.panorama.Player('player', panorama, {
        direction: [25, 0]
    });
});
