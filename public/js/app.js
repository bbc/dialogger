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
    EditsListView.initialize();
    UserView.initialize();
    Upload.initialize();
    Export.initialize();
    Transcript.initialize();
    UI.initialize();
    Preview.initialize();
  }
  return {
    initialize: initialize
  };
});
