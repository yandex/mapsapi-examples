ymaps.ready(['util.dom.className'], function () {
    var balloonPosition = [55.83866, 37.712326], // The position of the balloon.
        Layout = ymaps.templateLayoutFactory.createClass([
            'Centering<br>', '<button type="button" class="no-margin">without margings</button>', '<button type="button" class="with-margin">considering margins</button>',            
            

        ]
            build: function () {
                Layout.superclass.build.call(this, arguments);
                var container = this.getElement();
                container.addEventListener('click', function (event) {
                    var target = event.target;
                    if (target.tagName.toLowerCase() == 'button') {
                        map.panTo(balloonPosition, {useMapMargin: target.className.match(/with-margin/i)});
                    }
                });
            }
        }),
        map = new ymaps.Map('map',
            {
                center: [55.85, 37.7124],
                zoom: 11,
                controls: []
            },
            {
                balloonContentLayout: Layout,
                balloonAutoPan: false,
                balloonPanelMaxMapArea: 0,
                balloonCloseButton: false
            }
        );

    /**
     * For elements on the page, we specify the area occupied over the map (the position and size).
     *  Values are supported in pixels (px) and percentages (%).
     *  If the unit of measurement is omitted, pixels are assumed.
     */
    var mapAreas = [
        // Panel on the left.
        {
            top: 0,
            left: 0,
            width: '80px',
            height: '100%' // The percentages are calculated relative to the size of the map container.
        },
        // Block in the right corner.
        {
            top: 10,
            right: 10,
            width: '40%',
            height: '40%'
        }
    ];
    // Adding each block to the margins manager.
    mapAreas.forEach(function (area) {
        // The 'addArea' method of the margins manager returns an object (the accessor), which provides access to the rectangular area in the margins manager.
        var accessor = map.margin.addArea(area);
        /**
         * If we call the 'remove' method for the accessor, the area will be removed from the margins manager.
         *  Example: accessor.remove()
         */

        visualizeArea(accessor);
    });

    map.balloon.open(balloonPosition);

    /**
     * The controls support the 'adjustMapMargin' option.
     *  When set to true, the control automatically adds its dimensions to the margins manager.
     */
    var toggleAreaBtn = new ymaps.control.Button({
            data: {
                content: 'Show occupied areas',
                title: 'Show all occupied areas from the margins manager'
            },
            options: {
                /**
                 * adjustMapMargin: true,
                 *  Maximum button width.
                 */
                maxWidth: 300
            }
        });
    /**
     * A click on the map displays all the areas added to
     *  the margins manager.
     */
    toggleAreaBtn.events.add(['select', 'deselect'], function (event) {
        var container = document.getElementsByClassName('area-holder')[0],
            mode = event.originalEvent.type == 'select' ? 'remove' : 'add';

        if (container) {
            ymaps.util.dom.className[mode](container, 'is-hidden');
        }
    });
    map.controls.add(toggleAreaBtn);

    var toggleMarginBtn = new ymaps.control.Button({
            data: {content: 'Show margins', title: 'Show map margins'},
            options: {
                /**
                 * Allowing the control to automatically add its own dimensions to the margins manager.
                 *  In order for the control to register itself in the margins manager, uncomment this line.
                 *  adjustMapMargin: true,
                 */
                maxWidth: 200
            }
        });
    toggleMarginBtn.events.add(['select', 'deselect'], function (event) {
        var container = document.getElementsByClassName('map-bounds')[0],
            mode = event.originalEvent.type == 'select' ? 'remove' : 'add';

        if (container) {
            ymaps.util.dom.className[mode](container, 'is-hidden');
        }
    });
    map.controls.add(toggleMarginBtn);

    // Showing map margins.
    function updateMapMargins () {
        var margin = map.margin.getMargin();
        document.getElementsByClassName('map-bounds')[0].style.borderWidth = margin.join('px ') + 'px';
    }
    updateMapMargins();
    map.events.add('marginchange', updateMapMargins);
});
