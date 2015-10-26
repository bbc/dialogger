define([
  'jquery',
  'videocompositor',
  'utils'
], function($, VideoCompositor, Utils)
{
  var instance;
  var initialize = function() {
    instance = new VideoCompositor($('#preview')[0]); 
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
