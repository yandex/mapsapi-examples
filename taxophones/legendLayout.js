ymaps.modules.define('layout.LegendItem', [
    'layout.storage',
    'templateLayoutFactory'
], function (provide,
             layoutStorage, templateLayoutFactory) {

    var LegendItemLayout = templateLayoutFactory.createClass(
        "<div class='listBoxItem'><div class='color' style='background-color: {{data.color}}; float:left;'></div><div class='text'>{{data.content}}</div></div>");

    layoutStorage.add('default#legendItem', LegendItemLayout);
    provide(LegendItemLayout);
});
