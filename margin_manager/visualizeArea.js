/**
 * @fileOverview
 * Auxiliary functions for the example.
 *
 */
(function () {
    var container;

    /**
     * Visual representation of the occupied area.
     * Adding an element to the DOM tree to represent the occupied area.
     * @param {Object} accessor Instance of map.margin.Accessor
     */
    window.visualizeArea = function visualizeArea (accessor) {
        if (!container) {
            container = document.createElement('div');
            container.className = 'area-holder is-hidden';
            document.body.appendChild(container);
        }

        var markElement = document.createElement('div');
        markElement.className = 'rect';

        // Requesting a description of the rectangular area from the accessor and setting the style of the DOM element based on it.
        updateElementStyles(markElement, accessor.getArea());

        container.appendChild(markElement);

        var eventsGroup = accessor.events.group();

        eventsGroup.add('change', function () {
            updateElementStyles(markElement, accessor.getArea());
        });

        accessor.events.once('remove', function () {
            eventsGroup.removeAll();
            container.removeChild(markElement);
            markElement = null;
        });
    }

    function updateElementStyles (element, area) {
        element.style.cssText = '';
        for (var key in area) {
            if (area.hasOwnProperty(key)) {
                var value = String(area[key]);
                if (!isNaN(Number(value[value.length - 1]))) {
                    value += 'px';
                }
                element.style[key] = value;
            }
        }
    }
})();
