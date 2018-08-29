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
    },
    // Шаблон html-содержимого макета.
    optionsTemplate = [
        '<div style="line-height: 34px;" id="regions-params">',
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
        '<a id="regions" href="#" data-param="{{ paramName }}" data-id="{{ item.id }}">',
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
    // Создадим собственный макет RegionControl.
    var RegionControlLayout = ymaps.templateLayoutFactory.createClass(optionsTemplate, {
            build: function () {
                RegionControlLayout.superclass.build.call(this);
                this.handleClick = ymaps.util.bind(this.handleClick, this);
                $(this.getParentElement)
                    .on('click', 'a#regions', this.handleClick);
            },
            clear: function () {
                $(this.getParentElement)
                    .off('click', 'a#regions', this.handleClick);
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
        // Наследуем класс нашего контрола от ymaps.control.Button.
        RegionControl = ymaps.util.defineClass(function (parameters) {
            RegionControl.superclass.constructor.call(this, parameters);
        }, ymaps.control.Button, /** @lends ymaps.control.Button */{
            onAddToMap: function (map) {
                RegionControl.superclass.onAddToMap.call(this, map);
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
                if(this.regions){
                    map.geoObjects.remove(this.regions);
                }

                this.regions = new ymaps.ObjectManager();
                this.regions
                    .add(res.features.map(function (feature) {
                        feature.id = feature.properties.iso3166;
                        feature.options = {
                            strokeColor: '#ffffff',
                            strokeOpacity: 0.4,
                            fillColor: '#6961b0',
                            fillOpacity: 0.8,
                            hintCloseTimeout: 0,
                            hintOpenTimeout: 0
                        };
                        return feature;
                    }));
                map.geoObjects.add(this.regions);

                this.selectedRegionId = '';
                this.regions.events
                    .add('mouseenter', function (e) {
                        var id = e.get('objectId');
                        this.regions.objects.setObjectOptions(id, {strokeWidth: 2});
                    }, this)
                    .add('mouseleave', function (e) {
                        var id = e.get('objectId');
                        if (this.selectedRegionId !== id) {
                            this.regions.objects.setObjectOptions(id, {strokeWidth: 1});
                        }
                    }, this)
                    .add('click', function (e) {
                        var id = e.get('objectId');
                        if (this.selectedRegionId) {
                            this.regions.objects.setObjectOptions(this.selectedRegionId, {
                                strokeWidth: 1,
                                fillColor: '#6961b0'
                            });
                        }
                        this.regions.objects.setObjectOptions(id, {strokeWidth: 2, fillColor: '#3B3781'});
                        this.selectedRegionId = id;
                    }, this);
                this.getMap().setBounds(
                    this.regions.getBounds(),
                    {checkZoomRange: true}
                );
            },

            loadRegions: function (params) {
                this.disable();
                return ymaps.borders.load(params.region, params)
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

        // Создадим экземпляр RegionControl.
        regionControl = new RegionControl({
            state: {
                enabled: true,
                values: {
                    region: 'TR',
                    lang: 'tr',
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

    // Добавим контрол на карту.
    map.controls.add(regionControl);
    // Узнавать о изменениях параметров RegionControl можно следующим образом.
    regionControl.events.add('statechange', function (e) {
        console.log(e.get('target').get('values'));
    });
}