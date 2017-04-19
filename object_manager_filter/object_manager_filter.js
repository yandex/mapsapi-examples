ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 64,
            // Макет метки кластера pieChart.
            clusterIconLayout: "default#pieChart"
        });
    myMap.geoObjects.add(objectManager);

    // Создадим 5 пунктов выпадающего списка.
    var listBoxItems = [
            new ymaps.control.ListBoxItem({data: {content: 'Школа'}, state: {selected: true}}),
            new ymaps.control.ListBoxItem({data: {content: 'Аптека'}, state: {selected: true}}),
            new ymaps.control.ListBoxItem({data: {content: 'Магазин'}, state: {selected: true}}),
            new ymaps.control.ListBoxItem({data: {content: 'Больница'}, state: {selected: true}}),
            new ymaps.control.ListBoxItem({data: {content: 'Бар'}, state: {selected: true}})
        ],
        // Теперь создадим список, содержащий 5 пунктов.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Фильтр',
                title: 'Фильтр'
            },
            items: listBoxItems,
            state: {
                // Признак, развернут ли список.
                expanded: true
            }
        });
    myMap.controls.add(listBoxControl);

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    for (var i = 0; i < listBoxItems.length; i++) {
        new ymaps.Monitor(listBoxItems[i].state).add("selected", callback)
    }

    function callback() {
        // По умолчанию зададим фильтр, который скрывает все объекты.
        var filter = ['properties.type == ""'];
        for (var i = 0; i < listBoxItems.length; i++) {
            // Проверим, выбран ли пункт списка, и если выбран, добавим соответствующие метки в итоговый фильтр.
            if (listBoxItems[i].isSelected()) filter.push('properties.balloonContent == "'+ listBoxItems[i].data.get("content") +'"');
        }
        // Применим фильтр.
        objectManager.setFilter(filter.join(' || '));
    }

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });

}