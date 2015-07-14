ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [67.851728, 34.475377],
        zoom: 9,
        controls: ['smallMapDefaultSet']
    }, {
        // Setting an area restricted to a rectangle that approximately defines the Kola Peninsula.
        restrictMapArea: [
            [66, 28],
            [70, 41]
        ]
    });
});
