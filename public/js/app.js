define([
  'jquery',
  'upload',
  'export',
  'ui',
  'transcript',
  'preview',
  'print',
  'views/assetsList',
  'views/editsList',
  'views/user'
], function($, Upload, Export, UI, Transcript, Preview, Print, AssetsListView, EditsListView, UserView)
{
  var initialize = function(){
    AssetsListView.initialize();
    EditsListView.initialize();
    UserView.initialize();
    Upload.initialize();
    Export.initialize();
    Transcript.initialize({
      id: 'transcript',
      play: UI.play,
      pause: UI.pause,
      seek: Preview.seekOrig,
      edl: Preview.updateEDL
    });
    UI.initialize();
    Print.initialize();
    Preview.initialize({
      duration: UI.updateDuration
    });
  }
  return {
    initialize: initialize
  };
});
