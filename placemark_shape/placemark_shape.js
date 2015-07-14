ymaps.ready(function () {
    var map = new ymaps.Map('map', {
        center: [55.7, 37.6],
        zoom: 10,
        controls: []
    });

    // Creating a placemark with a square hotspot.
    var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout">$</div></div>');

    var squarePlacemark = new ymaps.Placemark(
        [55.725118, 37.682145], {
            hintContent: 'Метка с прямоугольным HTML макетом'
        }, {
            iconLayout: squareLayout,
            // Describing the shape of a "Rectangle" hotspot.
            iconShape: {
                type: 'Rectangle',
                // The rectangle is defined as two points: the upper left and lower right.
                coordinates: [
                    [-25, -25], [25, 25]
                ]
            }
        }
    );
    map.geoObjects.add(squarePlacemark);

    // Creating a placemark with a round hotspot.
    var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="circle_layout">#</div></div>');

    var circlePlacemark = new ymaps.Placemark(
        [55.783202, 37.605584], {
            hintContent: 'Метка с круглым HTML макетом'
        }, {
            iconLayout: circleLayout,
            // Describing the shape of a "Circle" hotspot.
            iconShape: {
                type: 'Circle',
                // The circle is defined as the center and radius
                coordinates: [0, 0],
                radius: 25
            }
        }
    );
    map.geoObjects.add(circlePlacemark);

    // Creating a placemark with a complex hotspot shape.
    var polygonLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="polygon_layout">!</div></div>');

    var polygonPlacemark = new ymaps.Placemark(
        [55.662693, 37.558416], {
            hintContent: 'HTML метка сложной формы'
        }, {
            iconLayout: polygonLayout,
            // Describing the shape of a "Polygon" hotspot.
            iconShape: {   
                type: 'Polygon',
                // A polygon is defined as a three-dimensional array. The top-level array contains
                // the contours of the polygon. The first element of the array is the external
                // contour, and the others are internal contours.
                coordinates: [
                    // Describing the external polygon contour as an array of coordinates.
                    [[-28,-76],[28,-76],[28,-20],[12,-20],[0,-4],[-12,-20],[-28,-20]]
                    // ... Describing the internal contours - empty areas inside the external
                    // contour.
                ]
            }
        }
    );
    map.geoObjects.add(polygonPlacemark);
});
