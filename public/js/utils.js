define([
  'jquery'
], function($)
{
  var transcriptToHTML = function(asset) {
    var html = '';
    var words = asset.transcript.words; 
    var segments = asset.segments.segments;
    var currentSegment = 0;
    for (var i=0; i<words.length; i++) {
      if (currentSegment < segments.length &&
          words[i].start > segments[currentSegment].start) {
        var speaker = segments[currentSegment].speaker['@id'];
        var gender = segments[currentSegment].speaker.gender;
        if (currentSegment>0) html += '</p>';
        html += '<p><span class="speaker '+gender+'">['+speaker+']</span> ';
        currentSegment += 1;
      }
      var word = words[i].word;
      var startTime = words[i].start * 1000;
      var endTime = words[i].end * 1000;
      if (i+1 >= words.length)
        var nextTime = startTime+endTime;
      else
        var nextTime = words[i+1].start * 1000;
      html += '<a data-start="'+startTime+
               '" data-end="'+endTime+
               '" data-next="'+nextTime+'">'+word+' </a>';
    }
    html += '</p>';
    return html;
  };
  var HTMLtoTranscript = function(html) {
    var words = [];
    $(html).find('a').not('.hidden a').each(function() {
      var word = $(this).text().trim();
      var start = $(this).data('start')/1000;
      var end = $(this).data('end')/1000;
      var next = $(this).data('next')/1000;
      if (word) words.push({word: word, start: start, end: end, next: next});
    });
    return words;
  };
  var transcriptToEDL = function(words) {
    var edl=[];
    var inpoint = -1;
    for (var i=0; i<words.length-1; i++) {
      if (inpoint<0) inpoint = words[i].start;
      if (words[i+1].start != words[i].next) {
        edl.push([inpoint,words[i].end]);
        inpoint = -1;
      }
    }
    if (inpoint) edl.push([inpoint, words[words.length-1].end]);
  };
  return {
    transcriptToHTML: transcriptToHTML,
    HTMLtoTranscript: HTMLtoTranscript,
    transcriptToEDL: transcriptToEDL
  };
});
