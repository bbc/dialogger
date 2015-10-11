define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'text!templates/assetsList.html',
  'transcript'
], function($, _, Backbone, AssetsCollection, assetsListTemplate, Transcript)
{
  var instance;
  var AssetsListView = Backbone.View.extend({
    el: '#assetsList',
    template: _.template(assetsListTemplate),
    events: {
      'click a': 'clicked'
    },
    clicked: function(e) {
      var id = $(e.currentTarget).data('id');
      var model = this.collection.get(id);
      model.set({selected: true});
      this.render();
      Transcript.load(id);
    },
    initialize: function() {
      this.collection = AssetsCollection.initialize();
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
      this.render();
    },
    render: function() {
      this.$el.find('.asset').remove();
      this.$el.prepend(this.template({collection: this.collection.toJSON()}));
    }
  });
 
  var initialize = function() {
    instance = new AssetsListView(); 
  };
  return {initialize: initialize};
});
