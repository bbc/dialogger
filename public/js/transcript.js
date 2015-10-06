define([
  'jquery',
  'ckeditor-jquery',
], function($, CKEditor)
{
  var editor;
  var update = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        editor.setData(data[0].transcript.text);
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
    editor: editor,
    initialize: initialize,
    update: update
  };
});

