define([
  'jquery',
  'videocompositor',
  'utils'
], function($, VideoCompositor, Utils)
{
  var instance;
  var refresh;
  var initialize = function() {
    instance = new VideoCompositor($('#preview')[0]); 
    instance.addEventListener('play', playHandler);
    instance.addEventListener('ended', endedHandler);
  };
  var updateHTML = function(html, id) {
    var playlist = Utils.edlToPlaylist(
                     Utils.wordsToEDL(
                       Utils.HTMLtoWords(html)), '/api/assets/preview/'+id);
    instance.playlist = playlist;
  };
  var updateWords = function(words, id) {
    playlist = Utils.edlToPlaylist(
                 Utils.wordsToEDL(words), '/api/assets/preview/'+id);
    instance.playlist = playlist;
  };
  var play = function() {
    instance.play();
  };
  var pause = function() {
    instance.pause();
  };
  var stop = function() {
    instance.pause();
    seek(0);
  };
  var seek = function(time) {
    instance.currentTime = time;
  };
  var seekOrig = function(origTime) {
    var edits = instance.playlist.tracks[0];
    for (var i=0; i<edits.length; i++) {
      if (origTime >= edits[i].sourceStart &&
           (i==edits.length-1 || origTime < edits[i+1].sourceStart)) {
        seek(origTime-edits[i].sourceStart+edits[i].start);
      }
    }
  };
  var playHandler = function() {
    refresh = setInterval(function() {
      var time = instance.currentTime * 1000;
      $('#transcript a').each(function() {
        if ($(this).data('start') < time) $(this).addClass('played');
      });
    }, 250);
  };
  var endedHandler = function() {
    clearInterval(refresh);
  };
  return {
    initialize: initialize,
    updateHTML: updateHTML,
    updateWords: updateWords,
    play: play,
    pause: pause,
    stop: stop,
    seek: seek,
    seekOrig: seekOrig
  };
});
