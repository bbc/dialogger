define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'collections/edits',
  'text!templates/editsList.html',
  'transcript'
], function($, _, Backbone, AssetsCollection, EditsCollection, EditsListTemplate, Transcript)
{
  var instance;
  var EditsListView = Backbone.View.extend({
    el: '#editsList',
    template: _.template(EditsListTemplate),
    events: {
      'click .header a': 'open',
      'click .right button': 'exportEdit'
    },
    open: function(e) {
      var id = $(e.currentTarget).closest('.edit').data('id');
      Transcript.loadEdit(id);
      AssetsCollection.deselect();
      EditsCollection.deselect();
      EditsCollection.set(id, 'selected', true);
      this.render();
    },
    exportEdit: function(e) {
      var id = $(e.currentTarget).closest('.edit').data('id');
      var model = this.collection.get(id);
      if (model.get('jobid') && model.get('ready')) {
        window.open('/api/edits/export/'+model.get('jobid'), '_blank');
        model.unset('jobid');
        model.unset('ready');
      } else if (!model.get('jobid')) {
        var name = this.collection.get(id).get('name');
        $('#exportForm').data('id', id);
        $('#exportName').val(name);
        $('#exportModal').modal('show');
      }
    },
    rename: function(id) {
      var collection = this.collection;
      var name = collection.get(id).attributes.name;
      var newName = prompt('Please enter a name for this edit', name);
      if (newName != null && newName != '' && newName != name) {
        $.ajax({
          url: '/api/edits/'+id,
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
            url: '/api/edits/'+id,
            method: 'DELETE',
            success: function() { collection.fetch(); }
          });
        }
			}).modal('show');
    },
    initialize: function() {
      this.collection = EditsCollection.initialize();
      this.listenTo(this.collection, 'sync change', this.render);
      this.collection.fetch();
      this.render();
    },
    render: function() {
      var view = this;
      this.$el.find('.edit').remove();
      this.$el.prepend(this.template({collection: this.collection.toJSON()}));
      $('#editsList .ui.dropdown').dropdown({
        action: function(text, value) {
          var id = $(this).closest('.edit').data('id');
          if (text==='Rename') view.rename(id);
          else if (text==='Delete') view.destroy(id);
          $(this).dropdown('hide');
        }
      });
    }
  });
  var initialize = function() {
    instance = new EditsListView();
  };
  return {initialize: initialize};
});
