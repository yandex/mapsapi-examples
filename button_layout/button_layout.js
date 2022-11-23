ymaps.ready(init);
        
function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controls: []
        }),

    /*
     * Макет кнопки должен отображать поле data.content
     * и изменяться в зависимости от того, нажата ли кнопка или нет.
     * Текущий размер (small, medium, large) рассчитывается исходя из значения опции maxWidth
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Button.xml#param-parameters
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
                content: "Жмак-жмак-жмак",
                image: 'images/pen.png',
                title: "Жмак-жмак-жмак"
            },
            options: {
                layout: ButtonLayout,
                maxWidth: [170, 190, 220]
            }
        });

    myMap.controls.add(button, {
        position: {
            right: 5,
            top: 5
        }
    });
}