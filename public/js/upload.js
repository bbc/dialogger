define([
  'jquery',
  'dropzone',
  'text!templates/upload.html',
  'collections/assets',
  'notification',
  'utils'
], function($, Dropzone, UploadTemplate, AssetsCollection, Notification, Utils)
{
  var initialize = function() {
    Dropzone.autoDiscover = false;
    $('#uploadForm').dropzone({
      clickable: '#uploadButton',
      previewTemplate: UploadTemplate,
      maxFilesize: 2000,
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
        Utils.uploadError();
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

