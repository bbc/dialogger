define([
  'jquery',
  'dropzone',
  'text!templates/upload.html',
  'collections/assets',
  'notification'
], function($, Dropzone, UploadTemplate, AssetsCollection, Notification)
{
  var initialize = function() {
    $('#uploadForm').dropzone({
      clickable: '#uploadButton',
      previewTemplate: UploadTemplate,
      addedfile: function(file) {
        file.previewElement = $(this.options.previewTemplate);
        $(file.previewElement).find('.header').text(file.name);
        $('#assetsList').append(file.previewElement);
        Notification.getPermission();
      },
      error: function(file) {
        $(file.previewElement).remove();
        $(file.previewElement).find('i').removeClass('blue').addClass('red');
        $(file.previewElement).find('.description').text('Upload failed');
        Notification.notify('Upload of '+file.name+' failed');
      },
      uploadprogress: function(file, progress, bytesSent) {
        $(file.previewElement).find('.progress').attr('data-percent', progress);
        $(file.previewElement).find('.bar').css('width', progress+'%');
      },
      success: function(file, res) {
        $(file.previewElement).remove();
        AssetsCollection.fetch();
      },
      processing: function(){},
      sending: function(){},
      complete: function(){},
      cancelled: function(){},
      maxfilesreached: function(){},
      maxfilesexceeded: function(){},
      thumbnail: function(){}
    });
  };
  return {
    initialize: initialize
  };
});

