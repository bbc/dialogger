define([
  'jquery',
  'underscore',
  'backbone',
  'collections/edits',
  'text!templates/editsList.html',
  'transcript'
], function($, _, Backbone, EditsCollection, EditsListTemplate, Transcript)
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
      var id = $(e.currentTarget).data('id');
      Transcript.loadEdit(id);
      var model = this.collection.get(id);
      model.set({selected: true});
      this.render();
    },
    exportEdit: function(e) {
      var id = $(e.currentTarget).data('id');
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
    initialize: function() {
      this.collection = EditsCollection.initialize();
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.collection, 'change:ready', this.render);
      this.collection.fetch();
      this.render();
    },
    render: function() {
      this.$el.find('.edit').remove();
      this.$el.prepend(this.template({collection: this.collection.toJSON()}));
    }
  });
  var initialize = function() {
    instance = new EditsListView();
  };
  return {initialize: initialize};
});
