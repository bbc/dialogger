define([
  'jquery',
  'upload',
  'ui',
  'transcript',
  'views/assetsList',
  'views/user'
], function($, Upload, UI, Transcript, AssetsListView, UserView)
{
  var initialize = function(){
    var viewAssetsList = new AssetsListView();
    var viewUser = new UserView();
    Upload.initialize();
    UI.initialize();
    Transcript.initialize();
  }
  return {
    initialize: initialize
  };
});
