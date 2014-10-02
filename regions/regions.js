var countries = {
    RU: 60189,//RU
    UA: 60199, //UA
    BY: 59065, //BEL
    KZ: 214665 //KZ
}, langs = ['ru', 'uk', 'en', 'be'];


ymaps.ready(function () {
    var sCountry = $("#country"),
        sLng = $("#lang"),
        sLevel = $("#level");
    for (var i in countries) {
        $("<option value=" + i + ">" + i + "</option>").appendTo(sCountry);
    }
    for (var j in langs) {
        var i = langs[j];
        $("<option value=" + i + ">" + i + "</option>").appendTo(sLng);
    }


    geoMap = new ymaps.Map('container', {
        center: [0, 0],
        type: "yandex#map",
        zoom: 3
    });

    var lastCollection = 0,
        lastActiveRegion = 0;


    $("#remove").click(function () {
        geoMap.geoObjects.remove(lastCollection);
        lastCollection = 0;
    });

    $("select").change(function () {
        var lng = $("option:selected", sLng).val() || 'ru',
            contr = $("option:selected", sCountry).val(),
            level = $("option:selected", sLevel).val();
        if (lastCollection) {
            geoMap.geoObjects.remove(lastCollection);
        }
        ymaps.regions.load(contr, {
            lang: lng,
            quality: level
        }).then(function (result) {
                lastCollection = result.geoObjects;
                lastCollection.options.set({
                    zIndex: 1,
                    zIndexHover: 1,
                    draggable:true
                });


                lastCollection.events.add('click', function (event) {
                    var target = event.get('target');
                    if (lastActiveRegion) {
                        lastActiveRegion.options.set('preset', '')
                    }
                    lastActiveRegion = target;
                    lastActiveRegion.options.set('preset', {
                        strokeWidth: 3,
                        fillColor: 'F99',
                        strokeColor: '9f9'
                    });
                });

                geoMap.geoObjects.add(lastCollection);
            }, function () {
                //alert('no response');
            });
    });
});