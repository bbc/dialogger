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
        Preview.updateHTML(data[0].html, data[0].asset);
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

  var keyHandler = function(e)
  {
    if (e.data.keyCode == 8 || e.data.keyCode == 46) {
      var html = editor.getSelectedHtml(true);
      if ($(html).length == 0) {
        //console.log(editor.getSelection().getStartElement());
        //console.log(editor.getSelection().getSelectedElement());
        //console.log(editor.getSelection().getRanges()[0]);
        //console.log(editor.getSelection().getRanges()[1]);
        if (!editor.getSelection().getStartElement().is('a')) {
          console.log('Removing text');
        } else {
          console.log('Doing nothing');
          e.cancel();
        }
      } else {
        editor.insertHtml('<span class="hidden">'+html+'</span>');
        e.cancel();
      }
    }
  };

  var change = function(e) {
    $('#transcript span.hidden').dblclick(function() {
      $(this).replaceWith($(this).html());
    });
  };

  var initialize = function() {
    editor = CKEditor.inline('transcript', {
      removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link',
      resize_enabled: false,
      allowedContent: true,
      on: {
        selectionChange: wordClick,
        change: change,
        key: keyHandler
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
  var pause = function() {
    Preview.pause();
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
    pause: pause,
    stop: stop
  };
});

