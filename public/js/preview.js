define([
  'jquery',
  'videocompositor',
  'utils'
], function($, VideoCompositor, Utils)
{
  var instance;
  var refresh;
  var playing = false;
  var initialize = function() {
    instance = new VideoCompositor($('#preview')[0]); 
    instance.addEventListener('play', playHandler);
    instance.addEventListener('pause', pauseHandler);
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
  var play = function(rate) {
    instance.playbackRate = rate;
    instance.play();
  };
  var pause = function() {
    instance.pause();
  };
  var stop = function() {
    instance.pause();
    seek(0);
  };
  var isPlaying = function() {
    return playing;
  };
  var seek = function(time) {
    instance.currentTime = time;
  };
  var seekOrig = function(origTime) {
    seek(getPlaylistTime(origTime));
  };
  var getPlaylistTime = function(origTime) {
    var edits = instance.playlist.tracks[0];
    for (var i=0; i<edits.length; i++) {
      if (origTime >= edits[i].sourceStart &&
          origTime < edits[i].sourceStart+edits[i].duration) {
        return origTime - edits[i].sourceStart + edits[i].start;
      }
    }
    return -1;
  };
  var playHandler = function() {
    playing = true;
    refresh = setInterval(updatePosition, 100);
  };
  var pauseHandler = function() {
    playing = false;
    clearInterval(refresh);
    updatePosition();
  };
  var updatePosition = function() {
    var time = instance.currentTime;
    $('#transcript a').each(function() {
      if (getPlaylistTime($(this).data('start')/1000) < time)
        $(this).addClass('played');
      else
        $(this).removeClass('played');
    });
  };
  return {
    initialize: initialize,
    updateHTML: updateHTML,
    updateWords: updateWords,
    play: play,
    pause: pause,
    stop: stop,
    seek: seek,
    seekOrig: seekOrig,
    updatePosition: updatePosition,
    isPlaying: isPlaying
  };
});
