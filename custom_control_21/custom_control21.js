var myMap;
function init () {
    var myMap = new ymaps.Map('map', {
        center: [55.75, 37.63],
        zoom: 14,
        controls: ['smallMapDefaultSet']
    });

    // Создадим экземпляр нашего элемента управления.
    var myControl = new CustomControl({
        data: {
            content: "Кнопка",
            title: "Нажмите, чтобы увидеть всплывающее сообщение"
        }
    });
    // Добавим его в менеджер элементов управления.
    myMap.controls.add(myControl);

    /**
     * Макет элемента управления.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/templateLayoutFactory.xml
     * @class
     * @name ControlLayout
     */
    var ControlLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="control" title="{{ data.title }}">',
            '{{ data.content |default: "" |raw }}',
        '</div>'].join(''), {
            build: function () {
                СontrolLayout.superclass.build.call(this);

                /**
                 * Добавляем обработчик клика по элементу управления.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/domEvent.manager.xml
                 */
                this._layoutListeners = ymaps.domEvent.manager.group(this.getElement())
                    .add('click', this._onClick, this);
            },

            clear: function () {
                this._layoutListeners.removeAll();
                СontrolLayout.superclass.clear.call(this);
            },

            _onClick: function () {
                // Например, выведем текущее описание элемента управления.
                var title = this.getData().data.get('title');
                alert(title);
            }
        });

    /**
     * Свой элемент управления.
     * @param {Object} [parameters] Параметры элемента управления.
     * @param {Object} [parameters.options] Опции элемента управления.
     * @param {Boolean} [parameters.options.visible = true] Показывать ли элемент управления на карте.
     * @param {String} [parameters.options.float = 'right'] Положение элемента управления. Может принимать
     * значения "none", "left" и "right".
     * @param {Number|Number[]} [parameters.options.maxWidth = 90] Максимальная ширина элемента управления. 
     * @param {Object} [parameters.options.position] Позиция элемента управления. При указании опции position значение опции float
     * автоматически трактуется как "none".
     * @param {String} [parameters.options.size = 'auto'] Параметр, отвечающий за внешний вид макета элемента управления. 
     * Может принимать значения:
     * <ul>
     *      <li>'auto' - стандартный макет кнопки автоматически изменяет свой внешний вид в зависимости от размеров карты и от количества добавленных элементов управления;</li>
     *      <li>'small' - в макете кнопки отображается иконка, независимо от размера карты;</li>
     *      <li>'medium' - в макете кнопки отображается только текст, независимо от размера карты;</li>
     *      <li>'large' - в макете кнопки всегда отображается иконка и текст, независимо от размера карты.</li>
     * </ul>
     * @param {Number} [parameters.options.position.top] Позиция относительно верхнего края.
     * @param {Number} [parameters.options.position.bottom] Позиция относительно нижнего края.
     * @param {Number} [parameters.options.position.left] Позиция относительно левого края.
     * @param {Number} [parameters.options.position.right] Позиция относительно правого края.
     * @param {Object} [parameters.state] Состояние элемента управления.
     * @param {Object} [parameters.data] Данные элемента управления.
     * @param {String} [parameters.data.content = "my text"] Содержание, которое будет отображаться.
     * @param {String} [parameters.data.title = "my title"] Подсказка при наведении на элемент управления.
     */
    function CustomControl (parameters) {
        parameters = parameters || {};
        parameters.options = parameters.options || {};
        parameters.state = parameters.state || {};
        parameters.data = parameters.data || {};

        /**
         * Менеджер событий.
         * @type map.event.Manager
         */
        this.events = new ymaps.event.Manager();

        /**
         * Менеджер опций.
         * @type option.Manager
         */
        this.options = new ymaps.option.Manager(ymaps.util.extend({
            float: "right",
            maxWidth: 70,
            visible: true
        }, parameters.options));

        /**
         * Менеджер данных.
         * @type data.Manager
         */
        this.data = new ymaps.data.Manager(ymaps.util.extend({
            content: "my text",
            title: "my title"
        }, parameters.data));

        /**
         * Менеджер состояний.
         * @type data.Manager
         */
        this.state = new ymaps.data.Manager(parameters.state);

        /**
         * Создаем макет элемента управления.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#constructor-summary
         */
        this._layout = new ControlLayout({
            options: this.options,
            state: this.state,
            data: this.data
        });

        this._parent = null;
        this._callback = null;
    }

    /**
     * @lends CustomControl.prototype
     */
    CustomControl.prototype = {
        /**
         * Устанавливает родительский объект.
         * @param {IControlParent} parent Родительский объект.
         * @returns {CustomControl} Возвращает ссылку на себя.
         */
        setParent: function (parent) {
            if (this._parent != parent) {
                var oldParent = this._parent;
                this._parent = parent;

                if (parent) {
                    var callback = this._callback = function (childElement) {
                        // Так как операция выполняется асинхронно, прежде чем
                        // выставить макету родительский элемент, необходимо проверить,
                        // не изменился ли callback, то есть что это один и тот же запрос.
                        if (this._callback == callback) {
                            this._layout.setParentElement(childElement);
                        }
                    };

                    /**
                     * Получаем от родителя контейнер, в который должен быть добавлен элемент управления, 
                     * и выставляем макету родительский элемент.
                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager.xml#getChildElement
                     */
                    parent.getChildElement(this).then(callback, this);
                } else {
                    this._layout.setParentElement(null);
                }

                this.events.fire('parentchange', {
                    oldParent: oldParent,
                    newParent: parent
                });
            }

            return this;
        },

        /** 
         * @returns {IControlParent} Родительский объект.
         */
        getParent: function () {
            return this._parent;
        }
    };
}

ymaps.ready(init);