ymaps.ready(init);

function init () {
    var map = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        counter = 0,

        /**
         * Creating a balloon content layout.
         *  The layout is created using the layout factory and a text template.
         */
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
                '<b>{{properties.name}}</b><br />' +
                '<i id="count"></i> ' +
                '<button id="counter-button"> +1 </button>' +
            '</div>', {

            /**
             * Redefining the "build" function in order to start listening to the "click" event
             * on a counter button when creating the layout.
             */
            build: function () {
                // First, we call the "build" method of the parent class.
                BalloonContentLayout.superclass.build.call(this);
                // Then we perform additional steps.
                $('#counter-button').bind('click', this.onCounterClick);
                $('#count').html(counter);
            },

            /**
             * In the same way, we redefine the "clear" function in order to
             * remove listening for clicks when the layout is deleted from the map.
             */
            clear: function () {
                /**
                 * We perform the steps in reverse order - first remove the listener,
                 * and then call the "clear" method of the parent class.
                 */
                $('#counter-button').unbind('click', this.onCounterClick);
                BalloonContentLayout.superclass.clear.call(this);
            },

            onCounterClick: function () {
                $('#count').html(++counter);
                if (counter == 5) {
                    alert('Good work.');
                    counter = 0;
                    $('#count').html(counter);
                }
            }
        });

    var placemark = new ymaps.Placemark([55.650625, 37.62708], {
            name: 'Calculating'
        }, {
            balloonContentLayout: BalloonContentLayout,
            /**
             * Disabling replacing the normal balloon with the balloon panel.
             * If you do not specify this option, the balloon panel opens on small maps.
             */
            balloonPanelMaxMapArea: 0
        });

    map.geoObjects.add(placemark);
}
