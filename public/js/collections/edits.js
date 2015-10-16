define([
  'underscore',
  'backbone',
  'models/edits'
], function(_, Backbone, EditsModel){
  var instance;
  var EditsCollection = Backbone.Collection.extend({
    url: '/api/edits',
    model: EditsModel
  });
  var initialize = function() {
    instance = new EditsCollection();
    return instance;
  };
  var fetch = function() {
    instance.fetch();
  };
  var set = function(id, field, value) {
    instance.get(id).set(field, value);
  };
  return {
    initialize: initialize,
    fetch: fetch,
    set: set
  };
});

