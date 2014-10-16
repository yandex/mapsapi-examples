ymaps.ready(init);

function init() {
    // Данные о местоположении, определённом по IP
    var geolocation = ymaps.geolocation,
    // координаты
        coords = [geolocation.latitude, geolocation.longitude],
        myMap = new ymaps.Map('map', {
            center: coords,
            zoom: 10
        });

    myMap.geoObjects.add(
        new ymaps.Placemark(
            coords,
            {
                // В балуне: страна, город, регион.
                balloonContentHeader: geolocation.country,
                balloonContent: geolocation.city,
                balloonContentFooter: geolocation.region
            }
        )
    );
}