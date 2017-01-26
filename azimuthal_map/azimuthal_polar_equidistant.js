ymaps.modules.define('projection.AzimuthalPolarEquidistant', [
    'util.defineClass',
    'util.math.cycleRestrict',
    'coordSystem.geo',
    'meta'
], function (provide, defineClass, cycleRestrict, CoordSystemGeo, meta) {
    /**
     * @fileOverview
     * Азимутальная проекция.
     */

    var latLongOrder = meta.coordinatesOrder != 'longlat';

    /**
     * Создает полярную азимутальную эквидистантную проекцию.
     * Размер области в пикселях всегда NxN, где N = 256 * 2^zoom.
     *
     * @name projection.AzimuthalPolarEquidistant
     * @class Полярная азимутальная эквидистантная проекция.
     * Учитывает параметр coordorder, заданный при подключении API.
     * @augments IProjection
     * @param {Number[]} [center=[128, 128]] Массив из пиксельных координат центра карты (северный или южный географический полюс).
     * @param {Number}  [latRatio=0.71111111111111] Количество градусов широты, содержащееся в 1 пикселе на 0-м зуме.
     * @param {Number}  [offsetAngle=0] Положительный угол смещения нулевого меридиана на карте по часовой стрелке.
     * @param {Boolean}  [southPole=false] Cеверный или южный географический полюс, true - если южный.
     */
    function AzimuthalPolarEquidistant(center, latRatio, offsetAngle, southPole) {
        if (ymaps.meta.debug) {
            if (!center[0] || !center[1]) {
                throw new Error("projection.AzimuthalPolarEquidistant: Некорректные значения параметра center.");
            }
        }

        this._mapPixelCenter = center ? center : [128, 128];

        this._southPole = Boolean(southPole);

        this._latRatio = latRatio ? latRatio : 0.71111111111111;

        this._offsetAngle = offsetAngle ? offsetAngle : 0;
    }

    defineClass(AzimuthalPolarEquidistant, {
        toGlobalPixels: function (point, zoom) {
            if (ymaps.meta.debug) {
                if (!point) {
                    throw new Error("AzimuthalPolarEquidistant.toGlobalPixels: не передан параметр point");
                }
                if (typeof zoom == "undefined") {
                    throw new Error("AzimuthalPolarEquidistant.toGlobalPixels: не передан параметр zoom");
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
                x = centerX + radius * Math.sin(longitude * Math.PI / 180) * (southPole ? -1 : 1),
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
                longitude = cycleRestrict((southPole ? 180 : 0) + Math.atan2(x - centerX, y - centerY) * (southPole ? -180 : 180) / Math.PI + offsetAngle, -180, 180),
                latitude = 90 - ( Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / (Math.pow(2, zoom) * latRatio)),
                latitude = (southPole ? -latitude : latitude);
            return latLongOrder ? [latitude, longitude] : [longitude, latitude];
        },

        isCycled: function () {
            return [false, false];
        },

        getCoordSystem: function () {
            return CoordSystemGeo;
        }
    });

    provide(AzimuthalPolarEquidistant);
});