define([
  'underscore',
  'backbone'
], function(_, Backbone)
{
  var editModel = Backbone.Model.extend({
    idAttribute: '_id'
  });
  return editModel;
});
