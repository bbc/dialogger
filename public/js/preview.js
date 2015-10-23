define([
  'jquery',
  'videocompositor'
], function($, VideoCompositor)
{
  var instance;
  var initialize = function() {
    instance = new VideoCompositor($('#preview')[0]); 
    instance.playlist = {
      "tracks":[
        [{type: "video", sourceStart:0, start:0, duration:10, src:"/api/assets/preview/562a3be5304a63a51a32b889", id:"1"},
         {type: "video", sourceStart:30, start:10, duration:10, src:"/api/assets/preview/562a3be5304a63a51a32b889", id:"2"}]
      ]
    };
    instance.play();
  };
  return {
    initialize: initialize
  };
});
