define([
  'jquery',
  'ckeditor',
  'utils',
  'preview',
  'collections/edits'
], function($, CKEditor, Utils, Preview, EditsCollection)
{
  var editor;
  var loadedAsset;
  var loadedEdit;
  var bold = function() { editor.execCommand('bold'); };
  var italic = function() { editor.execCommand('italic'); };
  
  var save = function() {
    var method, url;
    if (editor)
    {
      var words = Utils.HTMLtoWords(editor.getData());
      var edit = {
        transcript: {words: words},
        html: editor.getData(),
        edl: Utils.wordsToEDL(words)
      };
      if (loadedEdit) {
        method = 'PUT';
        url = '/api/edits/'+loadedEdit._id;
      } else if (loadedAsset) {
        method = 'POST';
        url = '/api/edits';
        edit.name = loadedAsset.name;
        edit.assetid = loadedAsset._id;
        edit.description = window.prompt('Please enter a description of your edit','');
      } else {
        return;
      }
      $.ajax(url, {
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
        Preview.updateHTML(data[0].html, id);
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
        Preview.updateHTML(editor.getData(), id);
        editor.resetUndo();
        loadedAsset = data[0];
        loadedEdit = null;
      });
    }
  }; 

  var wordClick = function(e) {
    var start = $(e.data.selection.getStartElement())[0].data('start');
    Preview.seekOrig(start/1000);
  };

  var change = function(e) {
    $('#transcript span.hidden').dblclick(function() {
      $(this).replaceWith($(this).html());
    });
  };

  var initialize = function() {
    editor = CKEditor.inline('transcript', {
      height: '500px',
      removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link',
      resize_enabled: false,
      keystrokes: [
        [8, 'hide'], //backspace
        [46, 'hide'] //delete
      ],
      allowedContent: true,
      on: {
        selectionChange: wordClick,
        change: change,
        key: function(e) { e.stop(); } // prevents competition with browser
      }
    });
    editor.addCommand('hide', {
      exec: function(e) {
        e.insertHtml('<span class="hidden">'+
          e.getSelection().getRanges()[0].cloneContents().getHtml()+
          '</span>');
      }
    });
  };
  var play = function() {
    if (loadedAsset) {
      Preview.updateHTML(editor.getData(), loadedAsset._id);
    } else if (loadedEdit) {
      Preview.updateHTML(editor.getData(), loadedEdit.asset);
    } else {
      return;
    }
    Preview.play();
  };
  var stop = function() {
    Preview.stop();
  };
  return {
    initialize: initialize,
    loadAsset: loadAsset,
    loadEdit: loadEdit,
    save: save,
    bold: bold,
    italic: italic,
    play: play,
    stop: stop
  };
});

