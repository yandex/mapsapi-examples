ymaps.ready(function () {
    var map = new ymaps.Map('map', {
        center: [55.755249, 37.617437],
        zoom: 4
    });
    // Создадим макет метки.
    var animatedLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="placemark"></div>',
        {
            build: function () {
                animatedLayout.superclass.build.call(this);
                var element = this.getParentElement().getElementsByClassName('placemark')[0];
                // Если метка выбрана, то увеличим её размер.
                var size = this.isActive ? 60 : 34;
                // По умолчанию при задании своего HTML макета фигура активной области не задается,
                // и её нужно задать самостоятельно.
                // Создадим фигуру активной области "Круг".
                var smallShape = {type: 'Circle', coordinates: [0, 0], radius: size / 2};
                var bigShape = {type: 'Circle', coordinates: [0, -30], radius: size / 2};
                // Зададим фигуру активной области.
                this.getData().options.set('shape', this.isActive ? bigShape : smallShape);
                // Если метка выбрана, то зададим класс и запустим анимацию.
                if (this.isActive) {
                    element.classList.add("active");
                    element.style.animation = ".35s show-big-placemark";
                } else if (this.inited) {
                    element.classList.remove("active");
                    element.style.animation = ".35s show-small-placemark";
                }
                if (!this.inited) {
                    this.inited = true;
                    this.isActive = false;
                    // При клике по метке будем перестраивать макет.
                    this.getData().geoObject.events.add('click', function () {
                        this.isActive = !this.isActive;
                        this.rebuild();
                    }, this);
                }
            }
        }
    );
    map.geoObjects.add(new ymaps.Placemark([55.755249, 36.317437], {}, {
        iconLayout: animatedLayout,
        hasBalloon: false
    }));
});