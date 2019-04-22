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
            // Setting an option to make placemarks start clusterizing.
            clusterize: true,
            // ObjectManager accepts the same options as the clusterer.
            gridSize: 64,
            // The layout of the pieChart cluster placemark.
            clusterIconLayout: "default#pieChart"
        });
    myMap.geoObjects.add(objectManager);

    // Creating a drop-down list with 5 items.
    var listBoxItems = ['School', 'Pharmacy', 'Store', 'Hospital', 'Bar']
            .map(function (title) {
                return new ymaps.control.ListBoxItem({
                    data: {
                        content: title
                    },
                    state: {
                        selected: true
                    }
                })
            }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Now creating the drop-down list with 5 items.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Filter',
                title: 'Filter'
            },
            items: listBoxItems,
            state: {
                // Indicates that the list is expanded.
                expanded: true,
                filters: listBoxItems.reduce(reducer, {})
            }
        });
    myMap.controls.add(listBoxControl);

    // Adding tracking to the indicator to check if a list item is selected.
    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });

    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        // Applying the filter.
        objectManager.setFilter(getFilterFunction(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
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
