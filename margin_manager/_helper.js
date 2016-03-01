(function () {
    var container;

    window.addArea = function addArea (accessor) {
        if (!container) {
            container = document.createElement('div');
            container.className = 'area-holder is-hidden';
            document.body.appendChild(container);
        }

        var markElement = document.createElement('div');
        markElement.className = 'rect';

        applyArea(accessor.getArea());

        container.appendChild(markElement);

        var eventsGroup = accessor.events.group();

        eventsGroup.add('change', function () {
            applyArea(accessor.getArea());
        });

        accessor.events.once('remove', function () {
            eventsGroup.removeAll();
            container.removeChild(markElement);
            markElement = null;
        });

        function applyArea (area) {
            markElement.style.cssText = '';
            for (var key in area) {
                if (area.hasOwnProperty(key)) {
                    var value = String(area[key]);
                    if (!isNaN(Number(value[value.length - 1]))) {
                        value += 'px';
                    }
                    markElement.style[key] = value;
                }
            }
        }
    }
})();
