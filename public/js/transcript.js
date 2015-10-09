define([
  'jquery',
  'ckeditor',
  'utils',
  'collections/edits'
], function($, CKEditor, Utils, EditsCollection)
{
  var editor;
  var loadedAsset;
  var loadedEdit;

  var bold = function() {
    editor.execCommand('bold');
  };

  var italic = function() {
    editor.execCommand('italic');
  };
  
  var save = function() {
    if (loadedAsset) {
      var edit = {
        name: loadedAsset.name,
        description: window.prompt('Please enter a description of your edit',''),
        assetid: loadedAsset._id,
        transcript: {words: Utils.HTMLtoTranscript(editor.getData())}
      };
      $.ajax('/api/edits', {
        data: JSON.stringify(edit),
        contentType: 'application/json',
        method: 'POST',
        success: function (data) {
          EditsCollection.fetch();
        }
      });
    }
  };

  var load = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        editor.setData(Utils.transcriptToHTML(data[0].transcript));
        editor.resetUndo();
        loadedAsset = data[0];
      });
    }
  }; 

  var exportEdit = function() {
    alert('EXPORTING');
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
    exportEdit: exportEdit,
    save: save,
    bold: bold,
    italic: italic
  };
});

