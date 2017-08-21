ymaps.ready(init);

function init() {
    // Привязываем саджест к инпуту.
    var suggestView = new ymaps.SuggestView('suggest'),
        map,
        placemark;

    // При клике по кнопке запускаем верификацию введёных данных.
    $('#button').bind('click', function (e) {
        geocode();
    });

    function geocode() {
        // Забираем запрос из инпута.
        var request = $('#suggest').val();
        // Геокодируем введённые данные.
        ymaps.geocode(request).then(function (res) {
            var obj = res.geoObjects.get(0),
            // Сохраняем точность ответа геокодера.
                precision = obj ? obj.properties.get('metaDataProperty.GeocoderMetaData.precision') : '';
            // Если результат ответа геокодера пустой или неточный, то показываем ошибку
            if (!obj || obj.properties.get('metaDataProperty.GeocoderMetaData.precision') != 'exact') {
                if (precision == 'number' || precision == 'near' || precision == 'range') {
                    message('Неточный адрес, требуется уточнение');
                    showErrorMessage('Уточните номер дома');
                } else if (precision == 'street') {
                    message('Неполный адрес, требуется уточнение');
                    showErrorMessage('Уточните номер дома');
                } else if (precision == 'other') {
                    message('Неполный адрес, требуется уточнение');
                    showErrorMessage('Уточните адрес');
                } else {
                    message('Адрес не найден');
                    showErrorMessage('Уточните адрес');
                }
            } else {
                // Удаляем сообщение об ошибке если результат геокодера точный.
                $('#suggest').removeClass('input_error');
                $('#notice').css('display', 'none');

                var mapContainer = $('#map'),
                    bounds = obj.properties.get('boundedBy'),
                // Рассчитываем видимую область для текущего положения пользователя.
                    mapState = ymaps.util.bounds.getCenterAndZoom(
                        bounds,
                        [mapContainer.width(), mapContainer.height()]
                    ),
                // Сохраняем полный адрес для сообщения под картой.
                    address = [obj.getCountry(), obj.getAddressLine()].join(', '),
                // Сохраняем укороченный адрес для подписи метки.
                    shortAddress = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
                // Убираем контролы с карты.
                mapState.controls = [];
                // Создаём карту.
                createMap(mapState, shortAddress);
                // Выводим сообщение под картой.
                message(address);

            }
        }, function (e) {
            console.log(e)
        })
    }

    function showErrorMessage(message) {
        $('#notice').text(message);
        $('#suggest').addClass('input_error');
        $('#notice').css('display', 'block');
        // Удаляем карту.
        if (map) {
            map.destroy();
            map = null;
        }
    }

    function createMap(state, caption) {
        // Если карты нет, то создаём новую карту и добавляем метку с адресом на карту
        if (!map) {
            map = new ymaps.Map('map', state);
            placemark = new ymaps.Placemark(
                map.getCenter(), {
                    iconCaption: caption,
                    balloonContent: caption
                }, {
                    preset: 'islands#redDotIconWithCaption'
                });
            map.geoObjects.add(placemark);
            // Если карта есть, то выставляем новый центр карты и меняем местоположение и данные метки.
        } else {
            map.setCenter(state.center, state.zoom);
            placemark.geometry.setCoordinates(state.center);
            placemark.properties.set({iconCaption: caption, balloonContent: caption});
        }
    }

    function message(message) {
        $('#messageHeader').text('Данные получены:');
        $('#message').text(message);
    }
}
