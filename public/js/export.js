define([
  'jquery',
  'serialize',
  'semantic',
  'collections/edits',
  'utils'
], function($, Serialize, Semantic, EditsCollection, Utils)
{
  // map field values to file extension
  var extMap = {
    'mp4': 'mp4',
    'pcm_s16le': 'wav',
    'aes31': 'adl',
    'aes31incl': 'zip',
    'dira': 'dat',
    'diraincl': 'dat'
  };

  // update file extension
  var updateExtension = function()
  {
    var ext='';
    // video extensions
    if ($('select[name=format]').val() == 'video') {
      ext=extMap[$("select[name='video[f]']").val()];
    // audio extensions
    } else if ($('select[name=format]').val() == 'audio') {
      ext=extMap[$("select[name='audio[acodec]']").val()];
    // EDL extensions (+included media)
    } else {
      var include='';
      if ($("input[name='edlconfig[include]']").is(':checked')) include='incl';
      ext=extMap[$("select[name='edlconfig[format]']").val()+include];
    }
    $('#exportExt').html('.'+ext);
  };

  var initialize = function()
  {
    // logic for showing/hiding different settings
    $('#exportFormat').dropdown({
      onChange: function(val) {
        $('#exportAudio').hide();
        $('#exportVideo').hide();
        $('#exportEDL').hide();
        if (val == 'video') $('#exportVideo').show();
        if (val == 'audio') $('#exportAudio').show();
        if (val == 'edl') $('#exportEDL').show();
        updateExtension();
      }
    });

    // update filename extension on each change
    $('#exportVideo,#exportAudio,#exportEDL .dropdown').dropdown({
      onChange: function() {
        updateExtension();
      }
    });
    $('#exportEDL .checkbox').checkbox({
      onChange: function() {
        updateExtension();
      }
    });
    $('#exportModal').modal({
      onShow: updateExtension
    });

    // send the form when submit is clicked
    $('#exportSubmit').click(function() {
      $('#exportForm .submit').click();
    });

    // test for success variable in JSON response
    $.fn.api.settings.successTest = function(response) {
      if(response && response.success) return response.success;
      return false;
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
      url: '/api/edits/export/{id}',
      method: 'POST',
      serializeForm: true,
      beforeSend: function(settings) {
        // add 'k' to bitrate submission
        if (settings.data.video.vb) settings.data.video.vb += 'k';
        if (settings.data.video.ab) settings.data.video.ab += 'k';
        if (settings.data.audio.ab) settings.data.audio.ab += 'k';
        // add extension to filename
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
            EditsCollection.unset($('#exportForm').data('id'), 'ready');
            EditsCollection.unset($('#exportForm').data('id'), 'jobid');
            alert('An error occured with the export process.');
          }
        }
      });
    }, 5000);
  };
  return {
    initialize: initialize,
    updateExtension: updateExtension
  };
});

