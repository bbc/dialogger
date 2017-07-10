define([
  'jquery',
  'upload',
  'export',
  'ui',
  'transcript',
  'preview',
  'views/assetsList',
  'views/editsList',
  'views/user'
], function($, Upload, Export, UI, Transcript, Preview, AssetsListView, EditsListView, UserView)
{
  var initialize = function(){
    AssetsListView.initialize();
    UserView.initialize();
    Upload.initialize();
    Export.initialize();
    Transcript.initialize({
      id: 'transcript',
      play: UI.play,
      pause: UI.pause,
      seek: Preview.seekOrig,
      edl: Preview.updateEDL,
      speakers: UI.updateSpeakers
    });
    UI.initialize();
    Preview.initialize({
      duration: UI.updateDuration
    });
  }
  return {
    initialize: initialize
  };
});
