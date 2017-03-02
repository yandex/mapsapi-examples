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
            }
        ],
        lang: [
            {
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
            }
        ]
    },
    optionsTemplate = ['<div style="line-height: 34px; background-color: #80808080;" id="regions-params">',
        '<div class="btn-group btn-group-xs">',
        '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">',
        '<span>Region</span><span class="value"></span>&nbsp;<span class="caret"></span>',
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
        '<span>Language</span><span class="value"></span>&nbsp;<span class="caret"></span>',
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
        '<span>Accuracy of borders</span><span class="value">: 1</span>&nbsp;<span class="caret"></span>',
        '</button>',
        '<ul class="dropdown-menu quality">',
        '<li><a href="javascript:void(0)" data-id="0">0</a></li>',
        '<li class="active"><a href="javascript:void(0)" data-id="1">1</a></li>',
        '<li><a href="javascript:void(0)" data-id="2">2</a></li>',
        '<li><a href="javascript:void(0)" data-id="3">3</a></li>',
        '</ul>',
        '</div>',
        '</div>'].join('');
