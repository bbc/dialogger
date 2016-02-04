define([
  'jquery',
  'upload',
  'export',
  'print',
  'ui',
  'transcript',
  'preview',
  'views/assetsList',
  'views/editsList',
  'views/user'
], function($, Upload, Export, Print, UI, Transcript, Preview, AssetsListView, EditsListView, UserView)
{
  var initialize = function(){
    AssetsListView.initialize();
    EditsListView.initialize();
    UserView.initialize();
    Upload.initialize();
    Export.initialize();
    Print.initialize();
    Transcript.initialize({
      id: 'transcript',
      play: UI.play,
      pause: UI.pause,
      seek: Preview.seekOrig,
      edl: Preview.updateEDL
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
