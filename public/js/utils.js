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
  var HTMLtoTranscript = function(html) {
    var words = [];
    $(html).find('a').each(function() {
      var word = $(this).text().trim();
      var start = $(this).attr('data-m');
      if (word) words.push({word: word, start: start});
    });
    console.log(words);
    return words;
  };
  return {
    transcriptToHTML: transcriptToHTML,
    HTMLtoTranscript: HTMLtoTranscript
  };
});
