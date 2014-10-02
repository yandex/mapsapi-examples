ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.755381, 37.619044],
            zoom: 7,
            // Не отображаем на карте никакие стандартные элементы управления, так как они не были загружены.
            controls: []
        });
        
    var loadControl = new ymaps.control.Button({
            data: { content: 'Добавить метку' },
            options: { maxWidth: 200, float: 'right', selectOnClick: false }
        });
    myMap.controls.add(loadControl);
    
    loadControl.events.add('click', function () {
        if (ymaps.Placemark) {
            // Если модуль уже был загружен, то нет необходимости повторно обращаться к модульной системе.
            addPlacemark();
        } else {
            // Загружаем по требованию класс метки и оверлея метки. 
            // По умолчанию оверлей автоматически загружается после добавления метки на карту. 
            // В данном примере происходит асинхронная загрузка самого модуля метки и нет необходимости в отдельной подгрузке оверлея.
            ymaps.modules.require(['Placemark', 'overlay.Placemark'])
                .spread(function (Placemark, PlacemarkOverlay) {
                    // Добавляем в глобальную область видимости класс вручную, 
                    // так как при использовании метода require модульной системы этого не происходит.
                    ymaps.Placemark = Placemark;
                    addPlacemark();
                });
        }
    });
    
    function addPlacemark() {
        var center = myMap.getCenter();
        // Устанавливаем случайную позицию, близкую к центру карты.
        center[0] += (Math.random() * 2) - 1;
        center[1] += (Math.random() * 2) - 1;
        var placemark = new ymaps.Placemark(center);
        myMap.geoObjects.add(placemark);
    }
});