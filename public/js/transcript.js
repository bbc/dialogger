define([
  'jquery',
  'ckeditor-jquery',
  'utils'
], function($, CKEditor, Utils)
{
  var editor;

  var bold = function() {
    editor.execCommand('bold');
  };

  var italic = function() {
    editor.execCommand('italic');
  };

  var update = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        editor.setData(Utils.transcriptToHTML(data[0].transcript));
      });
    }
  }; 
  var initialize = function() {
    editor = $('#transcript').ckeditor({
      skin: 'discourse',
      height: '500px',
      removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link',
      resize_enabled: false,
      /*keystrokes: [
        [8, 'strike'], //backspace
        [46, 'strike'] //delete
      ],*/
      extraAllowedContent: 'strong s a [*]{*}',
      on: {
        instanceReady: function(evt) {
          editor = evt.editor;
        }
      }
    });
    console.log(editor);
  };
  return {
    initialize: initialize,
    update: update,
    bold: bold,
    italic: italic
  };
});

