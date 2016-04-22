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
  var hasChanged = false;
  
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
      hasChanged = false;
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
      hasChanged = false;
    }
  };

  var unload = function() {
    load(defaultData, 'html', null);
  };

  var wordClick = function(e)
  {
    // select entire word
    var selection = editor.getSelection();
    var range = editor.createRange();
    var start = selection.getRanges()[0].startContainer;
    var end = selection.getRanges()[0].endContainer;
    range.setStartAt(start, CKEditor.POSITION_AFTER_START);
    range.setEndAt(end, CKEditor.POSITION_BEFORE_END);
    //range.setEnd(range.endContainer, range.endOffset - 1);
    editor.getSelection().selectRanges([range]);

    showTimestamps();
  };

  var showTimestamps = function() {
    var selection = editor.getSelection();
    var range = editor.createRange();
    var startElement = selection.getRanges()[0].startContainer.$.parentElement;
    var endElement = selection.getRanges()[0].endContainer.$.parentElement;

    if ($(startElement).is(endElement)) {
      $(startElement).popup({
        on: 'manual',
        exclusive: true
      }).popup('show');
    } else {
      $(startElement).popup({
        on: 'manual',
        exclusive: true,
        position: 'top left'
      }).popup('show');
      $(endElement).popup({
        on: 'manual',
        position: 'bottom right'
      }).popup('show');
    }
  };

  var hideTimestamps = function() {
    var selection = editor.getSelection();
    var range = editor.createRange();
    var startElement = selection.getRanges()[0].startContainer.$.parentElement;
    var endElement = selection.getRanges()[0].endContainer.$.parentElement;

    $(startElement).popup('hide');
    $(endElement).popup('hide');
  };

  var wordDblClick = function(e) {
    var start = $(editor.getSelection().getRanges()[0].startContainer.$.parentElement).data('start');
    seek(start/1000);
    hideTimestamps();
    //play(1.0);
  };

  var keyHandler = function(e)
  {
    // find selection details
    var selection = editor.getSelection();
    var range = selection.getRanges()[0];
    var startElement = $(range.startContainer.$.parentElement);
    var endElement = $(range.endContainer.$.parentElement);

    hideTimestamps();

    // if delete or backspace key is pressed, wrap in <s>
    if (!range.collapsed)
    {
      if (e.data.keyCode == 46 || e.data.keyCode == 8)
      {
        editor.execCommand('strike');
        pause();
        refresh();
        return false;
      }
      else if (e.data.keyCode == 32)
      {
        $('#playButton').click();
        return false;
      }
    }

    // if more than one word was selected
    if (!startElement.is(endElement) &&
        keyWhitelist.test(String.fromCharCode(e.data.keyCode)) &&
        !e.data.domEvent.$.ctrlKey)
    {
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
      plugins: 'basicstyles,undo',
      //removePlugins: 'toolbar,contextmenu,liststyle,tabletools,elementspath,link,dragdrop,basket,clipboard',
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
        childRule: function(e) { return (e.is('a') && !e.is('p')); }
      },
      on: {
        //selectionChange: wordClick,
        doubleclick: wordDblClick,
        change: function() { hasChanged = true; },
        key: keyHandler,
        contentDom: function() {
          $('#'+id).mouseup(wordClick);
          $('#'+id).mousedown(hideTimestamps);
          $('#'+id).on('cut copy paste drop', function() { return false; });
        }
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
    refresh: refresh,
    hasChanged: function() { return hasChanged; }
  };
});

