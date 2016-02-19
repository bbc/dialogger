define([
  'jquery',
  'semantic',
  'transcript',
  'preview',
  'collections/assets',
  'collections/edits'
], function($, Semantic, Transcript, Preview, AssetsCollection, EditsCollection)
{
  var speakerPrompt = function(element)
  {
    // set up speaker modal
    $('#speakerName').val($(element).attr('data-speaker'));
    if ($(element).hasClass('M')) $('#speakerM').checkbox('check');
    else $('#speakerF').checkbox('check');
    $('#speakerPropogate').checkbox('uncheck');
    $('#speakerName')[0].select();

    // show speaker modal and handle response
    $('#speakerModal').modal({
      onApprove: function() {
        var target = $(element);
        if ($('#speakerPropogate').checkbox('is checked'))
          target = $("p[data-speaker='"+$(element).attr('data-speaker')+"']");

        target.attr('data-speaker', $('#speakerName').val());
        if ($('#speakerM').checkbox('is checked'))
          target.removeClass('F').addClass('M');
        else
          target.removeClass('M').addClass('F');
      }
    }).modal('show');
  };
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
      if (e.offsetX < -10) speakerPrompt(this);
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

    $('.ui.checkbox').checkbox();

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
