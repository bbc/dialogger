define([
  'jquery',
  'ckeditor',
  'utils'
], function($, CKEditor, Utils)
{
  var editor;
  var loadedAsset;
  var bold = function() { editor.execCommand('bold'); };
  var italic = function() { editor.execCommand('italic'); };
  var defaultData = '<p>&nbsp;</p><p align="center" class="black">Please open a media asset or edit to start.</p>';
  var keyWhitelist = /^[a-zA-Z0-9]+$/;
  var id;
  var play;
  var pause;
  var seek;
  var updateEDL;
  
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
      pause();
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
    }
  };

  var unload = function() {
    load(defaultData, 'html', null);
  };

  var wordClick = function(e) {
    // select entire word
    var selection = editor.getSelection();
    var range = editor.createRange();
    range.setStartAt(selection.getRanges()[0].startContainer, CKEditor.POSITION_AFTER_START);
    range.setEndAt(selection.getRanges()[0].endContainer, CKEditor.POSITION_BEFORE_END);
    //range.setEnd(range.endContainer, range.endOffset - 1);
    editor.getSelection().selectRanges([range]);
  };

  var wordDblClick = function(e) {
    var start = $(editor.getSelection().getRanges()[0].startContainer.$.parentElement).data('start');
    seek(start/1000);
    //play(1.0);
  };

  var keyHandler = function(e)
  {
    // if delete or backspace key is pressed, wrap in <s>
    if (editor.getSelection().getSelectedText().length > 0 && (e.data.keyCode == 46 || e.data.keyCode == 8))
    {
      editor.execCommand('strike');
      pause();
      refresh();
      return false;
    }
/*
    if (e.data.keyCode == 13) {
      var range = editor.createRange();
      range.setStart(
      editor.getSelection().getRanges()[0].
*/

    // find selection details
    var selection = editor.getSelection();
    var range = selection.getRanges()[0];
    var startElement = $(range.startContainer.$.parentElement);
    var endElement = $(range.endContainer.$.parentElement);

    // if more than one word was selected
    if (!startElement.is(endElement) && keyWhitelist.test(String.fromCharCode(e.data.keyCode))) {

      // calculate start and end times of selection and replace with one word
      var start = startElement.data('start');
      var end = endElement.data('end');
      var next = endElement.data('next');
      editor.insertHtml('<a data-start="'+start+
                        '" data-end="'+end+
                        '" data-next="'+next+'">'+
                        '</a>', 'unfiltered_html');
      startElement.remove();
      endElement.remove();
      return true;
    }
  };

  var initialize = function(options) {
    id = options.id;
    play = options.play;
    pause = options.pause;
    seek = options.seek;
    updateEDL = options.edl;
    editor = CKEditor.inline(id, {
      removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link,dragdrop,basket',
      resize_enabled: false,
      allowedContent: 'a p[*](*); u s',
      title: false,
      coreStyles_bold: {
        element: 'u',
        //overrides: 'b',
        childRule: function(e) { return !e.is('a'); }
      },
      coreStyles_strike: {
        element: 's',
        parentRule: function(e) { return e.is('p'); },
        childRule: function(e) { return e.is('a'); }
      },
      on: {
        //selectionChange: wordClick,
        doubleclick: wordDblClick,
        //change: pause,
        key: keyHandler,
        contentDom: function() { $('#transcript').mouseup(wordClick); },
        drop: function() { return false; }
      }
    });
  };
  var refresh = function() {
    if (loadedAsset)
    {
      updateEDL(Utils.wordsToEDL(Utils.HTMLtoWords(editor.getData())), loadedAsset);
    }
    else {
      return false;
    }
    return true;
  };
  return {
    initialize: initialize,
    load: load,
    unload: unload,
    save: save,
    bold: bold,
    italic: italic,
    refresh: refresh
  };
});

