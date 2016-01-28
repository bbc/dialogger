define([
  'jquery',
  'serialize',
  'semantic',
  'collections/assets',
  'utils'
], function($, Serialize, Semantic, AssetsCollection, Utils)
{
  var initialize = function()
  {
    $('#printForm .checkbox').checkbox();
  };
  return {
    initialize: initialize
  };
});
