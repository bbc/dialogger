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

    var bottomSidebar = $('.bottom.sidebar')
    .sidebar({
        exclusive: false,
        closable: false,
        dimPage: false,
        onVisible: function() {
          $('.pusher').addClass('preview');
        },
        onHide: function() {
          $('.pusher').removeClass('preview');
        }
    })
    .sidebar('attach events', '#previewButton');

    $('.top.fixed.menu .ui.dropdown').dropdown();

    $('#playButton').click(function() {
      if ($('#playButton i:first').hasClass('play')) {
        Transcript.play(1);
        $('#playButton i:first').removeClass('play').addClass('pause');
      } else {
        Transcript.pause();
        $('#playButton i:first').removeClass('pause').addClass('play');
      }
    });
    $('#forwardButton').click(function() {
      if ($('#playButton i:first').hasClass('play')) {
        Transcript.play(2);
        $('#playButton i:first').removeClass('play').addClass('pause');
      } else {
        Transcript.pause();
        $('#playButton i:first').removeClass('pause').addClass('play');
      }
    });
    $('#stopButton').click(function() {
      Transcript.stop();
      $('#playButton i:first').removeClass('pause').addClass('play');
    });
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
