define([
  'jquery',
  'underscore',
  'backbone',
  'models/user'
], function($, _, Backbone, UserModel)
{
  var userView = Backbone.View.extend({
    el: '#userView',
    initialize: function() {
      this.model = new UserModel();
      this.listenTo(this.model, 'sync', this.render);
      this.model.fetch();
      this.render();
    },
    render: function() {
      this.$el.html('<i class="user icon"></i>'+this.model.get('username'));
    }
  });
  return userView;
});

