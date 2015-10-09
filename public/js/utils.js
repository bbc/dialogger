define([
  'jquery'
], function($)
{
  var transcriptToHTML = function(transcript) {
    var html = '';
    for (var i=0; i<transcript.words.length; i++) {
      var word = transcript.words[i].word;
      var startTime = transcript.words[i].start * 1000;
      var endTime = transcript.words[i].end * 1000;
      if (i+1 >= transcript.words.length)
        var nextTime = startTime+endTime;
      else
        var nextTime = transcript.words[i+1].start * 1000;
      html += '<a data-start="'+startTime+
               '" data-end="'+endTime+
               '" data-next="'+nextTime+'">'+word+' </a>';
    }
    return html;
  };
  var HTMLtoTranscript = function(html) {
    var words = [];
    $(html).find('a').each(function() {
      var word = $(this).text().trim();
      var start = $(this).data('start')/1000;
      var end = $(this).data('end')/1000;
      var next = $(this).data('next')/1000;
      if (word) words.push({word: word, start: start, end: end, next: next});
    });
    return words;
  };
  return {
    transcriptToHTML: transcriptToHTML,
    HTMLtoTranscript: HTMLtoTranscript
  };
});
