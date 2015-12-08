define([
  'jquery'
], function($)
{
  // convert a transcript to HTML
  var transcriptToHTML = function(asset)
  {
    var html = '';
    var words = asset.transcript.words; 
    var segments = asset.segments.segments;
    var currentSegment = 0;

    // for each word
    for (var i=0; i<words.length; i++) {

      // if there is a change in speaker
      if (currentSegment < segments.length &&
          words[i].start > segments[currentSegment].start) {

        // start a new paragraph
        var speaker = segments[currentSegment].speaker['@id'];
        var gender = segments[currentSegment].speaker.gender;
        if (currentSegment>0) html += '</p>';
        html += '<p><span class="speaker '+gender+'">['+speaker+']</span> ';
        currentSegment += 1;
      }

      // note word and its start and end times (in millisecs)
      var word = words[i].word;
      var startTime = words[i].start * 1000;
      var endTime = words[i].end * 1000;

      // note start time of next word (for detecting cuts)
      if (i+1 >= words.length)
        var nextTime = startTime+endTime;
      else
        var nextTime = words[i+1].start * 1000;

      // if word confidence is low, class as unsure
      var confidence = '';
      if (words[i].confidence && words[i].confidence < 0.8)
          confidence = ' class="unsure"';

      html += '<a data-start="'+startTime+
               '" data-end="'+endTime+
               '" data-next="'+nextTime+'"'+
               confidence+'>'+word+' </a>';
    }
    html += '</p>';
    return html;
  };

  // convert HTML into a transcript object
  var HTMLtoWords = function(html) {
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

  // convert a transcript object to a list of inpoints and outpoints
  var wordsToEDL = function(words) {
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
    return edl;
  };

  // convert a list of inpoints and outpoints to a playlist for
  // html5-video-compositor
  var edlToPlaylist = function(edl, src) {
    var playlist = [];
    var time = 0;
    for (var i=0; i<edl.length; i++) {
      var duration = edl[i][1]-edl[i][0];
      playlist.push({
        type: 'video',
        sourceStart: edl[i][0],
        start: time,
        duration: duration,
        src: src,
        id: i+1
      });
      time = time+duration;
    }
    return {tracks: [playlist]};
  };
  var ajaxError = function() {
    alert('Could not communicate with server. Please check your connection.');
  };
  var uploadError = function() {
    alert('Upload failed. Please check your connection and ensure that you only upload valid video or audio files.');
  };
  return {
    transcriptToHTML: transcriptToHTML,
    HTMLtoWords: HTMLtoWords,
    wordsToEDL: wordsToEDL,
    edlToPlaylist: edlToPlaylist,
    ajaxError: ajaxError,
    uploadError: uploadError
  };
});
