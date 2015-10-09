define([
  'underscore',
  'backbone'
], function(_, Backbone)
{
  var editModel = Backbone.Model.extend({
    url: '/api/edits/1'
  });
  return editModel;
});
