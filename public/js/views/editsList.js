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
      'click .right a': 'exportEdit'
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
      $.ajax('/api/edits/export/'+id, {
        data: '',
        contentType: 'application/json',
        method: 'POST',
        success: function(data) {
          alert(data.jobid);
        }
      });
    },
    initialize: function() {
      this.collection = EditsCollection.initialize();
      this.listenTo(this.collection, 'sync', this.render);
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
