ymaps.modules.define('projection.LambertConformalConic', [
    'util.defineClass',
    'util.math.cycleRestrict',
    'coordSystem.geo',
    'meta'
], function (provide, defineClass, cycleRestrict, CoordSystemGeo, meta) {
    /**
     * @fileOverview
     * Равноугольная коническая проекция Ламберта.
     */

    var latLongOrder = meta.coordinatesOrder != 'longlat';

    /**
     * Создает равноугольную коническую проекцию Ламберта.
     *
     * @name projection.LambertConformalConic
     * @class Равноугольная коническая проекция Ламберта.
     * Учитывает параметр coordorder, заданный при подключении API.
     * @augments IProjection
     */
    function LambertConformalConic() {
        if (ymaps.meta.debug) {
            if (!center[0] || !center[1]) {
                throw new Error("projection.AzimuthalPolarEquidistant: Некорректные значения параметра center.");
            }
        }

        this._degToRad = function (point) {
            return point * Math.PI / 180;
        };

        // Широта и долгота точки, которая служит началом координат в декартовой системе проекции
        this._fi0 = this._degToRad(0);
        this._l0 = this._degToRad(-2);

        // Стандартные параллели.
        this._fi1 = this._degToRad(70);
        this._fi2 = this._degToRad(40);
    }

    defineClass(LambertConformalConic, {
        toGlobalPixels: function (point, zoom) {
            if (ymaps.meta.debug) {
                if (!point) {
                    throw new Error("AzimuthalPolarEquidistant.toGlobalPixels: не передан параметр point");
                }
                if (typeof zoom == "undefined") {
                    throw new Error("AzimuthalPolarEquidistant.toGlobalPixels: не передан параметр zoom");
                }
            }

            // Широта и долгота точки на поверхности Земли.
            var fi = this._degToRad(point[latLongOrder ? 0 : 1]);
            var l = this._degToRad(point[latLongOrder ? 1 : 0]);

            var n = (Math.log(Math.cos(this._fi1) / Math.cos(this._fi2))) / (Math.log(Math.tan(0.25 * Math.PI + 0.5 * this._fi2) / Math.tan(0.25 * Math.PI + 0.5 * this._fi1)));
            var F = (Math.cos(this._fi1) * Math.pow(Math.tan(0.25 * Math.PI + 0.5 * this._fi1), n)) / (n);
            var p = F * Math.pow(1 / Math.tan(0.25 * Math.PI + 0.5 * fi), n);
            var p0 = F * Math.pow(1 / Math.tan(0.25 * Math.PI + 0.5 * this._fi0), n);

            // Декартовы координаты той же точки на проекции.
            var x = p0 - p * Math.cos(n * (l - this._l0));
            var y = p * Math.sin(n * (l - this._l0));

            x = x * 128 * Math.pow(2, zoom);
            y = y * 128 * Math.pow(2, zoom);

            return [x, y];
        },
        // Если вам необходимо переводить глобальные пиксельные координаты в широту и долготу, то вам необходимо
        // реализовать этот метод. Например, это может понадобиться если вы захотите воспользоваться линейкой.
        fromGlobalPixels: function (point, zoom) {
            return [0, 0];
        },

        isCycled: function () {
            return [false, false];
        },

        getCoordSystem: function () {
            return CoordSystemGeo;
        }
    });

    provide(LambertConformalConic);
});
