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

    var categories = {},
        // Создадим 5 пунктов выпадающего списка.
        listBoxItems = ['Школа', 'Аптека', 'Магазин', 'Больница', 'Бар'].map(function(title){
                categories[title] = true;
                return new ymaps.control.ListBoxItem({data: {content: title}, state: {selected: true}})
            }),
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
    listBoxControl.events.add(["select","deselect"], function(e) {
        var content = e.get("target").data.get("content"),
            type = e.get("type");
        categories[content] = (type == "select");
        // Применим фильтр.
        objectManager.setFilter(getFilterFunction(categories));
    });

    function getFilterFunction(categories){
        return function(obj){
            var content = obj.properties.balloonContent;
            return categories[content]
        }
    }

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });

}