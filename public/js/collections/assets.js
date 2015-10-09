define([
  'underscore',
  'backbone',
  'models/assets'
], function(_, Backbone, AssetsModel){
  var instance;
  var AssetsCollection = Backbone.Collection.extend({
    url: '/api/assets',
    model: AssetsModel
  });
  var initialize = function() {
    instance = new AssetsCollection();
    return instance;
  };
  var fetch = function() {
    instance.fetch();
  };
  return {initialize: initialize};
});

