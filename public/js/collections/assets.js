define([
  'underscore',
  'backbone',
  'models/assets'
], function(_, Backbone, AssetsModel){
  var AssetsCollection = Backbone.Collection.extend({
    url: '/api/assets',
    model: AssetsModel
  });
  return AssetsCollection;
});

