define([
  'jquery',
  'ckeditor-jquery',
  'utils'
], function($, CKEditor, Utils)
{
  var editor;

  var update = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        editor.setData(Utils.transcriptToHTML(data[0].transcript));
      });
    }
  }; 
  var initialize = function() {
    editor = $('#transcript').ckeditor({
      keystrokes: [
        [8, 'strike'], //backspace
        [46, 'strike'] //delete
      ],
      extraAllowedContent: 'a [*]{*}',
      on: {
        instanceReady: function(evt) {
          editor = evt.editor;
        }
      }
    });
  };
  return {
    initialize: initialize,
    update: update
  };
});

