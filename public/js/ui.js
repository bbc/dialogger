define([
  'jquery',
  'serialize',
  'semantic',
  'transcript',
  'preview',
  'collections/assets',
  'collections/edits'
], function($, Serialize, Semantic, Transcript, Preview, AssetsCollection, EditsCollection)
{
  var initialize = function() {
    var leftSidebar = $('.left.sidebar')
    .sidebar({
        exclusive: false,
        transition: 'overlay',
        dimPage: false
    })
    .sidebar('attach events', '#leftButton')
    .sidebar('attach events', '#uploadButton', 'show');

    var rightSidebar = $('.right.sidebar')
    .sidebar({
        exclusive: false,
        transition: 'overlay',
        dimPage: false
    })
    .sidebar('attach events', '#rightButton')
    .sidebar('attach events', '#saveButton', 'show');

    var bottomSidebar = $('.bottom.sidebar')
    .sidebar({
        exclusive: false,
        closable: false,
        dimPage: false,
        onVisible: function() {
          $('.pusher').css('margin-bottom','169px');
        },
        onHide: function() {
          $('.pusher').css('margin-bottom','0');
        }
    })
    .sidebar('attach events', '#previewButton');

    $('#playButton').click(function() {
      Transcript.play();
    });
    $('#stopButton').click(function() {
      Transcript.stop();
    });
    $('#boldButton').click(function() {
      Transcript.bold();
    });
    $('#italicButton').click(function() {
      Transcript.italic();
    });
    $('#saveButton').click(function() {
      Transcript.save();
    });

    $('#exportSubmit').click(function() {
      $('#exportForm .submit').click();
    });

    // test for success variable in JSON response
    $.fn.api.settings.successTest = function(response) {
      if(response && response.success) {
        return response.success;
      }
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
      onSuccess: function(response) {
        $('#exportForm').form('reset');
        $('#exportModal').modal('hide');
        EditsCollection.set($('#exportForm').data('id'), 'jobid', response.jobid);
        EditsCollection.set($('#exportForm').data('id'), 'ready', false);
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
      },
      onFailure: function(response) {
        alert('Error: '+response);
      }
    });

    setInterval(AssetsCollection.fetch, 5000);
  };
  return {
    initialize: initialize
  };
});
