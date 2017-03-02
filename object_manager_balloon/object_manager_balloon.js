ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true
        });

    myMap.geoObjects.add(objectManager);

    $.ajax({
        url: "data.json"
    }).done(function(data) {
        objectManager.add(data);
        // Opening the balloon on the placemark with id == 1.
        var objectState = objectManager.getObjectState(1);
        if (objectState.isClustered) {
            // Making sure that the specified object has been "selected" in the balloon.
            objectManager.clusters.state.set('activeObject', objectManager.objects.getById(1));
            /**
             * All the generated clusters have unique identifiers.
             * This identifier must be passed to the balloon manager to specify
             * which cluster to show the balloon on.
             */
            objectManager.clusters.balloon.open(objectState.cluster.id);
        } else {
            objectManager.objects.balloon.open(1);
        }
    });

}
