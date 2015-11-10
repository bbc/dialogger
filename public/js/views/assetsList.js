define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'collections/edits',
  'text!templates/assetsList.html',
  'transcript',
  'notification'
], function($, _, Backbone, AssetsCollection, EditsCollection, assetsListTemplate, Transcript,
  Notification)
{
  var instance;
  var AssetsListView = Backbone.View.extend({
    el: '#assetsList',
    template: _.template(assetsListTemplate),
    events: {
      'click .header a': 'open'
    },
    open: function(e) {
      var id = $(e.currentTarget).closest('.asset').data('id');
      Transcript.loadAsset(id);
      AssetsCollection.deselect();
      EditsCollection.deselect();
      var model = this.collection.get(id);
      model.set({selected: true});
      this.render();
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
      var newName = prompt('Please enter a name for the asset', name);
      if (newName != null && newName != '' && newName != name) {
        $.ajax({
          url: '/api/assets/'+id,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({name: newName}),
          success: function() { collection.fetch(); }
        });
      }
    },
    destroy: function(id) {
      var collection = this.collection;
      var name = collection.get(id).attributes.name;
      $('#deleteName').html(name);
			$('#deleteModal').modal({
        closable: false,
        onApprove: function() {
          $.ajax({
            url: '/api/assets/'+id,
            method: 'DELETE',
            success: function() { collection.fetch(); }
          });
        }
			}).modal('show');
    },
    initialize: function() {
      this.collection = AssetsCollection.initialize();
      this.listenTo(this.collection, 'sync change', this.render);
      this.listenTo(this.collection, 'change:ready', this.assetReady);
      this.listenTo(this.collection, 'change:error', this.assetError);
      this.collection.fetch();
      this.render();
    },
    render: function() {
      var view = this;
      this.$el.find('.asset').remove();
      this.$el.prepend(this.template({collection: this.collection.toJSON()}));
      $('#assetsList .ui.dropdown').dropdown({
        action: function(text, value) {
          var id = $(this).closest('.asset').data('id');
          if (text==='Rename') view.rename(id);
          else if (text==='Delete') view.destroy(id);
          $(this).dropdown('hide');
        }
      });
    }
  });
 
  var initialize = function() {
    instance = new AssetsListView(); 
  };
  return {initialize: initialize};
});
