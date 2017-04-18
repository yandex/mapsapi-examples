ymaps.ready(['layout.LegendItem']).then(function init() {
    var obj = json,
        nameArr = [],
        placemarks = [],
        str = '',
        myMap = new ymaps.Map('map', {
            center: [55.733835, 37.588227],
            zoom: 9,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),
        clusterer = new ymaps.Clusterer({
            // Макет метки кластера pieChart.
            clusterIconLayout: 'default#pieChart',
            disableClickZoom: true
        }),
        iconColor = {
            'Школа': '#eeef43',
            'Больница': '#f2547c',
            'Аэропорт': '#19a2f7',
            'Парк': '#7fde67',
            'Метро': '#f23016',
            'Вокзал-улица': '#105acc',
            'Жилой дом': '#747274',
            'Магазин': '#ffa925'
        };

    for (var i = 0; i < obj.length; i++) {
        if (obj[i].Cells.NAME in iconColor) {
            var mark = new ymaps.Placemark([Number(obj[i].Cells.Y.replace(',', '.')), Number(obj[i].Cells.X.replace(',', '.'))], {
                balloonContentHeader: 'Таксофон, ' + obj[i].Cells.NAME,
                balloonContentBody: obj[i].Cells.ADDRESS
            }, {
                iconColor: iconColor[obj[i].Cells.NAME] || 'lightBlue'
            });
            placemarks.push(mark);
            if (str.indexOf(obj[i].Cells.NAME) == -1) {
                nameArr.push(obj[i].Cells.NAME);
            }
            str += obj[i].Cells.NAME + ', ';
        }
    }
    clusterer.add(placemarks);
    myMap.geoObjects.add(clusterer);

    // Создадим 8 пунктов выпадающего списка
    var listBoxItems = [
            new ymaps.control.ListBoxItem({data: {content: 'Жилой дом', color: '#747274'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Школа', color: '#eeef43'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Парк', color: '#7fde67'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Магазин', color: '#ffa925'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Больница', color: '#f2547c'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Метро', color: '#f23016'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Вокзал', color: '#105acc'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Аэропорт', color: '#19a2f7'}})
        ],

        // Теперь создадим список.
        listBox = new ymaps.control.ListBox({
            items: listBoxItems,
            data: {
                content: 'Таксофоны рядом'
            },
            options: {
                // Задаём макет для дочерних элементов списка.
                itemLayout: "default#legendItem"
            },
            state: {
                expanded: true
            }
        });
    myMap.controls.add(listBox, {float: 'none', position: {top: 10, right: 20}});
});