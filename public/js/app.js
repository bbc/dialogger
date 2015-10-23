define([
  'jquery',
  'upload',
  'ui',
  'transcript',
  'preview',
  'views/assetsList',
  'views/editsList',
  'views/user'
], function($, Upload, UI, Transcript, Preview, AssetsListView, EditsListView, UserView)
{
  var initialize = function(){
    AssetsListView.initialize();
    EditsListView.initialize();
    UserView.initialize();
    Upload.initialize();
    Transcript.initialize();
    UI.initialize();
    Preview.initialize();
    setInterval(AssetsListView.fetch, 5000);
  }
  return {
    initialize: initialize
  };
});
