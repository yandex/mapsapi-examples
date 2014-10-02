ymaps.ready(init);

var myMap,
    bigMap = false;

function init () {
    myMap = new ymaps.Map('map', {
        center: [55.755768, 37.617671],
        zoom: 10
    }, {
        // При сложных перестроениях можно выставить автоматическое
        // обновление карты при изменении размеров контейнера.
        // При простых изменениях размера контейнера рекомендуется обновлять карту программно.
        // autoFitToViewport: 'always'
    });
    $('#toggler').click(toggle);
}

function toggle () {
    bigMap = !bigMap;

    // Добавляем/убираем CSS-класс, определяющий размеры контейнера карты,
    // заданные в абсолютных единицах (300x200 px).
    if (bigMap) {
        $('#map').removeClass('smallMap');
    } else {
        $('#map').addClass('smallMap');
    }

    // Если выставлен флаг, сообщаем карте, что ей следует
    // привести свои размеры к размерам контейнера.
    if ($('#checkbox').attr('checked')) {
        myMap.container.fitToViewport();
    }
}