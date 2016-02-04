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
    Transcript.initialize(UI.play, UI.pause, Preview.seekOrig, Preview.updateEDL);
    UI.initialize();
    Preview.initialize();
  }
  return {
    initialize: initialize
  };
});
