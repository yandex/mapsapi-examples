ymaps.ready(function () {
    var balloonPosition = [55.83866, 37.712326], // Позиция балуна.
        Layout = ymaps.templateLayoutFactory.createClass([
            'Центровать<br>',
            '<button type="button" class="no-margin">без отступов</button>',
            '<button type="button" class="with-margin">учитывая отступы</button>',
        ].join(''), {
            build: function () {
                Layout.superclass.build.call(this, arguments);
                var container = this.getElement();
                container.addEventListener('click', function (event) {
                    var target = event.target;
                    if (target.tagName.toLowerCase() == 'button') {
                        map.panTo(balloonPosition, {useMapMargin: target.className.match(/with-margin/i)});
                    }
                });
            }
        }),
        map = new ymaps.Map('map',
            {
                center: [55.85, 37.7124],
                zoom: 11,
                controls: []
            },
            {
                balloonContentLayout: Layout,
                balloonAutoPan: false,
                balloonPanelMaxMapArea: 0,
                balloonCloseButton: false
            }
        );

    // Указываем для элементов область занимаемую над картой (положение и размер).
    // Поддерживаются значения в пикселях (px) и процентах (%),
    // если единица измерения не указана, то считается, что значение в пикселях.
    var mapAreas = [
        // Панель слева.
        {
            top: 0,
            left: 0,
            width: '80px',
            height: '100%' // Проценты расчитываются относительно размеров контейнера с картой.
        },
        // Блок в правом углу.
        {
            top: 10,
            right: 10,
            width: '40%',
            height: '40%'
        }
    ];
    // Добавляем каждый блок в менеджер отступов.
    mapAreas.forEach(function (area) {
        // Метод `addArea` менеджера отступов возвращает объект (аксессор), который предоставляет доступ к прямоугольной области в менеджере отступов.
        var accessor = map.margin.addArea(area);
        // Если у аксессора вызвать метод `remove`, то область будет удалена из менеджера отступов.
        // Пример: accessor.remove()

        visualizeArea(accessor);
    });

    map.balloon.open(balloonPosition);

    // Контролы поддерживают опцию adjustMapMargin.
    // Когда значение true, контрол автоматически добавляет свои размеры в менеджер отступов.
    var toggleAreaBtn = new ymaps.control.Button({
        data: {content: 'Показать занятые области', title: 'Показать все занятые области из менеджера отступов'},
        options: {
            maxWidth: 300,
            // adjustMapMargin: true
        }
    });
    // По клику над картой отображаются все области, добавленные
    // в менеджер отступов.
    toggleAreaBtn.events.add(['select', 'deselect'], function (event) {
        var container = document.getElementsByClassName('area-holder')[0];
        container && container.classList[event.originalEvent.type == 'select' ? 'remove' : 'add']('is-hidden');
    });
    map.controls.add(toggleAreaBtn);

    var toggleMarginBtn = new ymaps.control.Button({
        data: {content: 'Показать отступы', title: 'Показать отступы карты'},
        options: {
            // Разрешаем контролу автоматически добавить свои размеры в менеджер отступов.
            // adjustMapMargin: true,
            maxWidth: 200
        }
    });
    toggleMarginBtn.events.add(['select', 'deselect'], function (event) {
        var container = document.getElementsByClassName('map-bounds')[0];
        container && container.classList[event.originalEvent.type == 'select' ? 'remove' : 'add']('is-hidden');
    });
    map.controls.add(toggleMarginBtn);

    // Показываем отступы карты.
    function updateMapMargins () {
        var margin = map.margin.getMargin();
        document.getElementsByClassName('map-bounds')[0].style.borderWidth = margin.join('px ') + 'px';
    }
    updateMapMargins();
    map.events.add('marginchange', updateMapMargins);
});
