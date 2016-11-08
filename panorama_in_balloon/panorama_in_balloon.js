ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [59.938557, 30.316198],
            zoom: 10,
            controls: []
        }),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), null, {
            draggable: true,
            openEmptyBalloon: true
        });

    // Функция, устанавливающая для метки макет содержимого ее балуна.
    // В качестве аргумента функции передается полученный объект панорамы.
    function setBalloonContentLayout(panorama) {
        // Создаем макет содержимого балуна.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:250px;height:150px"/>', {
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // Добавляем плеер панорам в содержимое балуна.
                    this._openPanorama();
                },

                // При закрытии балуна будем удалять плеер панорам.
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Добавление плеера панорам.
                _openPanorama: function () {
                    if (!this._panoramaPlayer) {
                        // Получаем контейнер, в котором будет размещаться наша панорама.
                        var el = this.getParentElement().querySelector('#panorama');
                        this._panoramaPlayer = new ymaps.panorama.Player(el, panorama, {
                            controls: ['panoramaName']
                        });
                    }
                },
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            }
        );
        // Устанавливаем созданный макет содержимого балуна в опции метки.
        myPlacemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    // Слушаем на метке событие 'balloonopen': как только балун будет открыт,
    // выполняем проверку на наличие панорам в данной точке.
    // Если панорама нашлась, то устанавливаем для балуна макет с этой панорамой,
    // в противном случае задаем для балуна простое текстовое содержимое.
    myPlacemark.events.add('balloonopen', function (e) {
        // Для начала проверим, поддерживает ли браузер пользователя плеер панорам.
        if (!ymaps.panorama.isSupported()) {
            myPlacemark.properties.set('balloonContent', "Плеер панорам не поддерживается данным браузером.");
        } else {
            // Получаем географические координаты точки, для которой будем запрашивать панораму.
            var coords = e.get('target').geometry.getCoordinates();

            myPlacemark.properties.set('balloonContent', "Идет проверка на наличие панорамы...");

            // Запрашиваем объект панорамы.
            setTimeout(function () {
                ymaps.panorama.locate(coords, {
                    layer: 'yandex#airPanorama'
                }).then(
                    function (panoramas) {
                        if (panoramas.length) {
                            // Устанавливаем для балуна макет, содержащий найденную панораму.
                            setBalloonContentLayout(panoramas[0]);
                        } else {
                            // Если панорам не нашлось, задаем
                            // в содержимом балуна простой текст.
                            myPlacemark.properties.set('balloonContent', "Для данной точки воздушной панорамы нет.");
                        }
                    },
                    function (err) {
                        myPlacemark.properties.set('balloonContent',
                            "При попытке открыть панораму произошла ошибка: " + err.toString());
                    });
            }, 1200);
        }
    });

    // Слушаем на метке событие 'geometrychange':
    // если координаты метки изменились (например, при драге),
    // удаляем макет балуна и его текстовое содержимое.
    myPlacemark.events.add('geometrychange', function () {
        myPlacemark.properties.unset('balloonContent');
        myPlacemark.options.unset('balloonContentLayout');
    });

    myMap.geoObjects.add(myPlacemark);

});
