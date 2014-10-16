ymaps.ready(init);  

function init () {
    var myMap = new ymaps.Map('map', {
            center: [63.369315, 105.440191],
            zoom: 3,
            // Добавим к стандартным поведениям карты зум колесом мыши.
            behaviors: ['default', 'scrollZoom']
        });
    
    myMap.controls.add('smallZoomControl', { top: 5 });
    
    // Создаем кластеризатор c красной иконкой (по умолчанию используются синия).
    var clusterer = new ymaps.Clusterer({preset: 'twirl#redClusterIcons'}),
        // Создаем коллекцию геообъектов.
        collection = new ymaps.GeoObjectCollection(),
        // Дополнительное поле ввода при включенном режиме кластеризации.
        gridSizeField = $('<div class="field" style="display: none">Размер ячейки кластера в пикселях: <input type="text" size="6" id ="gridSize" value="64"/></div>')
            .appendTo('.inputs');
    
    // Добавляем кластеризатор на карту.
    myMap.geoObjects.add(clusterer);
    
    // Добавляем коллекцию геообъектов на карту.
    myMap.geoObjects.add(collection);
    
    $('#useClusterer').bind('click', toggleGridSizeField);
    $('#addMarkers').bind('click', addMarkers);
    $('#removeMarkers').bind('click', removeMarkers);
    
    // Добавление меток с произвольными координатами.
    function addMarkers () {
        // Количество меток, которое нужно добавить на карту.
        var placemarksNumber = $('#count').val(),
            bounds = myMap.getBounds(),
            // Флаг, показывающий, нужно ли кластеризовать объекты.
            useClusterer = $('#useClusterer').is(':checked'),
            // Размер ячейки кластеризатора, заданный пользователем.
            gridSize = parseInt($('#gridSize').val()),
            // Генерируем нужное количество новых объектов.
            newPlacemarks = createGeoObjects(placemarksNumber, bounds);
        
        if (gridSize > 0) {
            clusterer.options.set({
                gridSize: gridSize
            });
        }
        
        // Если используется кластеризатор, то добавляем кластер на карту,
        // если не используется - добавляем на карту коллекцию геообъектов.
        if (useClusterer) {      
            // Добавлеяем массив меток в кластеризатор.
            clusterer.add(newPlacemarks);
        } else {
            for (var i = 0, l = newPlacemarks.length; i < l; i++) {
                collection.add(newPlacemarks[i]);
            } 
        }
    }
    
    // Функция, создающая необходимое количество геообъектов внутри указанной области.
    function createGeoObjects (number, bounds) {
        var placemarks = [];
        // Создаем нужное количество меток
        for (var i = 0; i < number; i++) {
            // Генерируем координаты метки случайным образом.
            coordinates = getRandomCoordinates(bounds);
            // Создаем метку со случайными координатами.
            myPlacemark = new ymaps.Placemark(coordinates);
            placemarks.push(myPlacemark);
        }
        return placemarks;
    }
    
    // Функция, генерирующая случайные координаты
    // в пределах области просмотра карты.
    function getRandomCoordinates (bounds) {
        var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
        return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
    }
    
    // Показывать/скрывать дополнительное поле ввода.
    function toggleGridSizeField () {
        // Если пользователь включил режим кластеризации, то появляется дополнительное поле
        // для ввода опции кластеризатора - размер ячейки кластеризации в пикселях.
        // По умолчанию размер ячейки сетки равен 64.
        // При отключении режима кластеризации дополнительное поле ввода скрывается.
        gridSizeField.toggle();
    }

    // Удаление всех меток с карты
    function removeMarkers () {
        // Удаляем все  метки из кластеризатора.
        clusterer.removeAll();
        // Удаляем все метки из коллекции.
        collection.removeAll();
    }
}
