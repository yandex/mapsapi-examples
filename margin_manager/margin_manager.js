ymaps.ready(function () {
    var map = new ymaps.Map(
        'map',
        {
            center: [55.76, 37.64],
            zoom: 11,
            controls: []
        }
    );

    // указываем для элементов область занимаемую над картой (положение и размер)
    // поддерживаюися значения в пикселях (px) и процентах (%)
    // если единица измерения не указана, то считается значение в пикселях
    var mapAreas = [
        // панель с иконками
        {
            top: '20%', // проценты расчитываются относительно размеров контейнера с картой
            left: 0,
            width: '50px',
            height: '130px'
        },
        // блок в правом углу
        {
            top: 10,
            right: 10,
            width: 100,
            height: 130
        }
    ];
    // добавляем каждый блок в менеджер отступов
    mapAreas.forEach(function (area) {
        // метод `addArea` возвращает объект, который предоставляет доступ к прямоугольной области в менеджере отступов
        var accessor = map.margin.addArea(area);
        // если вызвать метод `remove` у аксессора, то область будет удалена и менеджера отступов
        // пример: accessor.remove()

        addArea(accessor);
    });

    $.getJSON('data.json').then(function (geoJSON) {
        var objectManager = new ymaps.ObjectManager({geoObjectBalloonAutoPan: false});
        objectManager.add(geoJSON);

        map.geoObjects.add(objectManager);

        objectManager.objects.events.add('click', function (event) {
            var objectData = objectManager.objects.getById(event.get('objectId'))
            map.panTo(objectData.geometry.coordinates, {useMapMargin: !!objectData.properties.useMargin});
        });
    });

    var toggleAreaBtn = new ymaps.control.Button({
        data: {content: 'Показать занятые области', title: 'Показать все занятые области из менеджера отступов'},
        options: {maxWidth: 300}
    });
    // по клику над картой отображаются все области, добавленные
    // в менеджер отступов
    toggleAreaBtn.events.add(['select', 'deselect'], function (event) {
        var container = document.getElementsByClassName('area-holder')[0];
        container && container.classList[event.originalEvent.type == 'select' ? 'remove' : 'add']('is-hidden');
    });
    map.controls.add(toggleAreaBtn);

    var toggleMarginBtn = new ymaps.control.Button({
        data: {content: 'Показать поля', title: 'Показать поля карты'},
        options: {
            // разрешаем контролу автоматически добавить свои размеры в менеджер отступов
            // adjustMapMargin: true,
            maxWidth: 200
        }
    });
    toggleMarginBtn.events.add(['select', 'deselect'], function (event) {
        var container = document.getElementsByClassName('map-bounds')[0];
        container && container.classList[event.originalEvent.type == 'select' ? 'remove' : 'add']('is-hidden');
    });
    map.controls.add(toggleMarginBtn);

    // показываем поля карты
    function updateMapMargins () {
        var margin = map.margin.getMargin();
        document.getElementsByClassName('map-bounds')[0].style.borderWidth = margin.join('px ') + 'px';
    }
    updateMapMargins();
    map.events.add('marginchange', updateMapMargins);
});
