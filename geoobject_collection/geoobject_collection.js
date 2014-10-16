
ymaps.ready(init);
var myMap;

function init() {
    var myCollection,
        myCollectionArray,
        myPlacemarks = [],
        myPlaces = [{
            'name': 'метро Свиблово',
            'coords': [55.85, 37.64]
        }, {
            'name': 'метро Ботанический сад',
            'coords': [55.84, 37.63]
        }, {
            'name': 'метро Отрадное',
            'coords': [55.86, 37.60]
        }, {
            'name': 'метро Владыкино',
            'coords': [55.84, 37.59]
        }, {
            'name': 'Главный Ботанический Сад',
            'coords': [55.83, 37.60]
        }, {
            'name': 'Кольский пруд',
            'coords': [55.86, 37.64]
        }, {
            'name': 'Парк Торфянка',
            'coords': [55.87, 37.68]
        }, {
            'name': 'Парк Сад Будущего',
            'coords': [55.84, 37.64]
        }];

    myMap = new ymaps.Map("map", {
        center: [55.85, 37.63],
        zoom: 12
    });

    // Создаем неупорядоченную коллекцию.
    myCollection = new ymaps.GeoObjectCollection({}, {
        // Зададим опции, которые будут унаследованы
        // всеми геообъектами данной коллекции.
        // Все метки коллекции с пиктограммой "метро".
        preset: 'twirl#metroMoscowIcon',
        // Курсор в форме руки.
        cursor: 'grab',
        // Включаем возможность перетаскивания для всех элементов коллекции.
        draggable: true
    });

    // Создаем упорядоченную коллекцию.
    myCollectionArray = new ymaps.GeoObjectArray({}, {
        preset: 'twirl#badmintonIcon',
        draggable: true
    });

    // Создадим метки и добавим их в коллекции. Первые 4 метки - в неупорядоченную коллекцию,
    // последние 4 - в упорядоченную.
    for (var i = 0; i < 8; i++){
        myPlacemarks[i] =  new ymaps.Placemark(myPlaces[i].coords, {
            balloonContent: myPlaces[i].name
        });
        if (i < 4) {
            myCollection.add(myPlacemarks[i]);
        } else {
            myCollectionArray.add(myPlacemarks[i]);
        }
    }

    // Теперь добавим коллекции геообъектов на карту
    myMap.geoObjects.add(myCollection)
        .add(myCollectionArray);

    // Поиск элемента из упорядоченной коллекции  по его порядковому номеру. Идентификаторы ссылок соответствуют порядковым номерам элемента коллекции.
    $('a.places').bind('click', function () {
        myCollectionArray.get($(this).attr('id')).balloon.open();
        return false;
    });

    // Поиск выбранного элемента из неупорядоченной коллекции. Ищем геообъект, содержимое всплывающей подсказки которого совпадает с указанной строкой.
    $('a.metro').bind('click', function () {
        if ($(this).attr('id') == 'sviblovo'){
            myCollection.each(function (item) {
                if (item.properties.get('balloonContent') == 'метро Свиблово') {
                    item.balloon.open();
                }
            });
        } else if ($(this).attr('id') == 'otradnoe'){
            myCollection.each(function (item) {
                if (item.properties.get('balloonContent') == 'метро Отрадное') {
                    item.balloon.open();
                }
            });
        } else if ($(this).attr('id') == 'botanic'){
            myCollection.each(function (item) {
                if (item.properties.get('balloonContent') == 'метро Ботанический Сад') {
                    item.balloon.open();
                }
            });
        } else if ($(this).attr('id') == 'vladikino'){
            myCollection.each(function (item) {
                if (item.properties.get('balloonContent') == 'Владыметро кино') {
                    item.balloon.open();
                }
            });
        }
        return false;
    });

}

