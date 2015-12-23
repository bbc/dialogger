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
        loadedEdit = data[0];
        loadedAsset = null;
        editor.setData(data[0].html);
        refresh();
        editor.resetUndo();
      })
      .fail(Utils.ajaxError);
    }
  };

  var loadAsset = function(id) {
    if (editor) {
      $.getJSON('/api/assets/'+id, function(data) {
        loadedAsset = data[0];
        loadedEdit = null;
        editor.setData(Utils.transcriptToHTML(data[0]));
        refresh();
        editor.resetUndo();
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
    // if delete key is pressed
    if (e.data.keyCode == 46) {
      e.cancel();

      // wrap selection in <span class="hidden">
      editor.applyStyle(new CKEditor.style({
        element: 'span',
        attributes: {'class': 'hidden'},
        parentRule: function(e) { return e.is('p'); },
        childRule: function(e) { return e.is('a'); }
      }));

      // add double-click handler to undo
      $('#transcript span.hidden').dblclick(function() {
        $(this).replaceWith($(this).html());
        refresh();
      });

      // update playlist
      refresh();
    }
  };

  var change = function() {
    // if the transcript is editied, update the playlist
    refresh();
  };

  var initialize = function() {
    editor = CKEditor.inline('transcript', {
      removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link',
      resize_enabled: false,
      allowedContent: true,
      //allowedContent: 'a p span[*](*); strong',
      title: false,
      coreStyles_bold: {
        element: 'strong',
        overrides: 'b',
        childRule: function(e) { return !e.is('a'); }
      },
      on: {
        selectionChange: wordClick,
        change: change,
        key: keyHandler
      }
    });
  };
  var refresh = function() {
    if (loadedAsset) {
      Preview.updateHTML(editor.getData(), loadedAsset._id);
    } else if (loadedEdit) {
      Preview.updateHTML(editor.getData(), loadedEdit.asset);
    } else {
      return false;
    }
    return true;
  };
  var play = function(rate, onEnd) {
    if (refresh()) Preview.play(rate, onEnd);
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

