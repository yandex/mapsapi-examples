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
            // The layout of the pieChart cluster placemark.
            clusterIconLayout: 'default#pieChart',
            disableClickZoom: true
        }),
        iconColor = {
            'School': '#eeef43',
            'Hospital': '#f2547c',
            'Airport': '#19a2f7',
            'Park': '#7fde67',
            'Metro': '#f23016',
            'Train station-street': '#105acc',
            'Residential building': '#747274',
            'Store': '#ffa925'
        };

    for (var i = 0; i < obj.length; i++) {
        if (obj[i].Cells.NAME in iconColor) {
            var mark = new ymaps.Placemark([Number(obj[i].Cells.Y.replace(',', '.')), Number(obj[i].Cells.X.replace(',', '.'))], {
                balloonContentHeader: 'Payphone, ' + obj[i].Cells.NAME,
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

    // Creating a drop-down list with 8 items.
    var listBoxItems = [
            new ymaps.control.ListBoxItem({data: {content: 'Residential building', color: '#747274'}}),
            new ymaps.control.ListBoxItem({data: {content: 'School', color: '#eeef43'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Park', color: '#7fde67'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Store', color: '#ffa925'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Hospital', color: '#f2547c'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Metro', color: '#f23016'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Station', color: '#105acc'}}),
            new ymaps.control.ListBoxItem({data: {content: 'Airport', color: '#19a2f7'}})
        ],

        // Now creating the drop-down list.
        listBox = new ymaps.control.ListBox({
            items: listBoxItems,
            data: {
                content: 'Payphones nearby'
            },
            options: {
                // Setting the layout for child items of the list.
                itemLayout: "default#legendItem"
            },
            state: {
                expanded: true
            }
        });
    myMap.controls.add(listBox, {float: 'none', position: {top: 10, right: 20}});
});
