define([
  'jquery',
  'semantic',
  'transcript',
  'collections/assets'
], function($, Semantic, Transcript, AssetsCollection)
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

    $('#boldButton').click(function() {
      Transcript.bold();
    });
    $('#italicButton').click(function() {
      Transcript.italic();
    });
    $('#saveButton').click(function() {
      Transcript.save();
    });
    setInterval(AssetsCollection.fetch, 5000);
  };
  return {
    initialize: initialize
  };
});
