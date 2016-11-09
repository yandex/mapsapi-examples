ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то просто ничего не будем делать.
        return;
    }

    var myMap = new ymaps.Map('map', {
            center: [59.938557, 30.316198],
            zoom: 10,
            controls: []
        }),

        // Создание макета содержимого балуна.
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            // Будем динамически задавать размеры контейнера в зависимости от того,
            // будет ли найдена панорама для текущей точки или нет.
            '<div id="panorama" style="width:{{state.size.width}};height:{{state.size.height}}"/>', {
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // Добавляем плеер панорам в содержимое балуна.
                    this._createPanoramaPlayer();
                },
                // При закрытии балуна будем удалять плеер панорам.
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Создание плеера панорам.
                _createPanoramaPlayer: function () {
                    // Будем запрашивать данные для текущей панорамы в том случае,
                    // если ранее еще не делали этого.
                    // Это условие необходимо для того, чтобы после перестроения макета
                    // не запрашивать повторно данные для одной и той же панорамы.
                    if (!this._checkedForPanorama) {
                        // Координаты точки, в которой нужно открыть панораму.
                        var coords = this.getData().geometry.getCoordinates(),
                            // Тип панорамы: воздушная или наземная.
                            panoramaType = this.getData().properties.get('panoramaType'),
                            el;
                        ymaps.panorama.locate(coords, {
                            layer: panoramaType
                        }).then(
                            function (panoramas) {
                                // Выставляем флаг, что мы уже сделали запрос за данной панорамой.
                                this._checkedForPanorama = true;
                                if (panoramas.length) {
                                    // Задаем размеры контейнера, в котором будет размещаться наша панорама.
                                    // Обратите внимание, что после этого макет балуна
                                    // будет перестроен.
                                    this._setPanoramaContainerSize("300px", "200px");
                                    // Получаем контейнер с новыми размерами.
                                    el = this.getParentElement().querySelector('#panorama');
                                    // Добавляем плеер панорам в контейнер.
                                    this._panoramaPlayer = new ymaps.panorama.Player(el, panoramas[0], {
                                        controls: ['panoramaName']
                                    });
                                } else {
                                    // Если панорама не была найдена, то задаем меньший размер
                                    // для контейнера и отображаем в нем простой текст.
                                    this._setPanoramaContainerSize("100px", "50px");
                                    el = this.getParentElement().querySelector('#panorama');
                                    el.innerHTML = "Для данной точки панорамы нет.";
                                }
                            },
                            function (err) {
                                // Если при попытке получить панораму возникла ошибка,
                                // отобразим сообщение об ошибке в балуне.
                                this._checkedForPanorama = true;
                                this._setPanoramaContainerSize("300px", "100px");
                                el = this.getParentElement().querySelector('#panorama');
                                el.innerHTML = err.toString();
                            },
                            this
                        );
                    }
                },
                // Удаление плеера панорам.
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                        this._checkedForPanorama = false;
                    }
                },
                // Задание размеров контейнера с панорамой.
                _setPanoramaContainerSize: function (width, height) {
                    this.getData().state.set({
                        size: {
                            width: width,
                            height: height
                        }
                    });
                }
            }
        ),

        myPlacemark1 = new ymaps.Placemark([59.938557, 30.316198], {
            // Для данной метки нужно будет открыть воздушную панораму.
            panoramaType: 'yandex#airPanorama'
        }, {
            balloonContentLayout: BalloonContentLayout,
            preset: 'islands#redIcon'
        }),
        myPlacemark2 = new ymaps.Placemark([59.900557, 30.44319], {
            // Для этой метки будем запрашивать наземную панораму.
            panoramaType: 'yandex#panorama'
        }, {
            balloonContentLayout: BalloonContentLayout
        });

    myMap.geoObjects.add(myPlacemark1);
    myMap.geoObjects.add(myPlacemark2);
});
