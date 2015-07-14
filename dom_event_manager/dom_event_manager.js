ymaps.ready(init);

function init() {
    // Even if the user touches the element on a tablet screen, events such as 'touchstart',
    // 'touchmove' and others will be converted into a single list of events. This allows you to
    // write cross-platform code and not to think about the type of device.
    var targetElement = document.getElementById('myElement'),
        events = ['mouseenter', 'mouseleave', 'click', 'dblclick', 'wheel'],
        divListeners = ymaps.domEvent.manager.group(targetElement)
            .add(events, function (event) {
                log(event.get('type'));
            });

    document.getElementById('clear').onclick = function () {
        document.getElementById('log').innerHTML = '';
    };

    window.log = function (message) {
        document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + '<br>' + message;
    };
}
