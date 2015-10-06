define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'text!templates/assetsList.html'
], function($, _, Backbone, AssetsCollection, assetsListTemplate)
{
  var assetsListView = Backbone.View.extend({
    el: '#assetsList',
    template: _.template(assetsListTemplate),
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
