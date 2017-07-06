ymaps.ready('theme.islands.cluster.balloon.layout.Content', init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // Создание макета содержимого балуна кластера.
        // Макет создается через фабрику макетов с помощью макета "cluster#balloonTwoColumns".
        myClusterBalloonContentLayout = ymaps.templateLayoutFactory.createClass('{% include "cluster#balloonTwoColumns" %}', {
            build: function () {
                // Вызываем метод build родительского класса перед выполнением дополнительных действий.
                myClusterBalloonContentLayout.superclass.build.call(this);
                // Сохраняем массив объектов, входящих в состав кластера на котором открыт балун.
                var geoObjects = this.getData().properties.get('geoObjects'),
                    // Сохраняем id объектов, которые ещё не были загружены.
                    ids = geoObjects
                        .filter(function (geoObject) {
                            return !geoObject.properties.loaded
                        })
                        .map(function (geoObject) {
                            return geoObject.id
                        });
                // Если есть незагруженные данные, то загружаем их.
                if (ids.length) {
                    getPointInfo(ids).then(function (response) {
                        geoObjects.forEach(function (geoObject, index) {
                            ymaps.util.extend(geoObject.properties, response[index], {loaded: true});
                        });
                        // Перестраиваем макет.
                        this.rebuild();
                    }, this)
                }
            }
        }),
        // Создание макета с информацией о геообъекте.
        // Макет создается с помощью фабрики макетов с помощью текстового шаблона.
        myClusterBalloonItemContentLayout = ymaps.templateLayoutFactory.createClass([
            '{% if properties.loaded %}',
            '{% include "cluster#balloonTwoColumnsItemContent" %}',
            '{% else %}',
            'loading...',
            '{% endif %}'
        ].join('')),
        // Создание макета содержимого балуна геообъекта.
        // Макет создается с помощью фабрики макетов с помощью текстового шаблона.
        myGeoObjectBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
            '{% if properties.loaded %}',
            '{{ properties.balloonContent }}',
            '{% else %}',
            'loading...',
            '{% endif %}'
        ].join(''), {
            build: function () {
                // Вызываем метод build родительского класса перед выполнением дополнительных действий.
                myGeoObjectBalloonContentLayout.superclass.build.call(this);
                var geoObject = this.getData().object,
                    props = geoObject.properties;

                // Если есть незагруженные данные, то загружаем их.
                if (!props.loaded) {
                    getPointInfo([geoObject.id]).then(function (response) {
                        ymaps.util.extend(props, response[0], {loaded: true});
                        this.rebuild();
                    }, this)
                }
            }
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            clusterDisableClickZoom: true,
            // Используем созданные макеты.
            clusterBalloonContentLayout: myClusterBalloonContentLayout,
            clusterBalloonItemContentLayout: myClusterBalloonItemContentLayout,
            geoObjectBalloonContentLayout: myGeoObjectBalloonContentLayout
        });
    myMap.geoObjects.add(objectManager);

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });

    // Функция, эмулирующая запрос за данными на сервер.
    function getPointInfo(ids) {
        var defer = ymaps.vow.defer();
        window.setTimeout(function () {
            defer.resolve(ids.map(function (id) {
                return {balloonContent: 'Контент метки id: ' + id}
            }));
        }, 1000);
        return defer.promise();
    }
}