define([
  'jquery',
  'semantic',
  'transcript',
  'collections/assets',
  'collections/edits'
], function($, Semantic, Transcript, AssetsCollection, EditsCollection)
{
  var playbackEnd = function() {
    $('#playButton i:first').removeClass('pause').addClass('play');
  };
  var initialize = function() {
    var leftSidebar = $('.left.sidebar')
    .sidebar({
        exclusive: false,
        transition: 'overlay',
        dimPage: false
    })
    .sidebar('attach events', '#leftButton')
    .sidebar('attach events', '#uploadButton', 'show');

    var rightSidebar = $('.right.sidebar')
    .sidebar({
        exclusive: false,
        transition: 'overlay',
        dimPage: false
    })
    .sidebar('attach events', '#rightButton')
    .sidebar('attach events', '#saveButton', 'show');

    $('.top.fixed.menu .ui.dropdown').dropdown();

    $('#playButton').click(function() {
      if ($('#playButton i:first').hasClass('play')) {
        Transcript.play(1, playbackEnd);
        $('#playButton i:first').removeClass('play').addClass('pause');
      } else {
        Transcript.pause();
        playbackEnd();
      }
    });
    $('#forwardButton').click(function() {
      Transcript.play(2, playbackEnd);
      $('#playButton i:first').removeClass('play').addClass('pause');
    });
    $('#saveButton').click(function() {
      EditsCollection.save(Transcript.save());
    });

    // TODO Remove the need for regular polling
    setInterval(AssetsCollection.fetch, 5000);
  };
  var showVideo = function() {
    $('#preview').addClass('visible');
  };
  var hideVideo = function() {
    $('#preview').removeClass('visible');
  };
  return {
    initialize: initialize,
    showVideo: showVideo,
    hideVideo: hideVideo
  };
});
