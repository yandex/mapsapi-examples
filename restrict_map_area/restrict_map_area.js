ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [59.938,30.3],
        zoom: 9,
        controls: ['smallMapDefaultSet']
    }, {
        // Зададим ограниченную область прямоугольником, 
        // примерно описывающим Санкт-Петербург.
        restrictMapArea: [
            [59.838,29.511],
            [60.056,30.829]
        ]
    });
});