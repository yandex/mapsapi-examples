var myMap;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: []
    });

    var fitPaneButton = new ymaps.control.Button({
            data: { content: 'fitPane: true' },
            options: { selectOnClick: false, maxWidth: 150 }
        }),
        paneButton = new ymaps.control.Button({
            data: { content: 'pane: outerHint' },
            options: { selectOnClick: false, maxWidth: 150 }
        });

    fitPaneButton.events.add('click', function () {
        var fitPane = !fitPaneButton.data.get('content').match(/true/);
        myMap.options.set('hintFitPane', fitPane);
        fitPaneButton.data.set('content', 'fitPane: ' + (fitPane ? 'true' : 'false'));
        myMap.hint.open();
    });
    
    paneButton.events.add('click', function () {
        var outerPane = !paneButton.data.get('content').match(/outer/);
        myMap.options.set('hintPane', outerPane ? 'outerHint' : 'hint');
        paneButton.data.set('content', 'pane: ' + (outerPane ? 'outerHint' : 'hint'));
        myMap.hint.open();
    });

    myMap.controls.add(fitPaneButton, { float: 'left' });
    myMap.controls.add(paneButton, { float: 'right' });

    myMap.hint.open(null, 'Это невероятно длинный хинт, мало кто его остановит.');
}