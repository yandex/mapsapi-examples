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
    var listBoxItems = ['Школа', 'Аптека', 'Магазин', 'Больница', 'Бар']
            .map(title => new ymaps.control.ListBoxItem({data: {content: title}, state: {selected: true}})),
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
    listBoxControl.events.add(["select","deselect"], function() {
        // Создадим массив выбранных категорий и заполним его.
        var categories = [];
        for (var i = 0; i < listBoxItems.length; i++) {
            if (listBoxItems[i].isSelected()) {
                categories.push(listBoxItems[i].data.get("content"))
            }
        }
        // Применим фильтр.
        objectManager.setFilter(filterObjects(categories));
    });

    function filterObjects(categories){
        return function(obj){
            var content = obj.properties.balloonContent;
            return categories.indexOf(content) >= 0
        }
    }

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });

}