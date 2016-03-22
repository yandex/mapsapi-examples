/**
 * @fileOverview
 * Вспомогательные функции для примера.
 *
 */
(function () {
    var container;

    /**
     * Визуальное представление занятой области.
     * Добавляем в DOM дерево элемент, представляющий занятую область.
     * @param {Object} accessor Экземпляр map.margin.Accessor
     */
    window.visualizeArea = function visualizeArea (accessor) {
        if (!container) {
            container = document.createElement('div');
            container.className = 'area-holder is-hidden';
            document.body.appendChild(container);
        }

        var markElement = document.createElement('div');
        markElement.className = 'rect';

        // Запрашиваем описание прямоугольной области у асессора и на его основе задаем стили DOM-элемента.
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
