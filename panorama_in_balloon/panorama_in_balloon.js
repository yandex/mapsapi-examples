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

        // При клике на метке будет открываться балун,
        // содержащий Яндекс.Панораму в текущей географической точке.
        myPlacemark1 = new ymaps.Placemark([59.938557, 30.316198], {
            // Для данной метки нужно будет открыть воздушную панораму.
            panoLayer: 'yandex#airPanorama'
        }, {
            preset: 'islands#redIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

        myPlacemark2 = new ymaps.Placemark([59.900557, 30.44319], {
            // Для этой метки будем запрашивать наземную панораму.
            panoLayer: 'yandex#panorama'
        }, {
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        });

    // Функция, устанавливающая для метки макет содержимого ее балуна.
    function setBalloonContentLayout (placemark, panorama) {
        // Создание макета содержимого балуна.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:250px;height:150px"/>', {
                // Переопределяем функцию build, чтобы при формировании макета
                // создавать в нем плеер панорам.
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // Добавляем плеер панорам в содержимое балуна.
                    this._openPanorama();
                },
                // Аналогично переопределяем функцию clear, чтобы удалять
                // плеер панорам при удалении макета с карты.
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
                // Удаление плеера панорамы.
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            });
        // Устанавливаем созданный макет в опции метки.
        placemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    // В этой функции выполняем проверку на наличие панорамы в данной точке.
    // Если панорама нашлась, то устанавливаем для балуна макет с этой панорамой,
    // в противном случае задаем для балуна простое текстовое содержимое.
    function requestForPanorama (e) {
        var placemark = e.get('target'),
            // Координаты точки, для которой будем запрашивать панораму.
            coords = placemark.geometry.getCoordinates(),
            // Тип панорамы (воздушная или наземная).
            panoLayer = placemark.properties.get('panoLayer');

        placemark.properties.set('balloonContent', "Идет проверка на наличие панорамы...");

        // Запрашиваем объект панорамы.
        ymaps.panorama.locate(coords, {
            layer: panoLayer
        }).then(
            function (panoramas) {
                if (panoramas.length) {
                    // Устанавливаем для балуна макет, содержащий найденную панораму.
                    setBalloonContentLayout(placemark, panoramas[0]);
                } else {
                    // Если панорам не нашлось, задаем
                    // в содержимом балуна простой текст.
                    placemark.properties.set('balloonContent', "Для данной точки панорамы нет.");
                }
            },
            function (err) {
                placemark.properties.set('balloonContent',
                    "При попытке открыть панораму произошла ошибка: " + err.toString());
            }
        );
    }

    // Слушаем на метках событие 'balloonopen': как только балун будет впервые открыт,
    // выполняем проверку на наличие панорамы в данной точке и в случае успеха создаем
    // макет с найденной панорамой.
    // Событие открытия балуна будем слушать только один раз.
    myPlacemark1.events.once('balloonopen', requestForPanorama);
    myPlacemark2.events.once('balloonopen', requestForPanorama);

    myMap.geoObjects.add(myPlacemark1);
    myMap.geoObjects.add(myPlacemark2);


    // Если для меток будет включена опция 'draggable', то чтобы при перетаскивании
    // метки в балуне отображалась панорама для новой точки, раскомментируйте код ниже:

    /*
     function onDragEnd (e) {
         var placemark = e.get('target');
         // Как только пользователь передвинул метку в другую точку,
         // удаляем заданный ранее макет балуна.
         placemark.options.unset('balloonContentLayout');
         // Также удалим текстовое содержимое балуна.
         placemark.properties.unset('balloonContent');

         // Снова подписываемся на событие открытия балуна.
         // Это событие будем слушать только один раз.
         placemark.events.once('balloonopen', requestForPanorama);
     }

     // Слушаем на метках событие 'dragend'. При наступлении этого события
     // будем удалять макет балуна со старой панорамой, после чего выполнять
     // проверку на наличие панорамы в новой точке.
     myPlacemark1.events.add('dragend', onDragEnd);
     myPlacemark2.events.add('dragend', onDragEnd);
     */
});
