ymaps.ready(init);
function init () {
    var map = new ymaps.Map('map', {
            center: [59.93772, 30.313622],
            zoom: 10,
            controls: []
        }),
        firstButton = new ymaps.control.Button("Button");

    map.controls.add(firstButton, {float: 'right'});

    var secondButton = new ymaps.control.Button({
        data: {
            // Setting the text and icon for a button.
            content: "Adaptive button",
            // The icon is 16x16 pixels.
            image: 'images/error.png'
        },
        options: {
            /**
             * Because the button changes depending on the size of the map, we will give it
             * three different maxWidth values in the array.
             */
            maxWidth: [28, 150, 178]
        }
    });
    map.controls.add(secondButton);

    /**
     * We will artificially switch the size of the button every second,
     * in order to show all the options for the button appearance.
     * When resizing the map, these changes will occur automatically.
     */
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
