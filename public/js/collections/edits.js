define([
  'underscore',
  'backbone',
  'utils',
  'collections/assets',
  'models/edits'
], function(_, Backbone, Utils, AssetsCollection, EditsModel){
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
    instance.fetch({ error: Utils.ajaxError });
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
      return saveAs(edit);
    } else {
      model.set('edl', edit.edl);
      model.set('html', edit.html);
      model.set('transcript', edit.transcript);
      model.save();
      return true;
    }
  };
  var saveAs = function(edit) {
    // add asset details
    var asset = AssetsCollection.getSelected();
    if (asset === undefined) {
      var selectedEdit = instance.findWhere({selected: true});
      edit.asset = selectedEdit.get('asset');
      edit.name = selectedEdit.get('name');
    } else {
      edit.asset = asset.id;
      edit.name = asset.get('name');
    }

    // ask user for description
    var description = window.prompt('Please enter a description of your edit','');
    if (description == null || description === '') {
      alert('You must enter a description to save.');
      return false;
    }
    edit.description = description;

    // create edit
    model = new EditsModel(edit);
    instance.add(model);
    model.save();

    return true;
  };
  return {
    initialize: initialize,
    fetch: fetch,
    set: set,
    unset: unset,
    deselect: deselect,
    save: save,
    saveAs: saveAs
  };
});

