ymaps.ready(['Panel']).then(function () {
    var map = new ymaps.Map("map", {
        center: [55.733, 37.588],
        zoom: 10,
        controls: []
    });
    // Создадим контент для меток.
    var firstOffice = 'Первый полноценный офис Яндекса появился в Москве в 2001 году. ' +
        'Тогда компания занимала небольшой корпус Вычислительного центра РАН на улице Вавилова, там работало 60 человек.';
    var secondOffice = 'Второй офис Яндекса на Самокатной улице.';
    var thirdOffice = '<a href="https://yandex.ru/company/contacts/moscow/">Главный офис Яндекса</a>' +
        '<p><img style="width: 190px;" src="img/office.jpeg"></p>' +
        '<p>В офисе на улице Льва Толстого находится штаб-квартира Яндекса, он самый большой и по размерам, ' +
        'и по численности сотрудников. Сейчас он занимает почти целый квартал между улицами Льва Толстого ' +
        'и Тимура Фрунзе. Общая площадь всех зданий — более 50 тысяч квадратных метров.</p>';
    // Создадим и добавим панель на карту.
    var panel = new ymaps.Panel();
    map.controls.add(panel, {
        float: 'left'
    });
    // Создадим коллекцию геообъектов.
    var collection = new ymaps.GeoObjectCollection(null, {
        // Запретим появление балуна.
        hasBalloon: false,
        iconColor: '#3b5998'
    });
    // Добавим геообъекты в коллекцию.
    collection
        .add(new ymaps.Placemark([55.733838, 37.588100], {
            balloonContent: thirdOffice
        }))
        .add(new ymaps.Placemark([55.758240, 37.678523], {
            balloonContent: secondOffice
        }))
        .add(new ymaps.Placemark([55.693784, 37.564942], {
            balloonContent: firstOffice
        }));
    // Добавим коллекцию на карту.
    map.geoObjects.add(collection);
    // Подпишемся на событие клика по коллекции.
    collection.events.add('click', function (e) {
        // Получим ссылку на геообъект, по которому кликнул пользователь.
        var target = e.get('target');
        // Зададим контент боковой панели.
        panel.setContent(target.properties.get('balloonContent'));
        // Переместим центр карты по координатам метки с учётом заданных отступов.
        map.panTo(target.geometry.getCoordinates(), {useMapMargin: true});
    });
});