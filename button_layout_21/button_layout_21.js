ymaps.ready(init);
        
function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controls: ['fullscreenControl']
        }),
        /*
         * Макет кнопки должен отображать поле data.content
         * и изменяться в зависимости от того, нажата ли кнопка или нет.
         * Текущий размер (small, medium, large) рассчитывается исходя из значения опции maxWidth
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Button.xml#param-parameters
         */
        ButtonLayout = ymaps.templateLayoutFactory.createClass([
            '<div alt="{{ data.title }}" class="my-button ',
                '{% if state.size == "small" %}my-button_small{% endif %}',
                '{% if state.size == "medium" %}my-button_medium{% endif %}',
                '{% if state.size == "large" %}my-button_large{% endif %}',
                '{% if state.selected %} my-button_selected{% endif %}">', 
                '<img class="my-button__img" src="{{ data.image }}" alt="{{ data.title }}">',
                '<span class="my-button__text">{{ data.content }}</span>',
            '</div>'
        ].join('')),    

        button = new ymaps.control.Button({
            data: {
                content: "Жмак-жмак",
                image: 'images/pen.gif',
                title: "Жмак-жмак-жмак"
            },
            options: {
                layout: ButtonLayout    
            }
        });
            
    myMap.controls.add(button, {
        right: 5,
        top: 5
    });
}