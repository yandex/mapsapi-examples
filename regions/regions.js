var
    // Список стран
    countries = {
        RU: 60189,//RU
        UA: 60199, //UA
        BY: 59065, //BEL
        KZ: 214665 //KZ
    },
    // Доступные языки
    langs = ['ru', 'uk', 'en', 'be'],
    // Раскраска по странам
    strokeColorSet={
        RU: '#688',
        UA: '#868',
        BY: '#888',
        KZ: '#668',
    },
    fillColorSet={
        RU: '#FAA',
        UA: '#AFA',
        BY: '#AAA',
        KZ: '#FFA',
    };


ymaps.ready(function () {
    var sLng = $("#lang"),
        sLevel = $("#level");
    for (var j in langs) {
        var i = langs[j];
        $("<option value=" + i + ">" + i + "</option>").appendTo(sLng);
    }


    geoMap = new ymaps.Map('container', {
        center: [50, 45],
        type: "yandex#map",
        zoom: 3
    });

    var lastCollection = 0;


    $("select").change(showRegions);

    function loadRegion(country, options, targetCollection){
        ymaps.regions.load(country, options).then(function (result) {
            var lastActiveRegion=0;
            var collection = result.geoObjects;
            collection.options.set({
                zIndex: 1,
                zIndexHover: 1,
                strokeColor: strokeColorSet[country],
                fillColor: fillColorSet[country]
            });

            collection.events.add('click', function (event) {
                var target = event.get('target');
                if (lastActiveRegion) {
                    lastActiveRegion.options.set('preset', '')
                }
                lastActiveRegion = target;
                lastActiveRegion.options.set('preset', {
                    strokeWidth: [4,1],
                    fillColor: 'FFF3',
                    strokeColor: ['#FFF','#000'],
                    zIndex:2
                });
            });
            targetCollection.add(collection);


        }, function () {
            //alert('no response');
        });
    }

    function showRegions() {
        var lng = $("option:selected", sLng).val() || 'ru',
            level = $("option:selected", sLevel).val();
        if (lastCollection) {
            geoMap.geoObjects.remove(lastCollection);
        }
        lastCollection = new ymaps.GeoObjectCollection();
        geoMap.geoObjects.add(lastCollection);
        for (var i in countries) {
            loadRegion(i, {
                lang: lng,
                quality: level
            }, lastCollection);
        }
    }

    showRegions();
});