ymaps.ready(function () {
    // An example implementation of a custom control based on inheritance from collection.Item. The
    // control displays the name of the object that is in the center of the map.
    var map = new ymaps.Map("map", {
                center: [55.819543, 37.611619],
                zoom: 6,
                controls: []
            }
        ),
    // Creating a custom class.
        CustomControlClass = function (options) {
            CustomControlClass.superclass.constructor.call(this, options);
            this._$content = null;
            this._geocoderDeferred = null;
        };
    // And inheriting it from the collection.Item.
    ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
        onAddToMap: function (map) {
            CustomControlClass.superclass.onAddToMap.call(this, map);
            this._lastCenter = null;
            this.getParent().getChildElement(this).then(this._onGetChildElement, this);
        },

        onRemoveFromMap: function (oldMap) {
            this._lastCenter = null;
            if (this._$content) {
                this._$content.remove();
                this._mapEventGroup.removeAll();
            }
            CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
        },

        _onGetChildElement: function (parentDomContainer) {
            // Creating an HTML element with the text.
            this._$content = $('<div class="customControl"></div>').appendTo(parentDomContainer);
            this._mapEventGroup = this.getMap().events.group();
            // Requesting data after changing the position of the map.
            this._mapEventGroup.add('boundschange', this._createRequest, this);
            // Immediately requesting the name of the place.
            this._createRequest();
        },

        _createRequest: function() {
            var lastCenter = this._lastCenter = this.getMap().getCenter().join(',');
            // Requesting information about the place by the coordinates of the map center.
            ymaps.geocode(this._lastCenter, {
                // Specifying that the response should be in JSON format.
                json: true,
                // Setting a limit on the number of records in the response.
                results: 1
            }).then(function (result) {
                    // We will only process the response from the last request.
                    if (lastCenter == this._lastCenter) {
                        this._onServerResponse(result);
                    }
                }, this);
        },

        _onServerResponse: function (result) {
            // The data has been received from the server and now it must be displayed. Description
            // of the response in JSON format.
            var members = result.GeoObjectCollection.featureMember,
                geoObjectData = (members && members.length) ? members[0].GeoObject : null;
            if (geoObjectData) {
                this._$content.text(geoObjectData.metaDataProperty.GeocoderMetaData.text);
            }
        }
    });

    var customControl = new CustomControlClass();
    map.controls.add(customControl, {
        float: 'none',
        position: {
            top: 10,
            left: 10
        }
    });
});
