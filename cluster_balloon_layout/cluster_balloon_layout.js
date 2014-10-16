ymaps.ready(init);
        
function init() {
    var center = [55.74954, 37.621587],
        myMap = new ymaps.Map('map', {
            center: center,
            zoom: 10
        }),
        
        // Создадим макет правой части балуна кластера.
        MainContentLayout = ymaps.templateLayoutFactory.createClass('', {
            build: function () {
                // Сначала вызываем метод build родительского класса.
                MainContentLayout.superclass.build.call(this);
                // Нужно отслеживать, какой из пунктов левого меню выбран,
                // чтобы обновлять содержимое правой части.
                this.stateListener = this.getData().state.events.group()
                    .add('change', this.onStateChange, this);
                // Запоминаем текущий активный объект.
                this.activeObject = this.getData().state.get('activeObject');
                this.applyContent();
            },
            
            clear: function () {
                if (this.activeObjectLayout) {
                    this.activeObjectLayout.setParentElement(null);
                    this.activeObjectLayout = null;
                }
                // Снимаем слушателей изменения полей.
                this.stateListener.removeAll();
                // А затем вызываем метод clear родительского класса.
                MainContentLayout.superclass.clear.call(this);
            },
            
            onStateChange: function () {
                // При изменении одного из полей состояния
                // проверяем, не сменился ли активный объект.
                var newActiveObject = this.getData().state.get('activeObject');
                if (newActiveObject != this.activeObject) {
                    // Если объект изменился, нужно обновить
                    // содержимое правой части.
                    this.activeObject = newActiveObject;
                    this.applyContent();
                }
            },
            
            applyContent: function () {
                if (this.activeObjectLayout) {
                    this.activeObjectLayout.setParentElement(null);
                }
                // Чтобы было удобнее формировать текстовый шаблон,
                // создадим внутренний макет, в который будем передавать
                // модифицированный dataSet.
                
                this.activeObjectLayout = new MainContentSubLayout({
                        // Поскольку внутренний макет будет отображать
                        // информацию какого-то геообъекта,
                        // будем передавать во входном хэше данные и опции
                        // текущего активного геообъекта.
                        options: this.options,
                        properties: this.activeObject.properties
                    });
                
                // Прикрепляем внутренний макет к внешнему.
                this.activeObjectLayout.setParentElement(this.getParentElement());
            }
        }),
        
        // Внутрений подмакет правой части балуна кластера.
        MainContentSubLayout = ymaps.templateLayoutFactory.createClass(
            // Мы можем использовать поля properties геообъекта,
            // так как будем передавать properties в конструктор макета.
            '<h3>$[properties.name]</h3>' +
            '<div width="100">' +
                '$[properties.balloonContentHeader]<br>' +
                '$[properties.balloonContentBody]' +
            '</div>'
        ),
        
        // Создадим макет для элемента списка в левой части балуна.
        ItemLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="cluster-balloon-item" [if data.isSelected]style="font-weight: bold;"[endif]>$[properties.name]</div>'
        ),
        
        // Создадим кластеризатор и выставим ему созданные макеты
        // через опции.
        clusterer = new ymaps.Clusterer({
            // Поскольку опции задаются для кластеров, а не для всего
            // кластеризатора, им нужно приписать префикс 'cluster'.
            clusterDisableClickZoom: true,
    
            // Если нужно задать опции для балуна кластера, то к названию
            // опции приписываются сразу 2 префикса - 'cluster' и 'balloon'.
            clusterBalloonMainContentLayout: MainContentLayout,
            clusterBalloonSidebarItemLayout: ItemLayout,
            // Настроим ширину левой части балуна кластера
            clusterBalloonSidebarWidth: 100,
            // и ширину балуна целиком.
            clusterBalloonWidth: 300
        }),
        geoObjects = [];
    
    // Создадим 500 меток со случайными координатами около центра Москвы.
    for (var i = 0; i < 500; i++) {
        var coordinates = [
            center[0] + 0.5 * Math.random() * (Math.random() < 0.5 ? -1 : 1),
            center[1] + 0.7 * Math.random() * (Math.random() < 0.5 ? -1 : 1)
        ];
        geoObjects[i] = new ymaps.Placemark(coordinates, {
            name: 'Метка №' + i,
            clusterCaption: 'Метка №' + i,
            balloonContentBody: '<br>Варкалось. Хливкие шорьки<br>' +
                'Пырялись по наве<br>' +
                'И хрюкотали зелюки,<br>' +
                'Как мюмзики в мове.<br>',
            balloonContentHeader: 'Бармаглот',
            balloonContentFooter: 'Л. Кэрролл'
        });
    }
    
    // Добавим полученные геообъекты в кластеризатор.
    clusterer.add(geoObjects);
    // А сам кластеризатор добавим на карту.
    myMap.geoObjects.add(clusterer);
}