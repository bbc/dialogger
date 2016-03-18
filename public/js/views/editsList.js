define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'collections/edits',
  'text!templates/editsList.html',
  'transcript',
  'ui',
  'utils'
], function($, _, Backbone, AssetsCollection, EditsCollection, EditsListTemplate, Transcript, UI, Utils)
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
      var model = this.collection.get(id);
      model.fetch({
        success: function(model, response, options) {
          var html;
          if (response[0].printed == true) {
            html = Utils.transcriptToHTML(response[0]);
            $('#saveButton').addClass('disabled');
          } else {
            html = response[0].html;
            $('#saveButton').removeClass('disabled');
          }
          Transcript.load(html, 'html', '/api/assets/preview/'+model.get('asset'));
          UI.updateName(response[0].name);
          AssetsCollection.deselect();
          EditsCollection.deselect();
          model.set({selected: true});
        },
        error: function() {
          alert('Not ready yet!');
        }
      });
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
        var description = this.collection.get(id).get('description');
        $('#exportForm').data('id', id);
        $('#exportName').val(description);
        $('#exportModal').modal('show');
      }
    },
    editDescription: function(id) {
      var collection = this.collection;
      var desc = collection.get(id).attributes.description;
      var newDesc = prompt('Please enter a description for this edit', desc);
      if (newDesc != null && newDesc != '' && newDesc != desc) {
        $.ajax({
          url: '/api/edits/'+id,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({description: newDesc}),
          success: function() { collection.fetch(); },
          error: Utils.ajaxError
        });
      }
    },
    destroy: function(id) {
      var collection = this.collection;
      var name = collection.get(id).attributes.name;
      var desc = collection.get(id).attributes.description;
      $('#deleteName').html(name+' ('+desc+')');
      $('#deleteModal').modal({
        closable: false,
        onApprove: function() {
          $.ajax({
            url: '/api/edits/'+id,
            method: 'DELETE',
            success: function() {
              collection.fetch();
              Transcript.unload();
            },
            error: Utils.ajaxError
          });
        }
      }).modal('show');
    },
    newEdit: function(model) {
      model.set('selected', true);
    },
    initialize: function() {
      this.collection = EditsCollection.initialize();
      this.listenTo(this.collection, 'sync change', this.render);
      this.listenTo(this.collection, 'add', this.newEdit);
      this.collection.fetch({reset: true});
      this.render();
    },
    render: function() {
      this.collection.each(function(model) {
        model.set('name', AssetsCollection.get(model.attributes.asset, 'name'));
      });
      var view = this;
      this.$el.find('.edit').remove();
      this.$el.prepend(this.template({collection: this.collection.toJSON()}));
      $('#editsList .ui.dropdown').dropdown({
        action: function(text, value) {
          var id = $(this).closest('.edit').data('id');
          if (text==='Edit description') view.editDescription(id);
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
