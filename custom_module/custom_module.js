// Creating our first custom module - a custom control layout.
ymaps.modules.define('plugin.PlacemarkCounterControlLayout', [
    // The list of module dependencies. These modules will be loaded (if they have not yet been
    // loaded) before calling the function that defines the module.
    'templateLayoutFactory'
], function (provide, templateLayoutFactory) {
    // The function that defines the module itself. The first argument is the provide function. The
    // provide function must be passed directly to the module. The provide function call may be
    // delayed. For example, in order to load some data. Subsequent arguments are requested in the
    // module dependencies.     provide(
        templateLayoutFactory.createClass('<div class=placemark_counter>{{ data.placemark_count }}</div>')
    );
});

// Creating a second custom module. This module provides its own control, which is based on the
// buttons.
ymaps.modules.define('plugin.PlacemarkCounterControl', [
    'control.Button',
    'util.extend',
    'util.augment',
    // The second module in the dependencies requests the first one.
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
    // Inheriting all the methods of a standard button.     augment(CounterControl, Button, {
        // Overriding the setParent method.
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

// Map initialization.
ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.734046, 37.588628],
        zoom: 7,
        controls: []
    });

    // Requesting our custom control in the module system.
    ymaps.modules.require(['plugin.PlacemarkCounterControl'])
        .spread(function (PlacemarkCounterControl) {
            // Creating an instance of your custom button and adding it to the map.
            myMap.controls.add(
                new PlacemarkCounterControl()
            );
        });
    // Creating a button that we use for adding placemarks to the map.     var addPlacemarkButton =
    // new ymaps.control.Button({
            data: { content: 'Добавить метку' },
            options: { maxWidth: 200, float: 'right', selectOnClick: false }
        });
    myMap.controls.add(addPlacemarkButton);
    
    // Adding a placemark by clicking randomly.
    addPlacemarkButton.events.add('click', function () {
        var center = myMap.getCenter();
        center[0] += (Math.random() * 2) - 1;
        center[1] += (Math.random() * 2) - 1;
        myMap.geoObjects.add(new ymaps.Placemark(center));
    });
});
