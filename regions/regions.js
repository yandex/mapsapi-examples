ymaps.ready(init);

function init () {
    var regionControlLayout = ymaps.templateLayoutFactory.createClass(optionsTemplate, {
            build: function () {
                regionControlLayout.superclass.build.call(this);

                $(this.getParentElement).on('click', 'li', function (e) {
                    var $target = $(this),
                        changed = false;

                    if (!$target.hasClass('active')) {
                        changed = true;
                        $target.siblings().removeClass('active');
                        $target.addClass('active');

                        $target.parents('.btn-group').find('.value').html(': ' + $target.find('a').attr('data-id'));
                    }

                    if (changed) {
                        updateMap();
                    }
                })
            },
            clear: function () {
                $(this.getParentElement).off('click', 'li');
                regionControlLayout.superclass.clear.call(this);
            }
        }),
        regionControl = new ymaps.control.Button({
            data: options,
            options: {
                layout: regionControlLayout
            },
            float: 'left',
            maxWidth: [300]
        }),
        map = new ymaps.Map('map', {
            center: [50, 30],
            zoom: 3,
            controls: ['typeSelector']
        });

    map.controls.get('typeSelector').options.set('size', 'small');
    map.controls.add(regionControl);
    
    var args = ['region', 'lang', 'quality'];
    function updateMap () {
        var res = args.reduce(function (res, arg) {
            var $active = $('.' + arg + ' li.active a');
            if ($active.length) {
                res.params[arg] = $active.attr('data-id');
            } else {
                res.ready = false;
            }
            return res;
        }, { params: {}, ready: true });

        if (res.ready) {
            getRegions(res.params);
        }
    }

    var regions;
    function getRegions (params) {
        $('#regions-params').find('button').attr('disabled', 'disabled');

        if (regions) {
            map.geoObjects.remove(regions);
        }

        ymaps.regions.load(params.region, {
            lang: params.lang,
            quality: params.quality
        }).then(function (result) {
                map.geoObjects.add(regions = result.geoObjects);
                $('#regions-params').find('button').attr('disabled', null);
            }, function (e) {
                alert('No data');
                $('#regions-params').find('button').attr('disabled', null);
            });
    }
}

var options = {
        region: [
            {
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
            }
        ],
        lang: [
            {
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
            }
        ]
    },
    optionsTemplate = ['<div style="line-height: 34px; background-color: #80808080;" id="regions-params">',
        '<div class="btn-group btn-group-xs">',
        '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">',
        '<span>Регион</span><span class="value"></span>&nbsp;<span class="caret"></span>',
        '</button>',
        '<ul class="dropdown-menu region">',
        '{% for region in data.region %}',
        '<li><a href="javascript:void(0)" data-id="{{ region.id }}">{{ region.title }}</a></li>',
        '{% endfor %}',
        '</ul>',
        '</div>',
        '&nbsp;',
        '<div class="btn-group btn-group-xs">',
        '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">',
        '<span>Язык</span><span class="value"></span>&nbsp;<span class="caret"></span>',
        '</button>',
        '<ul class="dropdown-menu lang">',
        '{% for lang in data.lang %}',
        '<li><a href="javascript:void(0)" data-id="{{ lang.id }}">{{ lang.title }}</a></li>',
        '{% endfor %}',
        '</ul>',
        '</div>',
        '&nbsp;',
        '<div class="btn-group btn-group-xs">',
        '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">',
        '<span>Точность границ</span><span class="value">: 1</span>&nbsp;<span class="caret"></span>',
        '</button>',
        '<ul class="dropdown-menu quality">',
        '<li><a href="javascript:void(0)" data-id="0">0</a></li>',
        '<li class="active"><a href="javascript:void(0)" data-id="1">1</a></li>',
        '<li><a href="javascript:void(0)" data-id="2">2</a></li>',
        '<li><a href="javascript:void(0)" data-id="3">3</a></li>',
        '</ul>',
        '</div>',
        '</div>'].join('');
