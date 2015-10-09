define([
  'jquery',
  'upload',
  'ui',
  'transcript',
  'views/assetsList',
  'views/editsList',
  'views/user'
], function($, Upload, UI, Transcript, AssetsListView, EditsListView, UserView)
{
  var initialize = function(){
    AssetsListView.initialize();
    EditsListView.initialize();
    UserView.initialize();
    Upload.initialize();
    Transcript.initialize();
    UI.initialize();
    setInterval(AssetsListView.fetch, 5000);
  }
  return {
    initialize: initialize
  };
});
