define([
  'underscore',
  'backbone',
], function(_, Backbone)
{
  var userModel = Backbone.Model.extend({
    url: '/api/user'
  });
  return userModel;
});
