ymaps.ready(['polylabel.create']).then(function () {
    // Создадим два макета подписей полигонов: с текстом и с картинкой.
    var textLayouts = {
            label: '<div>{{properties.hintContent}}</div>',
            hint: ymaps.templateLayoutFactory.createClass('<div>{{properties.hintContent}}</div>')
        };
    var imgLayouts = {
            // В свойстве regionName содержится название региона.
            label: '<img src="images/{{properties.regionName}}.png" height="50px"/>',
            hint: ymaps.templateLayoutFactory.createClass('<img src="images/{{properties.regionName}}.png" height="50px"/>')
        };
    var map = new ymaps.Map('map', {
                center: [58, 40],
                zoom: 5,
                controls: []
            }, {
                maxZoom: 18,
                minZoom: 2
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
        }),
        zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: 'small',
                float: 'none',
                position: {
                    bottom: 145,
                    right: 10
                }
            }
        });
    typeList.get(0).events.add('click', function () {
        typeList.get(1).state.set('selected', false);
        // Устанавливаем всем подписям текстовый макет.
        updateLabels('text');
        // Закрываем список.
        typeList.collapse();
    });
    typeList.get(1).events.add('click', function () {
        typeList.get(0).state.set('selected', false);
        // Устанавливаем всем подписям макет с картинкой.
        updateLabels('image');
        // Закрываем список.
        typeList.collapse();
    });
    map.controls
        .add(typeList, {floatIndex: 0})
        .add(zoomControl);

    // Создадим менеджер объектов.
    var objectManager = new ymaps.ObjectManager();
    // Загрузим регионы.
    ymaps.borders.load('RU', {
        lang: 'ru',
        quality: 2
    }).then(function (result) {
            var options = {
                // Стандартный вид текста будет темный с белой обводкой.
                labelDefaults: 'dark',
                // Макет подписи.
                labelLayout: textLayouts.label,
                // Цвет заливки.
                fillColor: 'rgba(27, 125, 190, 0.7)',
                // Цвет обводки.
                strokeColor: 'rgba(255, 255, 255, 0.8)',
                // Отключим показ всплывающей подсказки при наведении на полигон.
                openHintOnHover: false,
                // Размер текста подписей зависит от масштаба.
                // На уровнях зума 3-6 размер текста равен 12, а на уровнях зума 7-18 равен 14.
                labelTextSize: {'3_6': 12, '7_18': 14},
                cursor: 'grab',
                labelDotCursor: 'pointer',
                // Допустимая погрешность в расчете вместимости подписи в полигон.
                labelPermissibleInaccuracyOfVisibility: 4
            };
            // Добавляем полигоны в менеджер объектов.
            objectManager.add(result.features.map(function (feature) {
                feature.id = feature.properties.iso3166;
                // В свойство regionName запишем название региона.
                feature.properties.regionName = feature.properties.iso3166;
                // Присваиваем регионам опции, нужные для модуля подписей полигонов.
                feature.options = options;
                return feature;
            }));
        map.geoObjects.add(objectManager);

        // Запускаем модуль подписей.
        var polylabel = new ymaps.polylabel.create(map, objectManager);

        // Подписываемся на события подписей.
        objectManager.events.add(['labelmouseenter', 'labelmouseleave'], function (event) {
            // Получаем полигон, на котором произошло событие.
            var polygon = objectManager.objects.getById(event.get('objectId'));
                // Получаем состояние подписи.
            var state = polylabel.getLabelState(polygon);
                // Получаем проекцию позиции подписи, чтобы показать на этом месте всплывающую подсказку.
            var centerProj = map.options.get('projection').toGlobalPixels(state.get('center'), map.getZoom());
            if (event.get('type') === 'labelmouseenter' && state.get('currentVisibility') === 'dot') {
                objectManager.objects.hint.open(polygon.id, centerProj);
            } else {
                objectManager.objects.hint.close();
            }
        });
    });

    // Функция, которая обновляет у всех полигонов макет.
    function updateLabels(type) {
        var layouts = type === 'text' ? textLayouts : imgLayouts;
        // Меняем всплывающую подсказку в зависимости от макета.
        objectManager.objects.options.set({
            hintContentLayout: layouts.hint
        });
        objectManager.objects.each(function (polygon) {
            objectManager.objects.setObjectOptions(polygon.id, {labelLayout: layouts.label});
        });
    }
});
