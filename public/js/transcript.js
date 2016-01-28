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
  var keyWhitelist = /^[a-zA-Z0-9]+$/;
  
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
    var selection = editor.getSelection();
    var range = selection.getRanges();
    var nodes = selection.getNative();

    // if space key is pressed in an <a>, jump to end instead of splitting
    if (e.data.keyCode == 32)
    {
      var word = selection.getStartElement();
      if (word.is('a')) {
        range[0].moveToPosition(word, CKEditor.POSITION_AFTER_END);
        selection.selectRanges(range);
        return false;
      }
      return true;
    }

    // if text is selected
    if (selection.getSelectedText().length > 0)
    {
      // if delete or backspace key is pressed, wrap in <span class="hidden">
      if (e.data.keyCode == 46 || e.data.keyCode == 8)
      {
        editor.applyStyle(new CKEditor.style({
          element: 'span',
          attributes: {'class': 'hidden'},
          parentRule: function(e) { return e.is('p'); },
          childRule: function(e) { return e.is('a'); }
        }));
        refresh();
        return false;
      }
      else if (keyWhitelist.test(String.fromCharCode(e.data.keyCode)))
      {
        // get start and end of selection
        var startElement = $(nodes.baseNode.parentElement);
        var endElement = $(nodes.focusNode.parentElement);
        if (!endElement.is('a')) endElement = $(nodes.extentNode.parentElement);

        // if selection is not <a>, continue as normal
        if (!startElement.is('a') && !endElement.is('a')) return true;

        // if only one thing selected, continue as normal
        if (startElement.is(endElement)) {
          startElement.removeClass('unsure');
          return true;
        }

        // if start and end are different types, stop
        if (startElement.prop('tagName') != endElement.prop('tagName'))
          return false;

        // otherwise, overwrite multiple words with one, retaining the correct
        // timestamps
        var start = startElement.data('start');
        var end = endElement.data('end');
        var next = endElement.data('next');
        editor.insertHtml('<a data-start="'+start+
                          '" data-end="'+end+
                          '" data-next="'+next+'">'+
                          '</a>', 'unfiltered_html');
        startElement.remove();
        endElement.replaceWith(' ');
        return true;
      }
    }
    else
    {
      selection.getStartElement().removeClass('unsure');
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
    if (loadedAsset)
    {
      // add double-click handler to undo
      $('#transcript span.hidden').dblclick(function() {
        $(this).replaceWith($(this).html());
        refresh();
      });
      Preview.updateHTML(editor.getData(), loadedAsset);
    }
    else {
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

