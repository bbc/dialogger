define([
  'jquery',
  'serialize',
  'semantic',
  'collections/assets',
  'utils'
], function($, Serialize, Semantic, AssetsCollection, Utils)
{
  var formSubmitted = function()
  {
    alert('Sent to print system');
  };
  var initialize = function()
  {
    $('#printForm .checkbox').checkbox();

    // send the form when submit is clicked
    $('#printSubmit').click(function() {
      $('#printForm .submit').click();
    });

    // configure form validation
    $('#printForm')
    .form({
      fields: {
        delete: 'empty'
      }
    })
    // configure form submission
    .api({
      url: '/api/assets/pen/{id}',
      method: 'GET',
      serializeForm: true,
      onSuccess: formSubmitted,
      onFailure: Utils.ajaxError
    });
  };
  return {
    initialize: initialize
  };
});
