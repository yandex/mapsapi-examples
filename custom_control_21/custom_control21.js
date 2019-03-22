var myMap;
function init () {
    var myMap = new ymaps.Map('map', {
        center: [55.75, 37.63],
        zoom: 14,
        controls: ['smallMapDefaultSet']
    });

    // Creating an instance of our control.
    var myControl = new CustomControl({
        data: {
            content: "Кнопка",
            title: "Нажмите, чтобы увидеть всплывающее сообщение"
        }
    });
    // Adding it to the controls manager.
    myMap.controls.add(myControl);

    /**
     * Control layout.
     * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/templateLayoutFactory.xml
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
                 * Adding a handler for clicks on the control.
                 * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/domEvent.manager.xml
                  */
                this._layoutListeners = ymaps.domEvent.manager.group(this.getElement())
                    .add('click', this._onClick, this);
            },

            clear: function () {
                this._layoutListeners.removeAll();
                СontrolLayout.superclass.clear.call(this);
            },

            _onClick: function () {
                // For example, displaying the current description of the control.
                var title = this.getData().data.get('title');
                alert(title);
            }
        });

    /**
     * Custom control.
     * @param  {Object} [parameters] Control parameters.
     * @param  {Object} [parameters.options] Control options.
     * @param  {Boolean} [parameters.options.visible = true] Whether to show the control on the map.
     * @param  {String} [parameters.options.float = 'right'] Position of the control. Can take the values "none", "left" and "right".
     * @param  {Number|Number[]} [parameters.options.maxWidth = 90] Maximum width of the control. @param  {Object} [parameters.options.position] Position of the control. When the "position" option is set to the value "float",it is automatically interpreted as "none".
     * @param  {String} [parameters.options.size = 'auto'] Parameter responsible for the appearance of the control's layout. Can take the values:
     * <ul> <li>'auto' - the default button layout automatically changes its appearance depending on
     * the size of the map and the number of added controls.</li> <li>'small' - the icon will be
     * displayed in the button layout, regardless of the size of the map.</li> <li>'medium' - only
     * the text is displayed in the button layout, regardless of the size of the map.</li>
     * <li>'large' - the icon and the text are always displayed in the button layout, regardless of
     * map size.</li></ul>@param  {Number} [parameters.options.position.top] Position relative to
     * the top edge.
     * @param  {Number} [parameters.options.position.bottom] Position relative to the bottom edge.
     * @param  {Number} [parameters.options.position.left] Position relative to the left edge.
     * @param  {Number} [parameters.options.position.right] Position relative to the right edge.
     * @param  {Object} [parameters.state] State of the control.
     * @param  {Object} [parameters.data] Data for the control.
     * @param  {String} [parameters.data.content = "my text"] Content that will be displayed.
     * @param  {String} [parameters.data.title = "my title"] Tooltip when you hover over the control.
     */
    function CustomControl (parameters) {
        parameters = parameters || {};
        parameters.options = parameters.options || {};
        parameters.state = parameters.state || {};
        parameters.data = parameters.data || {};

        /**
         * Event manager.
         * @type map.event.Manager
         */
        this.events = new ymaps.event.Manager();

        /**
         * Options manager.
         * @type option.Manager
         */
        this.options = new ymaps.option.Manager(ymaps.util.extend({
            float: "right",
            maxWidth: 70,
            visible: true
        }, parameters.options));

        /**
         * Data manager.
         * @type data.Manager
         */
        this.data = new ymaps.data.Manager(ymaps.util.extend({
            content: "my text",
            title: "my title"
        }, parameters.data));

        /**
         * State manager.
         * @type data.Manager
         */
        this.state = new ymaps.data.Manager(parameters.state);

        /**
         * Creating the layout of the control.
         * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#constructor-summary
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
         * Sets the parent object.
         * @param  {IControlParent} parent The parent object.
         * @returns  {CustomControl} Returns a reference to itself.
         */
        setParent: function (parent) {
            if (this._parent != parent) {
                var oldParent = this._parent;
                this._parent = parent;

                if (parent) {
                    var callback = this._callback = function (childElement) {
                        // Since the operation is performed asynchronously, before setting the
                        // layout of the parent element, you must verify that the callback has not
                        // changed (that it is the same request).
                        if (this._callback == callback) {
                            this._layout.setParentElement(childElement);
                        }
                    };

                    /**
                     * Getting from the parent the container that the control must be added to, and
                     * setting the parent element for the layout.
                     * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/control.Manager.xml#getChildElement
                     *                       */
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
         * @returns  {IControlParent} The parent object.
         */
        getParent: function () {
            return this._parent;
        }
    };
}

ymaps.ready(init);
