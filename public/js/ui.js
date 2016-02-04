define([
  'jquery',
  'semantic',
  'transcript',
  'preview',
  'collections/assets',
  'collections/edits'
], function($, Semantic, Transcript, Preview, AssetsCollection, EditsCollection)
{
  var playbackEnd = function() {
    $('#playButton i:first').removeClass('pause').addClass('play');
  };
  var play = function(rate, onEnd) {
    if (Transcript.refresh()) {
      Preview.play(rate, onEnd);
      $('#playButton i:first').removeClass('play').addClass('pause');
    }
  };
  var pause = function() {
    Preview.pause();
    playbackEnd();
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
      if ($('#playButton i:first').hasClass('play')) play(1, playbackEnd);
      else pause();
    });
    $('#forwardButton').click(function() {
      play(2, playbackEnd);
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
    hideVideo: hideVideo,
    play: play,
    pause: pause
  };
});
