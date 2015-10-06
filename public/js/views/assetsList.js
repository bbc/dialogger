define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'text!templates/assetsList.html',
  'transcript'
], function($, _, Backbone, AssetsCollection, assetsListTemplate, Transcript)
{
  var assetsListView = Backbone.View.extend({
    el: '#assetsList',
    template: _.template(assetsListTemplate),
    events: {
      'click a': 'clicked'
    },
    clicked: function(e) {
      var id = $(e.currentTarget).data('id');
      Transcript.update(id);
    },
    initialize: function() {
      this.collection = new AssetsCollection();
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
      this.render();
    },
    render: function() {
      this.$el.find('.asset').remove();
      this.$el.prepend(this.template({collection: this.collection.toJSON()}));
    }
  });
  return assetsListView;
});
