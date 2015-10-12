define([
  'jquery',
  'underscore',
  'backbone',
  'collections/assets',
  'text!templates/assetsList.html',
  'transcript',
  'notification'
], function($, _, Backbone, AssetsCollection, assetsListTemplate, Transcript,
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
      var id = $(e.currentTarget).data('id');
      Transcript.loadAsset(id);
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
    initialize: function() {
      this.collection = AssetsCollection.initialize();
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.collection, 'change:ready', this.assetReady);
      this.listenTo(this.collection, 'change:error', this.assetError);
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
