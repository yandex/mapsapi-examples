ymaps.ready(init);

function init () {
    // Перечень возможных глифов.
    var glyphNames = ['asterisk', 'plus', 'euro', 'eur', 'minus', 'cloud', 'envelope',
        'pencil', 'glass', 'music', 'search', 'heart', 'star', 'star-empty', 'user', 'film',
        'th-large', 'th', 'th-list', 'ok', 'remove', 'zoom-in', 'zoom-out', 'off', 'signal',
        'cog', 'trash', 'home', 'file', 'time', 'road', 'download-alt', 'download', 'upload', 'inbox',
        'play-circle', 'repeat', 'refresh', 'list-alt', 'lock', 'flag', 'headphones', 'volume-off',
        'volume-down', 'volume-up', 'qrcode', 'barcode', 'tag', 'tags', 'book', 'bookmark', 'print',
        'camera', 'font', 'bold', 'italic', 'text-height', 'text-width', 'align-left', 'align-center',
        'align-right', 'align-justify', 'list', 'indent-left', 'indent-right', 'facetime-video',
        'picture', 'map-marker', 'adjust', 'tint', 'edit', 'share', 'check', 'move', 'step-backward',
        'fast-backward', 'backward', 'play', 'pause', 'stop', 'forward', 'fast-forward', 'step-forward',
        'eject', 'chevron-left', 'chevron-right', 'plus-sign', 'minus-sign', 'remove-sign', 'ok-sign',
        'question-sign', 'info-sign', 'screenshot', 'remove-circle', 'ok-circle', 'ban-circle', 'arrow-left',
        'arrow-right', 'arrow-up', 'arrow-down', 'share-alt', 'resize-full', 'resize-small', 'exclamation-sign',
        'gift', 'leaf', 'fire', 'eye-open', 'eye-close', 'warning-sign', 'plane', 'calendar', 'random', 'comment',
        'magnet', 'chevron-up', 'chevron-down', 'retweet', 'shopping-cart', 'folder-close', 'folder-open',
        'resize-vertical', 'resize-horizontal', 'hdd', 'bullhorn', 'bell', 'certificate', 'thumbs-up', 'thumbs-down',
        'hand-right', 'hand-left', 'hand-up', 'hand-down', 'circle-arrow-right', 'circle-arrow-left', 'circle-arrow-up',
        'circle-arrow-down', 'globe', 'wrench', 'tasks', 'filter', 'briefcase', 'fullscreen', 'dashboard', 'paperclip',
        'heart-empty', 'link', 'phone', 'pushpin', 'usd', 'gbp', 'sort', 'sort-by-alphabet', 'sort-by-alphabet-alt',
        'sort-by-order', 'sort-by-order-alt', 'sort-by-attributes', 'sort-by-attributes-alt', 'unchecked', 'expand',
        'collapse-down', 'collapse-up', 'log-in', 'flash', 'log-out', 'new-window', 'record', 'save', 'open', 'saved',
        'import', 'export', 'send', 'floppy-disk', 'floppy-saved', 'floppy-remove', 'floppy-save', 'floppy-open',
        'credit-card', 'transfer', 'cutlery', 'header', 'compressed', 'earphone', 'phone-alt', 'tower', 'stats', 'sd-video',
        'hd-video', 'subtitles', 'sound-stereo', 'sound-dolby', 'sound-5-1', 'sound-6-1', 'sound-7-1', 'copyright-mark',
        'registration-mark', 'cloud-download', 'cloud-upload', 'tree-conifer', 'tree-deciduous', 'cd', 'save-file', 'open-file',
        'level-up', 'copy', 'paste', 'alert', 'equalizer', 'king', 'queen', 'pawn', 'bishop', 'knight', 'baby-formula', 'tent',
        'blackboard', 'bed', 'apple', 'erase', 'hourglass', 'lamp', 'duplicate', 'piggy-bank', 'scissors', 'bitcoin', 'btc', 'xbt',
        'yen', 'jpy', 'ruble', 'rub', 'scale', 'ice-lolly', 'ice-lolly-tasted', 'education', 'option-horizontal', 'option-vertical',
        'menu-hamburger', 'modal-window', 'oil', 'grain', 'sunglasses', 'text-size', 'text-color', 'text-background', 'object-align-top',
        'object-align-bottom', 'object-align-horizontal', 'object-align-left', 'object-align-vertical', 'object-align-right',
        'triangle-right', 'triangle-left', 'triangle-bottom', 'triangle-top', 'console', 'superscript', 'subscript', 'menu-left',
        'menu-right', 'menu-down', 'menu-up'];

    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
    myMap.geoObjects
        .add(new ymaps.Placemark([55.684758, 37.738521], {}, {
            preset: 'islands#glyphIcon',
            //задаём имя глифа
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)],
            //задаём цвет глифа
            iconGlyphColor: 'blue',
            //задаём цвет метки
            iconColor: 'blue'
        }))
        .add(new ymaps.Placemark([55.833436, 37.715175], {}, {
            preset: 'islands#glyphCircleIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)]
        }))
        .add(new ymaps.Placemark([55.687086, 37.529789], {}, {
            preset: 'islands#blueGlyphIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)]
        }))
        .add(new ymaps.Placemark([55.782392, 37.614924], {}, {
            preset: 'islands#redGlyphCircleIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)]
        }))
        .add(new ymaps.Placemark([55.642063, 37.656123], {}, {
            preset: 'islands#glyphIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)],
            iconGlyphColor: 'green',
            iconColor: 'green'
        }))
        .add(new ymaps.Placemark([55.826479, 37.487208], {}, {
            preset: 'islands#glyphCircleIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)],
            iconGlyphColor: 'green',
            iconColor: 'green'
        }))
        .add(new ymaps.Placemark([55.694843, 37.435023], {}, {
            preset: 'islands#glyphIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)],
            iconGlyphColor: '#0095b6',
            iconColor: '#0095b6'
        }))
        .add(new ymaps.Placemark([55.790139, 37.814052], {}, {
            preset: 'islands#glyphCircleIcon',
            iconGlyph: glyphNames[Math.round(Math.random() * glyphNames.length)],
            iconGlyphColor: '#3caa3c',
            iconColor: '#3caa3c'
        }));
   console.log(glyphNames[Math.round(Math.random() * glyphNames.length)]);
}
