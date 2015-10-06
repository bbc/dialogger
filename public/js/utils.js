define([
  'jquery'
], function($)
{
  var transcriptToHTML = function(transcript) {
    var html = '';
    for (var i=0; i<transcript.words.length; i++) {
      var word = transcript.words[i].word;
      var startTime = transcript.words[i].start * 1000;
      html += '<a data-m="'+startTime+'">'+word+' </a>';
    }
    return html;
  };
  return {
    transcriptToHTML: transcriptToHTML
  };
});
