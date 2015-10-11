define([
  'underscore',
  'backbone'
], function(_, Backbone)
{
  var assetModel = Backbone.Model.extend({
    idAttribute: '_id'
  });
  return assetModel;
});
