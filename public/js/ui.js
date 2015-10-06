define([
  'jquery',
  'semantic'
], function($, Semantic)
{
  var initialize = function() {
    var leftSidebar = $('.left.sidebar')
    .sidebar({
        context: $('.bottom.segment'),
        exclusive: false,
        transition: 'overlay',
        dimPage: false
    })
    .sidebar('attach events', '#leftButton')
    .sidebar('attach events', '#uploadButton', 'show');

    var rightSidebar = $('.right.sidebar')
    .sidebar({
        context: $('.bottom.segment'),
        exclusive: false,
        transition: 'overlay',
        dimPage: false
    })
    .sidebar('attach events', '#rightButton');
  };
  return {
    initialize: initialize
  };
});
