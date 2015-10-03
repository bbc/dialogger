Dropzone.options.uploadForm = {
  clickable: '#uploadButton',
  previewTemplate: $('#uploadItem').html(),
  addedfile: function(file) {
    leftSidebar.show();
    file.previewElement = $(this.options.previewTemplate);
    $(file.previewElement).find('.header').text(file.name);
    $('#assetsList').append(file.previewElement);
  },
  error: function(file) {
    $(file.previewElement).remove();
    $(file.previewElement).find('i').removeClass('blue').addClass('red');
    $(file.previewElement).find('.description').text('Upload failed')
  },
  uploadprogress: function(file, progress, bytesSent) {
    $(file.previewElement).find('.progress').attr('data-percent', progress);
    $(file.previewElement).find('.bar').css('width', progress+'%');
  },
  success: function(file, res) {
    $(file.previewElement).remove();
    assets.fetch();
  },
  processing: function(){},
  sending: function(){},
  complete: function(){},
  cancelled: function(){},
  maxfilesreached: function(){},
  maxfilesexceeded: function(){},
  thumbnail: function(){}
};
