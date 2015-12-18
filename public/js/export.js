define([
  'jquery',
  'serialize',
  'semantic',
  'collections/edits',
  'utils'
], function($, Serialize, Semantic, EditsCollection, Utils)
{
  var formatExt = {
    'video': 'mp4',
    'audio': 'wav',
    'aes31': 'adl',
    'aes31zip': 'zip',
    'startrack': 'dat'
  };
  var initialize = function()
  {
    $('#exportFormat').dropdown({
      onChange: function(val) {
        $('#exportAudio').hide();
        $('#exportVideo').hide();
        if (val == 'video') $('#exportVideo').show();
        if (val == 'audio') $('#exportAudio').show();
        $('#exportExt').html('.'+formatExt[val]);
      }
    });
    $('#exportVideo .dropdown').dropdown();
    $('#exportAudio .dropdown').dropdown();

    $('#exportSubmit').click(function() {
      $('#exportForm .submit').click();
    });

    // test for success variable in JSON response
    $.fn.api.settings.successTest = function(response) {
      if(response && response.success) return response.success;
      return false;
    };

    // configure API endpoint
    $.fn.api.settings.api = {
      'export': '/api/edits/export/{id}'
    };

    // configure form validation
    $('#exportForm')
    .form({
      fields: {
        name: 'empty'
      }
    })
    // configure form submission
    .api({
      action: 'export',
      method: 'POST',
      serializeForm: true,
      // add 'k' to bitrate submission
      beforeSend: function(settings) {
        if (settings.data.video.vb) settings.data.video.vb += 'k';
        if (settings.data.video.ab) settings.data.video.ab += 'k';
        if (settings.data.audio.ab) settings.data.audio.ab += 'k';
        settings.data.name += $('#exportExt').html();
        return settings;
      },
      onSuccess: formSubmitted,
      onFailure: Utils.ajaxError
    });
  };
  var formSubmitted = function(response)
  {
    // reset and hide form
    $('#exportForm').form('reset');
    $('#exportModal').modal('hide');

    // update edit collection
    EditsCollection.set($('#exportForm').data('id'), 'jobid', response.jobid);
    EditsCollection.set($('#exportForm').data('id'), 'ready', false);

    // check regularly for export completion
    var checker = setInterval(function() {
      $.ajax({
        url: '/api/edits/export/status/'+response.jobid,
        statusCode: {
          200: function() {
            clearInterval(checker);
            EditsCollection.set($('#exportForm').data('id'), 'ready', true);
          },
          500: function() {
            clearInterval(checker);
            alert('An error occured with the export process.');
          }
        }
      });
    }, 5000);
  };
  return {
    initialize: initialize
  };
});

