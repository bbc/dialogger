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
  var bold = function() { editor.execCommand('bold'); };
  var italic = function() { editor.execCommand('italic'); };
  
  var save = function() {
    if (editor && (loadedAsset || loadedEdit))
    {
      var method = 'PUT';
      var edit = {
        transcript: {words: Utils.HTMLtoTranscript(editor.getData())},
        html: editor.getData()
      };
      if (loadedAsset) {
        method = 'POST';
        edit.name = loadedAsset.name;
        edit.assetid = loadedAsset._id;
        edit.description = window.prompt('Please enter a description of your edit','');
      }
      $.ajax('/api/edits', {
        data: JSON.stringify(edit),
        contentType: 'application/json',
        method: method,
        success: function (data) {
          EditsCollection.fetch();
        }
      });
    }
  };

  var loadEdit = function(id) {
    if (editor) {
      $.getJSON('/api/edits/'+id, function(data) {
        editor.setData(data[0].html);
        editor.resetUndo();
        loadedEdit = data[0];
        loadedAsset = null;
      });
    }
  };

  var loadAsset = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        editor.setData(Utils.transcriptToHTML(data[0]));
        editor.resetUndo();
        loadedAsset = data[0];
        loadedEdit = null;
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
    loadAsset: loadAsset,
    loadEdit: loadEdit,
    save: save,
    bold: bold,
    italic: italic
  };
});

