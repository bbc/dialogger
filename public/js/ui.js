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
    // change speaker name handler
    $('#transcript p').unbind('dblclick');
    $('#transcript p').dblclick(function(e) {
      if (e.offsetX < -10) {
        var response = prompt('Please enter speaker name', $(this).data('speaker'));
        if (response) $(this).attr('data-speaker', response);
      }
    });
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
  var updateDuration = function(duration) {
    var mins = parseInt(duration/60);
    var secs = parseInt(duration%60);
    $('#duration').text((mins<10?'0'+mins:mins)+':'+(secs<10?'0'+secs:secs));
  };
  var updateName = function(name) {
    $('#loadedName').text(name);
  };
  return {
    initialize: initialize,
    play: play,
    pause: pause,
    showVideo: showVideo,
    hideVideo: hideVideo,
    updateDuration: updateDuration,
    updateName: updateName
  };
});
