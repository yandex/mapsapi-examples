ymaps.ready(init);

function init() {
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
    });

    var RegionControl = ymaps.util.defineClass(function (parameters) {
        RegionControl.superclass.constructor.call(this, parameters);
        this.regions = new ymaps.GeoObjectCollection();
    }, ymaps.control.Button, {
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
    });

    var regionControl = new RegionControl({
        state: {
            enabled: true,
            values: {
                region: 'RU',
                lang: 'ru',
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

    var map = new ymaps.Map('map', {
        center: [50, 30],
        zoom: 3,
        controls: ['typeSelector']
    });

    map.controls.get('typeSelector').options.set('size', 'small');
    map.controls.add(regionControl);
    regionControl.events.add('statechange', function (e) {
        // здесь можно слушать изменение параметров
        // console.log(e.get('target').get('values'));
    });
}

var REGIONS_DATA = {
    region: {
        title: 'Регион',
        items: [{
            id: '001',
            title: 'Страны мира'
        }, {
            id: 'BY',
            title: 'Беларусь'
        }, {
            id: 'KZ',
            title: 'Казахстан'
        }, {
            id: 'RU',
            title: 'Россия'
        }, {
            id: 'TR',
            title: 'Турция'
        }, {
            id: 'UA',
            title: 'Украина'
        }]
    },
    lang: {
        title: 'Язык',
        items: [{
            id: 'en',
            title: 'Английский'
        }, {
            id: 'be',
            title: 'Белорусский'
        }, {
            id: 'kk',
            title: 'Казахский'
        }, {
            id: 'ru',
            title: 'Русский'
        }, {
            id: 'tr',
            title: 'Турецкий'
        }, {
            id: 'uk',
            title: 'Украинский'
        }]
    },
    quality: {
        title: 'Точность границ',
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
};

var optionsTemplate = [
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
