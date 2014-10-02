ymaps.ready(init);

function init() {
    // Даже если пользователь коснется элемента на экране планшета, такие события, как
    // 'touchstart', 'touchmove' и прочие, будут преобразованы в единый список событий.
    // Это позволяет писать кроссплатформенный код и не задумываться о типе устройства.
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