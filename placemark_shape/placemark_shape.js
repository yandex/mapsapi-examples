ymaps.ready(function () {
    var map = new ymaps.Map('map', {
        center: [55.7, 37.6],
        zoom: 10,
        controls: []
    });

    // Создание метки с квадратной активной областью.
    var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout">$</div></div>');

    var squarePlacemark = new ymaps.Placemark(
        [55.725118, 37.682145], {
            hintContent: 'Метка с прямоугольным HTML макетом'
        }, {
            iconLayout: squareLayout,
            // Описываем фигуру активной области "Прямоугольник".
            iconShape: {
                type: 'Rectangle',
                // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
                coordinates: [
                    [-25, -25], [25, 25]
                ]
            }
        }
    );
    map.geoObjects.add(squarePlacemark);

    // Создание метки с круглой активной областью.
    var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="circle_layout">#</div></div>');

    var circlePlacemark = new ymaps.Placemark(
        [55.783202, 37.605584], {
            hintContent: 'Метка с круглым HTML макетом'
        }, {
            iconLayout: circleLayout,
            // Описываем фигуру активной области "Круг".
            iconShape: {
                type: 'Circle',
                // Круг описывается в виде центра и радиуса
                coordinates: [0, 0],
                radius: 25
            }
        }
    );
    map.geoObjects.add(circlePlacemark);

    // Создание метки со сложной фигурой активной области.
    var polygonLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="polygon_layout">!</div></div>');

    var polygonPlacemark = new ymaps.Placemark(
        [55.662693, 37.558416], {
            hintContent: 'HTML метка сложной формы'
        }, {
            iconLayout: polygonLayout,
            // Описываем фигуру активной области "Полигон".
            iconShape: {   
                type: 'Polygon',
                // Полигон описывается в виде трехмерного массива. Массив верхнего уровня содержит контуры полигона. 
                // Первый элемента массива - это внешний контур, а остальные - внутренние.
                coordinates: [
                    // Описание внешнего контура полигона в виде массива координат.
                    [[-28,-76],[28,-76],[28,-20],[12,-20],[0,-4],[-12,-20],[-28,-20]]
                    // , ... Описание внутренних контуров - пустых областей внутри внешнего.
                ]
            }
        }
    );
    map.geoObjects.add(polygonPlacemark);
});