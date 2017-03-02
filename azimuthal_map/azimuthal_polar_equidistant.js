ymaps.modules.define('projection.AzimuthalPolarEquidistant', [
    'util.defineClass',
    'util.math.cycleRestrict',
    'coordSystem.geo'
], function (provide, defineClass, cycleRestrict, CoordSystemGeo) {
    /**
     * @fileOverview
     * Azimuth projection.
     */

    var latLongOrder = ymaps.meta.coordinatesOrder != 'longlat';

    /**
     * Creates a polar azimuthal equidistant projection.
     * The size of the area in pixels is always NxN, where N = 256 * 2^zoom.
     *
     * @name projection.AzimuthalPolarEquidistant
     * @class Polar azimuthal equidistant projection.
     * Uses the 'coordorder' parameter that is set when enabling the API.
     * @augments IProjection
     * @param {Number[]} [center=[128, 128]] Array of pixel coordinates for the map center (the north or south geographical pole).
     * @param {Number}  [latRatio=0.71111111111111] Number of latitude degrees contained in one pixel at the 0 zoom.
     * @param {Number}  [offsetAngle=0] Positive angle of offset from the zero meridian on the map, clockwise.
     * @param {Boolean}  [southPole=false] North or south geographical pole. Set false if north.
     */
    function AzimuthalPolarEquidistant(center, latRatio, offsetAngle, southPole) {
        if (ymaps.meta.debug) {
            if (!center[0] || !center[1]) {
                throw new Error("projection.AzimuthalPolarEquidistant: Invalid values for the 'center' parameter.");
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
                    throw new Error("AzimuthalPolarEquidistant.toGlobalPixels: omitted 'point' parameter");
                }
                if (typeof zoom == "undefined") {
                    throw new Error("AzimuthalPolarEquidistant.toGlobalPixels: omitted 'zoom' parameter");
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
        },

        getCoordSystem: function () {
            return CoordSystemGeo;
        }
    });

    provide(AzimuthalPolarEquidistant);
});
