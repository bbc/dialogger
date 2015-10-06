define([
  'underscore',
  'backbone'
], function(_, Backbone)
{
  var assetModel = Backbone.Model.extend({
    url: '/api/assets/1'
  });
  return assetModel;
});
