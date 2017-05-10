var REGIONS_DATA = {
        region: {
            title: 'Region',
            items: [{
                id: '001',
                title: 'World countries'
            }, {
                id: 'BY',
                title: 'Belarus'
            }, {
                id: 'KZ',
                title: 'Kazakhstan'
            }, {
                id: 'RU',
                title: 'Russia'
            }, {
                id: 'TR',
                title: 'Turkey'
            }, {
                id: 'UA',
                title: 'Ukraine'
            }]
        },
        lang: {
            title: 'Language',
            items: [{
                id: 'en',
                title: 'English'
            }, {
                id: 'be',
                title: 'Belarusian'
            }, {
                id: 'kk',
                title: 'Kazakh'
            }, {
                id: 'ru',
                title: 'Russian'
            }, {
                id: 'tr',
                title: 'Turkish'
            }, {
                id: 'uk',
                title: 'Ukrainian'
            }]
        },
        quality: {
            title: 'Precision of boundaries',
            items: [{
                id: '0',
                title: '0'
            }, {
                id: '1',
                title: '1'
            }, {
                id: '2',
                title: '2'
            }, {
                id: '3',
                title: '3'
            }]
        }
    },
    // Template for HTML content for layouts.
    optionsTemplate = [
        '<div style="line-height: 34px; background-color: #80808080;" id="regions-params">',
        '{% for paramName, param in data.params %}',
        '{% for key, value in state.values %}',
        '{% if key == paramName %}',
        '<div class="btn-group btn-group-xs">',
        '<button{% if state.enabled %}{% else %} disabled{% endif %} type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">',
        '<span>{{ param.title }}</span>',
        '<span class="value">: {{ value }}</span>',
        '&nbsp;<span class="caret"></span>',
        '</button>',
        '<ul class="dropdown-menu {{ paramName }}">',
        '{% for item in param.items %}',
        '<li{% if item.id == value %} class="active"{% endif %}>',
        '<a href="#" data-param="{{ paramName }}" data-id="{{ item.id }}">',
        '{{ item.title }}',
        '</a>',
        '</li>',
        '{% endfor %}',
        '</ul>',
        '</div>&nbsp;',
        '{% endif %}',
        '{% endfor %}',
        '{% endfor %}',
        '</div>'
    ].join('');

ymaps.ready(init);

function init() {
    // Creating a custom RegionControl layout.
    var RegionControlLayout = ymaps.templateLayoutFactory.createClass(optionsTemplate, {
            build: function () {
                RegionControlLayout.superclass.build.call(this);
                this.handleClick = ymaps.util.bind(this.handleClick, this);
                $(this.getParentElement)
                    .on('click', 'a', this.handleClick);
            },
            clear: function () {
                $(this.getParentElement)
                    .off('click', 'a', this.handleClick);
                RegionControlLayout.superclass.clear.call(this);
            },
            handleClick: function (e) {
                e.preventDefault();
                var $target = $(e.currentTarget);
                var state = this.getData().state;
                var newValues = ymaps.util.extend({}, state.get('values'));
                if (!$target.hasClass('active')) {
                    newValues[$target.data('param')] = $target.data('id');
                    state.set('values', newValues);
                }
            }
        }),
        // Inheriting our control class from ymaps.control.Button.
        RegionControl = ymaps.util.defineClass(function (parameters) {
            RegionControl.superclass.constructor.call(this, parameters);
            this.regions = new ymaps.GeoObjectCollection();
        }, ymaps.control.Button, /** @lends ymaps.control.Button */{
            onAddToMap: function (map) {
                RegionControl.superclass.onAddToMap.call(this, map);
                map.geoObjects.add(this.regions);
                this.setupStateMonitor();
                this.loadRegions(this.state.get('values'));
            },

            onRemoveFromMap: function (map) {
                map.geoObjects.remove(this.regions);
                this.clearStateMonitor();
                RegionControl.superclass.onRemoveFromMap.call(this, map);
            },

            setupStateMonitor: function () {
                this.stateMonitor = new ymaps.Monitor(this.state);
                this.stateMonitor.add('values', this.handleStateChange, this);
            },

            clearStateMonitor: function () {
                this.stateMonitor.removeAll();
            },

            handleStateChange: function (params) {
                this.loadRegions(params);
            },

            handleRegionsLoaded: function (res) {
                this.regions
                    .removeAll()
                    .add(res.geoObjects);
                this.getMap().setBounds(
                    this.regions.getBounds(),
                    {checkZoomRange: true}
                );
            },

            loadRegions: function (params) {
                this.disable();
                return ymaps.regions.load(params.region, params)
                    .then(this.handleRegionsLoaded, this)
                    .always(this.enable, this);
            }
        }),

        map = new ymaps.Map('map', {
            center: [50, 30],
            zoom: 3,
            controls: ['typeSelector']
        }, {
            typeSelectorSize: 'small'
        }),

        // Creating a RegionControl instance.
        regionControl = new RegionControl({
            state: {
                enabled: true,
                values: {
                    region: 'BY',
                    lang: 'en',
                    quality: '1'
                }
            },
            data: {
                params: REGIONS_DATA
            },
            options: {
                layout: RegionControlLayout
            },
            float: 'left',
            maxWidth: [300]
        });

    // Adding the control to the map.
    map.controls.add(regionControl);
    // You can track changes in the RegionControl parameters as follows.
    regionControl.events.add('statechange', function (e) {
        console.log(e.get('target').get('values'));
    });
}
