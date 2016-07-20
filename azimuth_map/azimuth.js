ymaps.modules.define('projection.Azimuth', [
    'util.defineClass',
    'util.math.cycleRestrict',
    'coordSystem.Cartesian'
], function (provide, defineClass, cycleRestrict, CoordSystemCartesian) {
    /**
     * @fileOverview
     * Азимутальная проекция.
     */

    var latLongOrder = ymaps.meta.coordinatesOrder != 'longlat';

    /**
     * Создает азимутальную проекцию.
     * Размер области в пикселях всегда NxN, где N = 256 * 2^zoom.
     *
     * @name projection.Azimuth
     * @class Азимутальная проекция.
     * Учитывает параметр coordorder загрузки API.
     * @augments IProjection
     * @param {Object[]} [center=[128, 128]] Массив из пиксельных координат центра карты (северный или южный географический полюс).
     * @param {Number}  [latRatio=0.71111111111111] Количество градусов широты содержащееся в 1 пикселе на 0-м зуме.
     * @param {Number}  [offsetAngle=0] Положительный угол смещения нулевого меридиана на карте по часовой стрелке.
     * @param {Number}  [southPole=false] Cеверный или южный географический полюс, true - если северный.
     * @param {Number|Number[]} [scale=1] Масштаб одного деления на оси. Может быть числом или парой чисел для каждой из осей.
     */
    function Azimuth(center, latRatio, offsetAngle, southPole, scale) {
        if (ymaps.meta.debug) {
            if (!center[0] || !center[1]) {
                throw new Error("projection.Azimuth: Некорректные значения параметра center. Координаты центра должны быть заданы.");
            }
        }

        this._mapPixelCenter = center ? center : [128, 128];

        this._southPole = southPole ? southPole : false;

        this._latRatio = latRatio ? latRatio : 0.71111111111111;

        this._offsetAngle = offsetAngle ? offsetAngle : 0;

        this._coordSystem = new CoordSystemCartesian(scale);
    }

    defineClass(Azimuth, {
        toGlobalPixels: function (point, zoom) {
            if (ymaps.meta.debug) {
                if (!point) {
                    throw new Error("Azimuth.toGlobalPixels: не передан параметр point");
                }
                if (typeof zoom == "undefined") {
                    throw new Error("Azimuth.toGlobalPixels: не передан параметр zoom");
                }
            }

            var mapPixelCenter = this._mapPixelCenter,
                latRatio = this._latRatio,
                southPole = this._southPole,
                offsetAngle = this._offsetAngle,
                longitude = cycleRestrict(point[latLongOrder ? 1 : 0] + offsetAngle, -180, 180),
                latitude = point[latLongOrder ? 0 : 1],
                centerX = mapPixelCenter[0] * Math.pow(2, zoom),
                centerY = mapPixelCenter[1] * Math.pow(2, zoom),
                radius = ((southPole ? -90 : 90) - latitude) * Math.pow(2, zoom) * latRatio,
                x = centerX + radius * Math.sin(longitude * Math.PI / 180),
                y = centerY + radius * Math.cos(longitude * Math.PI / 180);
            return [x, y];
        },

        fromGlobalPixels: function (point, zoom) {
            var x = point[0],
                y = point[1],
                mapPixelCenter = this._mapPixelCenter,
                latRatio = this._latRatio,
                southPole = this._southPole,
                offsetAngle = this._offsetAngle,
                centerX = mapPixelCenter[0] * Math.pow(2, zoom),
                centerY = mapPixelCenter[1] * Math.pow(2, zoom),
                longitude = cycleRestrict(Math.atan2(x - centerX, y - centerY) * 180 / Math.PI + offsetAngle, -180, 180),
                latitude = 90 - ( Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / (Math.pow(2, zoom) * latRatio)),
                latitude = (southPole ? -latitude : latitude);
            return latLongOrder ? [latitude, longitude] : [longitude, latitude];
        },

        isCycled: function () {
            return [false, false];
        }
    });

    provide(Azimuth);
});