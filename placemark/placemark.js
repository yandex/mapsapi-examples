ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),

    // Creating a geo object with the "Point" geometry type.
        myGeoObject = new ymaps.GeoObject({
            // The geometry description.
            geometry: {
                type: "Point",
                coordinates: [55.8, 37.8]
            },
            // Properties.
            properties: {
                // The placemark content.
                iconContent: 'I'm draggable',
                hintContent: 'Come on, drag already!'
            }
        }, {
            /**
             * Options.
             * The placemark's icon will stretch to fit its contents.
             */
            preset: 'islands#blackStretchyIcon',
            // The placemark can be dragged.
            draggable: true
        }),
        myPieChart = new ymaps.Placemark([
            55.847, 37.6
        ], {
            // Data for creating a diagram.
            data: [
                {weight: 8, color: '#224080'},
                {weight: 6, color: '#408022'},
                {weight: 4, color: '#802240'}
            ],
            iconCaption: "Diagram"
        }, {
            // Defining a custom placemark layout.
            iconLayout: 'default#pieChart',
            // Radius in pixels for the chart.
            iconPieChartRadius: 30,
            // Radius of the central part of the layout.
            iconPieChartCoreRadius: 10,
            // Fill style for the center area.
            iconPieChartCoreFillStyle: '#ffffff',
            // Style for the lines separating sections and the outline of the chart.
            iconPieChartStrokeStyle: '#ffffff',
            // Width of the lines separating sections and the outline of the chart.
            iconPieChartStrokeWidth: 3,
            // Maximum width of the placemark label.
            iconPieChartCaptionMaxWidth: 200
        });

    myMap.geoObjects
        .add(myGeoObject)
        .add(myPieChart)
        .add(new ymaps.Placemark([55.684758, 37.738521], {
            balloonContent: 'the color of <strong>the water on Bondi Beach</strong>'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        }))
        .add(new ymaps.Placemark([55.833436, 37.715175], {
            balloonContent: '<strong>greyish-brownish-maroon</strong> color'
        }, {
            preset: 'islands#dotIcon',
            iconColor: '#735184'
        }))
        .add(new ymaps.Placemark([55.687086, 37.529789], {
            balloonContent: 'the color of <strong>enamored toads</strong>'
        }, {
            preset: 'islands#circleIcon',
            iconColor: '#3caa3c'
        }))
        .add(new ymaps.Placemark([55.782392, 37.614924], {
            balloonContent: 'the color of <strong>Surprise Dauphin</strong>'
        }, {
            preset: 'islands#circleDotIcon',
            iconColor: 'yellow'
        }))
        .add(new ymaps.Placemark([55.642063, 37.656123], {
            balloonContent: '<strong>red</strong> color'
        }, {
            preset: 'islands#redSportIcon'
        }))
        .add(new ymaps.Placemark([55.826479, 37.487208], {
            balloonContent: '<strong>Facebook</strong> color'
        }, {
            preset: 'islands#governmentCircleIcon',
            iconColor: '#3b5998'
        }))
        .add(new ymaps.Placemark([55.694843, 37.435023], {
            balloonContent: 'the color of a <strong>crocodile's nose</strong>',
            iconCaption: 'Very long but, of course, very interesting text'
        }, {
            preset: 'islands#greenDotIconWithCaption'
        }))
        .add(new ymaps.Placemark([55.790139, 37.814052], {
            balloonContent: '<strong>blue</strong> color',
            iconCaption: 'Very long but, of course, very interesting text'
        }, {
            preset: 'islands#blueCircleDotIconWithCaption',
            iconCaptionMaxWidth: '50'
        }));
}
