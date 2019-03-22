ymaps.ready(init);
        
function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controls: []
        }),

    /**
     * The button layout should display the 'data.content' field 
     * and change depending on whether the button was clicked or not.
     * The current size (small, medium, large) is calculated from the value of the 'maxWidth' option
     * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/control.Button.xml#param-parameters
      */
        ButtonLayout = ymaps.templateLayoutFactory.createClass([
            '<div title="{{ data.title }}" class="my-button ',
            '{% if state.size == "small" %}my-button_small{% endif %}',
            '{% if state.size == "medium" %}my-button_medium{% endif %}',
            '{% if state.size == "large" %}my-button_large{% endif %}',
            '{% if state.selected %} my-button-selected{% endif %}">',
            '<img class="my-button__img" src="{{ data.image }}" alt="{{ data.title }}">',
            '<span class="my-button__text">{{ data.content }}</span>',
            '</div>'
        ].join('')),

        button = new ymaps.control.Button({
            data: {
                content: "Click-click-click",
                image: 'images/pen.png',
                title: "Click-click-click"
            },
            options: {
                layout: ButtonLayout,
                maxWidth: [170, 190, 220]
            }
        });

    myMap.controls.add(button, {
        right: 5,
        top: 5
    });
}
