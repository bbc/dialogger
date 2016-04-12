define([
  'underscore',
  'backbone',
  'collections/assets',
  'models/edits'
], function(_, Backbone, AssetsCollection, EditsModel){
  var instance;
  var EditsCollection = Backbone.Collection.extend({
    url: './api/edits',
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
  var unset = function(id, field) {
    instance.get(id).unset(field);
  };
  var deselect = function() {
    instance.invoke('set', {'selected': false});
  };
  var save = function(edit) {
    var model = instance.findWhere({selected: true});
    if (!model) {
      // add asset details
      var asset = AssetsCollection.getSelected();
      edit.asset = asset.id;
      edit.name = asset.get('name');

      // ask user for description
      var description = window.prompt('Please enter a description of your edit','');
      if (description == null || description === '') return alert('You must enter a description to save.');
      edit.description = description;

      // create edit
      model = new EditsModel(edit);
      instance.add(model);
      model.save();
    } else {
      model.set('edl', edit.edl);
      model.set('html', edit.html);
      model.set('transcript', edit.transcript);
      model.save();
    }
  };
  return {
    initialize: initialize,
    fetch: fetch,
    set: set,
    unset: unset,
    deselect: deselect,
    save: save
  };
});

