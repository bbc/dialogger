define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'collections/edits',
  'views/editsList',
  'text!templates/assetsList.html',
  'transcript',
  'notification',
  'ui',
  'utils'
], function($, _, Backbone, AssetsCollection, EditsCollection, EditsListView,
  assetsListTemplate, Transcript, Notification, UI, Utils)
{
  var instance;
  var updateDropdown = function(id, view) {
    $('#'+id+' .ui.dropdown').dropdown({
      action: function(text, value) {
        if (text==='Rename') view.rename(id);
        else if (text==='Delete') view.destroy(id);
        else if (text==='Edit with digital pen') view.print(id);
        $(this).dropdown('hide');
      }
    });
  };
  var AssetsListView = Backbone.View.extend({
    el: '#assetsList',
    template: _.template(assetsListTemplate),
    events: {
      'click .header a': 'open'
    },
    open: function(e) {
      if (Utils.checkSaved(Transcript.hasChanged())) return;
      var id = $(e.currentTarget).closest('.asset').data('id');
      var model = this.collection.get(id);
      model.fetch({
        success: function(model, response, options) {
          if (response[0].info.video_tracks) UI.showVideo();
          else UI.hideVideo();
          Transcript.load(response[0], 'json', './api/assets/preview/'+id);
          UI.updateName(response[0].name);
          AssetsCollection.deselect();
          EditsCollection.deselect();
          model.set({selected: true});
        }
      });
    },
    assetReady: function(model) {
      if (model.attributes.ready) Notification.notify(model.attributes.name+' is ready');
    },
    assetError: function(model) {
      if (model.attributes.error) Notification.notify(model.attributes.name+' failed');
    },
    rename: function(id) {
      var collection = this.collection;
      var name = collection.get(id).attributes.name;
      var newName = prompt('Please enter a name for this file', name);
      if (newName != null && newName != '' && newName != name) {
        $.ajax({
          url: './api/assets/'+id,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({name: newName}),
          success: function() {
            collection.fetch();
            EditsCollection.fetch();
          },
          error: Utils.ajaxError
        });
      }
    },
    print: function(id) {
      $('#printForm').data('id', id);
      $('#printModal').modal('show');
    },
    destroy: function(id) {
      var collection = this.collection;
      var name = collection.get(id).attributes.name;
      $('#deleteName').html(name);
      $('#deleteModal').modal({
        closable: false,
        onApprove: function() {
          $.ajax({
            url: './api/assets/'+id,
            method: 'DELETE',
            success: function() {
              collection.fetch();
              EditsCollection.fetch();
              Transcript.unload();
            },
            error: Utils.ajaxError
          });
        }
      }).modal('show');
    },
    initialize: function() {
      this.collection = AssetsCollection.initialize();
      this.listenTo(this.collection, 'add', this.add);
      this.listenTo(this.collection, 'remove', this.remove);
      this.listenTo(this.collection, 'change', this.change);
      this.listenTo(this.collection, 'change:ready', this.assetReady);
      this.listenTo(this.collection, 'change:error', this.assetError);
      this.listenToOnce(this.collection, 'sync', EditsListView.initialize);
      this.collection.fetch();
      this.render();
    },
    add: function(model) {
      this.$el.prepend(this.template({model: model.toJSON()}));
      updateDropdown(model.id, this);
    },
    remove: function(model) {
      $('#'+model.id).remove();
    },
    change: function(model) {
      $('#'+model.id).replaceWith(this.template({model: model.toJSON()}));
      updateDropdown(model.id, this);
    }
  });
 
  var initialize = function() {
    instance = new AssetsListView(); 
  };
  return {initialize: initialize};
});
