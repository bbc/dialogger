define([
  'jquery',
  'ckeditor',
  'utils'
], function($, CKEditor, Utils)
{
  var editor;
  var loadedId;

  var bold = function() {
    editor.execCommand('bold');
  };

  var italic = function() {
    editor.execCommand('italic');
  };
  
  var save = function() {
    if (loadedId) {
      console.log(editor.getData());
      console.log(loadedId);
    }
  };

  var load = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        editor.setData(Utils.transcriptToHTML(data[0].transcript));
        editor.resetUndo();
        loadedId = id;
      });
    }
  }; 
  var initialize = function() {
    editor = CKEditor.inline('transcript', {
      height: '500px',
      removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link',
      resize_enabled: false,
      /*keystrokes: [
        [8, 'strike'], //backspace
        [46, 'strike'] //delete
      ],*/
      allowedContent: true
    });
  };
  return {
    initialize: initialize,
    load: load,
    save: save,
    bold: bold,
    italic: italic
  };
});

