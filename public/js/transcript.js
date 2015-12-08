define([
  'jquery',
  'ckeditor',
  'utils',
  'preview',
  'collections/assets',
  'collections/edits'
], function($, CKEditor, Utils, Preview, AssetsCollection, EditsCollection)
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
      // process transcript
      var words = Utils.HTMLtoWords(editor.getData());
      var edit = {
        transcript: {words: words},
        html: editor.getData(),
        edl: Utils.wordsToEDL(words)
      };

      // if saving existing edit
      if (loadedEdit)
      {
        // set up AJAX
        method = 'PUT';
        url = '/api/edits/'+loadedEdit._id;

      // if saving new edit
      } else if (loadedAsset)
      {
        // ask for description
        var description = window.prompt('Please enter a description of your edit','');
        if (description == null || description === '') return;

        // set up AJAX
        method = 'POST';
        url = '/api/edits';
        edit.name = loadedAsset.name;
        edit.assetid = loadedAsset._id;
        edit.description = description;
      } else {
        return;
      }

      // deselect current asset
      AssetsCollection.deselect();

      // send AJAX request
      $.ajax(url, {
        data: JSON.stringify(edit),
        contentType: 'application/json',
        method: method,
        success: function (data) {
          EditsCollection.fetch();
        },
        error: Utils.ajaxError
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
      })
      .fail(Utils.ajaxError);
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
      })
      .fail(Utils.ajaxError);
    }
  }; 

  var wordClick = function(e) {
    var start = $(e.data.selection.getStartElement())[0].data('start');
    Preview.seekOrig(start/1000);
  };

  var keyHandler = function(e)
  {
    if (e.data.keyCode == 46) {
      e.cancel();
      var html = editor.getSelectedHtml(true);
      if ($(html).length > 0) {
        $(html).find('a').each(function() {
          $(this).removeClass('played');
        });
        editor.insertHtml('<span class="hidden">'+html+'</span>');
        editor.getSelection().removeAllRanges();
        if (Preview.isPlaying()) {
          pause();
          play(Preview.getRate());
        } else {
          stop();
        }
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
  var play = function(rate) {
    if (loadedAsset) {
      Preview.updateHTML(editor.getData(), loadedAsset._id);
    } else if (loadedEdit) {
      Preview.updateHTML(editor.getData(), loadedEdit.asset);
    } else {
      return;
    }
    Preview.play(rate);
  };
  var pause = function() {
    Preview.pause();
  };
  var stop = function() {
    Preview.stop();
    Preview.updatePosition();
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

