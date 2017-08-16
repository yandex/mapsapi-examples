// Создаем первый собственный модуль - макет своего контрола.
ymaps.modules.define('plugin.PlacemarkCounterControlLayout', [
    // Список зависимостей модуля. 
    // Эти модули будут загружены (если раньше не были) перед вызовом функции, которая определяет модуль.
    'templateLayoutFactory'
], function (provide, templateLayoutFactory) {
    // Функция, которая определяет сам модуль.
    // Первым аргументом идет provide-функция. В provide-функцию нужно будет передать непосредственно модуль.
    // Вызов provide-функции может быть отложен во времени. К примеру, для загрузки каких-либо данных.
    // Последующие аргументы - это запрошенные в зависимостях модули. 
    provide(
        templateLayoutFactory.createClass('<div id=placemark_counter>{{ data.placemark_count }}</div>')
    );
});

// Создаем второй собственный модуль.
// Этот модуль предоставляет собственный элемент управления, который создается на основе кнопки.
ymaps.modules.define('plugin.PlacemarkCounterControl', [
    'control.Button',
    'util.extend',
    'util.augment',
    // Второй модуль в зависимостях запрашивает первый.
    'plugin.PlacemarkCounterControlLayout'
], 
function (provide, Button, extend, augment, PlacemarkCounterControlLayout) {
    var CounterControl = function () {
            CounterControl.superclass.constructor.call(this, {
                data: { placemark_count: 0 },
                options: {
                    selectOnClick: false,
                    layout: PlacemarkCounterControlLayout,
                    maxWidth: 100
                }
            });
        };
    // Наследуем все методы стандартной кнопки. 
    augment(CounterControl, Button, {
        // Переопределяем метод setParent.
        setParent: function (parent) {
            CounterControl.superclass.setParent.call(this, parent);
            if (parent) {
                if (!this._mapEventListener) {
                    this._mapEventListener = this.getMap().geoObjects.events.group();
                    this._mapEventListener.add(['add', 'remove'], this._refresh, this);
                }
                this._refresh();
            } else if (this._mapEventListener) {
                this._mapEventListener.removeAll();
            }
        },
        
        _refresh: function () {
            this.data.set('placemark_count', this.getMap().geoObjects.getLength());
        },
    });
    
    provide(CounterControl);
});

// Инициализация карты.
ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.734046, 37.588628],
        zoom: 7,
        controls: []
    });

    // Запрашиваем в модульной системе собственный контрол.
    ymaps.modules.require(['plugin.PlacemarkCounterControl'])
        .spread(function (PlacemarkCounterControl) {
            // Создаем экземпляр собственной кнопки и добавляем её на карту.
            myMap.controls.add(
                new PlacemarkCounterControl()
            );
        });
    // Создаем кнопку, при помощи которой добавляем метки на карту.    
    var addPlacemarkButton = new ymaps.control.Button({
            data: { content: 'Добавить метку' },
            options: { maxWidth: 200, float: 'right', selectOnClick: false }
        });
    myMap.controls.add(addPlacemarkButton);
    
    // Добавление метки по клику в случайное место.
    addPlacemarkButton.events.add('click', function () {
        var center = myMap.getCenter();
        center[0] += (Math.random() * 2) - 1;
        center[1] += (Math.random() * 2) - 1;
        myMap.geoObjects.add(new ymaps.Placemark(center));
    });
});