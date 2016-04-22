define([
  'underscore',
  'backbone',
  'utils',
  'models/assets'
], function(_, Backbone, Utils, AssetsModel){
  var instance;
  var AssetsCollection = Backbone.Collection.extend({
    url: './api/assets',
    model: AssetsModel
  });
  var initialize = function() {
    instance = new AssetsCollection();
    return instance;
  };
  var get = function(id, field) {
    return instance.get(id).get(field);
  };
  var getSelected = function() {
    return instance.findWhere({selected: true});
  };
  var fetch = function() {
    instance.fetch({
      success: Utils.ajaxSuccess,
      error: Utils.ajaxError
    });
  };
  var deselect = function() {
    instance.invoke('set', {'selected': false});
  };
  return {
    initialize: initialize,
    fetch: fetch,
    deselect: deselect,
    get: get,
    getSelected: getSelected
  };
});

