ymaps.ready(init);
        
function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controls: []
        }),

        // Макет кнопки должен отображать поле data.content
        // и изменяться в зависимости от того, нажата кнопка или нет.
        ButtonLayout = ymaps.templateLayoutFactory.createClass(
            "<div class='my-button {% if state.selected %}my-button-selected{% endif %}'>" +
                "{{data.content}}" +
                "</div>"
        ),
            
        button = new ymaps.control.Button({
            data: {
                content: "Жмак-жмак"
            },
            options: {
                layout: ButtonLayout
            }
        });
            
    myMap.controls.add(button, {
        float: 'left'
    });
}