ymaps.ready(function () {

    // Координаты, к которым будем строить маршруты.
    // Укажите здесь, к примеру, координаты вашего офиса.
    var targetCoords = [55.752, 37.616],

    // Инициализируем карту.
        myMap = new ymaps.Map('map', {
            center: targetCoords,
            zoom: 11
        }, {
            // Ограничиваем количество результатов поиска.
            searchControlResults: 1,

            // Отменяем автоцентрирование к найденным адресам.
            searchControlNoCentering: true,

            // Разрешаем кнопкам нужную длину.
            buttonMaxWidth: 150
        }),

    // Метка для конечной точки маршрута.
        targetPoint = new ymaps.Placemark(targetCoords, { iconContent: 'Кремль' }, { preset: 'islands#redStretchyIcon' }),

    // Получаем ссылки на нужные элементы управления.
        searchControl = myMap.controls.get('searchControl'),
        geolocationControl = myMap.controls.get('geolocationControl'),

    // Создаём кнопки выбора типа маршрута.
        autoRouteBtn = new ymaps.control.Button('На авто'),
        masstransitRouteBtn = new ymaps.control.Button('На транспорте'),

    // Метка для начальной точки маршрута.
        sourcePoint,

    // Переменные, в которых будут храниться ссылки на текущий маршрут.
        currentRoute,
        currentRoutingMode;

    // Добавляем конечную точку на карту.
    myMap.geoObjects.add(targetPoint);

    // Добавляем на карту созданные кнопки.
    myMap.controls
        .add(autoRouteBtn, { float: 'left', floatIndex: -500 })
        .add(masstransitRouteBtn, { float: 'left', floatIndex: -501 });

    // Подписываемся на события нажатия на кнопки.
    autoRouteBtn.events
        .add('select', function (e) { createRoute('auto', e.get('target')); })
        .add('deselect', clearRoute);
    masstransitRouteBtn.events
        .add('select', function (e) { createRoute('masstransit', e.get('target')); })
        .add('deselect', clearRoute);

    // Подписываемся на события, информирующие о трёх типах выбора начальной точки маршрута:
    // клик по карте, отображение результата поиска или геолокация.
    myMap.events.add('click', onMapClick);
    searchControl.events.add('resultshow', onSearchShow);
    geolocationControl.events.add('locationchange', onGeolocate);

    /*
     * Следующие функции реагируют на нужные события, удаляют с карты предыдущие результаты,
     * переопределяют точку отправления и инициируют перестроение маршрута.
     */

    function onMapClick (e) {
        clearSourcePoint();
        sourcePoint = new ymaps.Placemark(e.get('coords'), { iconContent: 'Отсюда' }, { preset: 'islands#greenStretchyIcon' });
        myMap.geoObjects.add(sourcePoint);
        createRoute();
    }

    function onSearchShow (e) {
        clearSourcePoint(true);
        sourcePoint = searchControl.getResultsArray()[e.get('index')];
        createRoute();
    }

    function onGeolocate (e) {
        clearSourcePoint();
        sourcePoint = e.get('geoObjects').get(0);
        createRoute();
    }

    function clearSourcePoint (keepSearchResult) {
        if (!keepSearchResult) {
            searchControl.hideResult();
        }

        if (sourcePoint) {
            myMap.geoObjects.remove(sourcePoint);
            sourcePoint = null;
        }
    }

    /*
     * Функция, создающая маршрут.
     */
    function createRoute (routingMode, targetBtn) {
        // Если начальная точка маршрута еще не выбрана, ничего не делаем.
        if (!sourcePoint) {
            if (targetBtn) {
                targetBtn.deselect();
            }

            alert('Пожалуйста, укажите начальное местоположение');
            return;
        }

        // Если `routingMode` был передан, значит вызов происходит по клику
        // на кнопке выбора типа маршрута, следовательно снимаем выделение с другой кнопки.
        // В противном случае — перестраиваем уже имеющийся маршрут или ничего не делаем.
        if (routingMode == 'auto') {
            masstransitRouteBtn.deselect();
        } else if (routingMode == 'masstransit') {
            autoRouteBtn.deselect();
        } else if (currentRoutingMode) {
            routingMode = currentRoutingMode;
        } else {
            return;
        }

        // Стираем предыдущий маршрут.
        clearRoute();

        currentRoutingMode = routingMode;

        // Создаём маршрут нужного типа из начальной в конечную точку.
        currentRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [sourcePoint, targetPoint],
            params: { routingMode: routingMode }
        }, {
            boundsAutoApply: true
        });

        // Добавляем маршрут на карту.
        myMap.geoObjects.add(currentRoute);
    }

    function clearRoute () {
        myMap.geoObjects.remove(currentRoute);
        currentRoute = currentRoutingMode = null;
    }
});