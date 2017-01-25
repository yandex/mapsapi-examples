ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9,
            controls: []
        }),

        // Создадим пользовательский макет ползунка масштаба.
        ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
            "<div id='zoom-in' class='btn'><i class='icon-plus'></i></div><br>" +
            "<div id='zoom-out' class='btn'><i class='icon-minus'></i></div>" +
            "</div>", {

            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    myMap.controls.add(zoomControl);
}