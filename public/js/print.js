define([
  'jquery',
  'serialize',
  'semantic',
  'collections/assets',
  'collections/edits',
  'utils'
], function($, Serialize, Semantic, AssetsCollection, EditsCollection, Utils)
{
  var formSubmitted = function()
  {
    $('#printModal').modal('hide');
    alert('Transcript sent to printer. Please go and collect your printout.');
    EditsCollection.fetch();
  };
  var initialize = function()
  {
    $('#printForm .checkbox').checkbox();
    $('#printForm .ui.dropdown').dropdown();

    // send the form when submit is clicked
    $('#printSubmit').click(function() {
      $('#printForm .submit').click();
    });

    // configure form validation
    $('#printForm')
    .form({
      fields: {
        delete: 'empty',
        threshold: 'number'
      }
    })
    // configure form submission
    .api({
      url: './api/assets/pen/{id}',
      method: 'POST',
      serializeForm: true,
      onSuccess: formSubmitted,
      onFailure: Utils.ajaxError
    });
  };
  return {
    initialize: initialize
  };
});
