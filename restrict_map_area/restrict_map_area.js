ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [67.851728, 34.475377],
        zoom: 9,
        controls: ['smallMapDefaultSet']
    }, {
        // Зададим ограниченную область прямоугольником, 
        // примерно описывающим Кольский полуостров.
        restrictMapArea: [
            [66, 28],
            [70, 41]
        ]
    });
});