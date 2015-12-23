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
  var bold = function() { editor.execCommand('bold'); };
  var italic = function() { editor.execCommand('italic'); };
  var defaultData = '<p>&nbsp;</p><p align="center">Please open a media asset or edit to start.</p>';
  
  var save = function() {
    if (editor)
    {
      // process transcript
      var words = Utils.HTMLtoWords(editor.getData());
      var edit = {
        transcript: {words: words},
        html: editor.getData(),
        edl: Utils.wordsToEDL(words)
      };
      return edit;
    }
  };

  var load = function(transcript, format, assetUrl) {
    if (editor) {
      loadedAsset = assetUrl;

      // load new transcript
      if (format == 'json') {
        editor.setData(Utils.transcriptToHTML(transcript));
      } else if (format == 'html') {
        editor.setData(transcript);
      } else {
        return -1;
      }
      refresh();
      editor.resetUndo();

      // stop playback
      Preview.pause();
      Preview.seek(0);
    }
  };

  var unload = function() {
    load(defaultData, 'html', null);
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
      allowedContent: 'a p span[*](*); strong',
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
      Preview.updateHTML(editor.getData(), loadedAsset);
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
    load: load,
    unload: unload,
    save: save,
    bold: bold,
    italic: italic,
    play: play,
    pause: pause,
    stop: stop
  };
});

