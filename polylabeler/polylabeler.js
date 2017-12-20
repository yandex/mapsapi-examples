ymaps.ready(['polylabel.create']).then(function () {
    // Создадим два вида макетов для подписей полигонов: текстовый и с картинкой.
    var textLayout = '<div>{{properties.hintContent}}</div>',
        // В свойстве regionName содержится название региона.
        imgLayout = '<img src="img/{{properties.regionName}}.png" height="50px"/>';

    var map = new ymaps.Map('map', {
        center: [62, 100],
        zoom: 4,
        controls: []
    }, {
        maxZoom: 18,
        minZoom: 4
    });

    // Создадим переключатель вида подписей.
    var typeList = new ymaps.control.ListBox({
        data: {
            content: 'Тип подписи'
        },
        items: [
            new ymaps.control.ListBoxItem({data: {content: 'Текст'}, state: {selected: true}}),
            new ymaps.control.ListBoxItem({data: {content: 'Изображение'}})
        ]
    });
    typeList.get(0).events.add('click', function () {
        typeList.get(1).state.set('selected', false);
        // Устанавливаем всем подписям текстовый макет.
        updateLabels('text');
    });
    typeList.get(1).events.add('click', function () {
        typeList.get(0).state.set('selected', false);
        // Устанавливаем всем подписям макет с картинкой.
        updateLabels('img');
    });
    map.controls.add(typeList, {floatIndex: 0});

    // Создадим менеджер объектов.
    var objectManager = new ymaps.ObjectManager();
    // Загрузим регионы.
    ymaps.regions.load('RU', {
        lang: 'ru',
        quality: 2
    }).then(function (result) {
        var i = 0;
        // Присваиваем регионам опции нужные для модуля подписей полигонов.
        result.geoObjects.each(function (polygon) {
            polygon.options.set({
                // Стандартный вид текста будет темный с белой обводкой.
                labelDefaults: 'dark',
                // Макет подписи.
                labelLayout: textLayout,
                // Цвет заливки.
                fillColor: 'rgba(27, 125, 190, 0.7)',
                // Цвет обводки.
                strokeColor: 'rgba(255, 255, 255, 0.8)',
                // Отключим показ хинта при наведении.
                openHintOnHover: false,
                // Размер текста подписей зависит от масштаба.
                // На уровнях зума 3-6 размер равен 12, а на уровнях зума 7-18 равен 14.
                labelTextSize: {'3_6': 12, '7_18': 14},
                cursor: 'grab',
                labelDotCursor: 'pointer',
                // Допустимая погрешность в рассчете вместимости подписи в полигон.
                labelPermissibleInaccuracyOfVisibility: 4
            });
            // В свойство regionName кладем название файла с гербом.
            polygon.properties.set({
                regionName: regions[i]
            });
            // Добавляем в менеджер объектов полигон.
            objectManager.add({
                type: 'Feature',
                id: i,
                geometry: {
                    type: polygon.geometry.getType(),
                    coordinates: polygon.geometry.getCoordinates()
                },
                options: polygon.options.getAll(),
                properties: polygon.properties.getAll()
            });
            i++;
        });
        map.geoObjects.add(objectManager);

        // Запускаем модуль подписей.
        var polylabel = new ymaps.polylabel.create(map, objectManager);

        // Добавляем слушатели событий на подписи.
        objectManager.events.add(['labelmouseenter', 'labelmouseleave'], function (event) {
            // Получаем полигон, на котором произошло событие.
            var polygon = objectManager.objects.getById(event.get('objectId')),
                // Получаем состояние подписи.
                state = polylabel.getLabelState(polygon),
                // Получаем проекцию позиции подписи, чтобы показать на этом месте hint.
                centerProj = map.options.get('projection').toGlobalPixels(state.get('center'), map.getZoom());
            if (event.get('type') === 'labelmouseenter' && state.get('currentVisibility') === 'dot') {
                objectManager.objects.hint.open(polygon.id, centerProj);
            } else {
                objectManager.objects.hint.close();
            }
        });
    });

    // Обновляем у всех полигонов макет.
    function updateLabels(type) {
        var layout, HintLayout;
        if (type === 'text') {
            layout = textLayout;
            HintLayout = ymaps.templateLayoutFactory.createClass(
                '{{properties.hintContent}}'
            );
        } else {
            layout = imgLayout;
            HintLayout = ymaps.templateLayoutFactory.createClass(
                '<img src="img/{{properties.regionName}}.png" height="50px"/>'
            );
        }
        // Меняем хинт в зависимости от макета.
        objectManager.objects.options.set({
            hintContentLayout: HintLayout
        });
        objectManager.objects.each(function (polygon) {
            objectManager.objects.setObjectOptions(polygon.id, {labelLayout: layout});
        });
    }
});