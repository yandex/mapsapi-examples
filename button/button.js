ymaps.ready(init);
function init () {
    var map = new ymaps.Map('map', {
            center: [59.93772, 30.313622],
            zoom: 10,
            controls: []
        }),
        firstButton = new ymaps.control.Button("Кнопка");

    map.controls.add(firstButton, {float: 'right'});

    var secondButton = new ymaps.control.Button({
        data: {
            // Зададим текст и иконку для кнопки.
            content: "Адаптивная кнопка",
            // Иконка имеет размер 16х16 пикселей.
            image: 'images/error.png'
        },
        options: {
            // Поскольку кнопка будет менять вид в зависимости от размера карты,
            // зададим ей три разных значения maxWidth в массиве.
            maxWidth: [28, 150, 178]
        }
    });
    map.controls.add(secondButton);

    // Будем искусственно переключать размеры кнопки каждую секунду, чтобы показать все варианты
    // внешнего вида кнопки.
    // При изменении размера карты эти перестроения будут происходить автоматически.
    function changeSize  () {
        var oldSize = secondButton.options.get('size'),
            newSize;
        switch (oldSize) {
            case 'small': newSize = 'medium'; break;
            case 'medium': newSize = 'large'; break;
            case 'large': newSize = 'small'; break;
            default: newSize = 'small';
        }
        secondButton.options.set('size', newSize);
    }

    window.setInterval(changeSize, 1000);
}