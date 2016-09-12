define([
  'jquery'
], function($)
{
  // convert a transcript to HTML
  var transcriptToHTML = function(model)
  {
    var html = '';
    var words = model.transcript.words;
    var segments = model.segments.segments;
    var currentSegment = 0;
    var prevSpeaker;
    var deletedFlag = false;
    var selectedFlag = false;

    // for each word
    for (var i=0; i<words.length; i++) {

      // if there is a change in speaker
      if (currentSegment < segments.length &&
          words[i].start > segments[currentSegment].start) {

        // start a new paragraph
        var speaker = segments[currentSegment].speaker['@id'];
        if (prevSpeaker != speaker) {
          var gender = segments[currentSegment].speaker.gender;
          if (currentSegment>0) html += '</p>';
          html += '<p class="speaker '+gender+'" data-speaker="'+speaker+
            '" data-time="'+millisecFormat(words[i].start*1000)+'">';
          prevSpeaker = speaker;
        }
        currentSegment += 1;
      }

      // note word and its start and end times (in millisecs)
      var word = words[i].word;
      if ("punct" in words[i]) word = words[i].punct;
      var startTime = Math.round(words[i].start * 1000);
      var endTime = Math.round(words[i].end * 1000);

      // hide words flagged as deleted
      if ("delete" in words[i]) {
        if (words[i].delete == "true" && deletedFlag == false) {
          html += '<s>';
          deletedFlag = true;
        } else if (words[i].delete == "false" && deletedFlag == true) {
          html += '</s>';
          deletedFlag = false;
        }
      } else if (deletedFlag == true) {
        html += '</s>';
        deletedFlag = false;
      }

      // bold words flagged as selected
      if ("select" in words[i] || "lineselect" in words[i]) {
        if ((words[i].select == "true" || words[i].lineselect == "true") && selectedFlag == false) {
          html += '<u>';
          selectedFlag = true;
        } else if (words[i].select == "false" && selectedFlag == true) {
          html += '</u>';
          selectedFlag = false;
        }
      } else if (selectedFlag == true) {
        html += '</u>';
        selectedFlag = false;
      }

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
               ' data-content="'+millisecFormat(startTime)+'"'+
               confidence+'>'+word+' </a>';
    }
    html += '</p>';
    return html;
  };

  // convert HTML into a transcript object
  var HTMLtoWords = function(html, underlinedOnly) {
    var words = [];
    var range;
    if (underlinedOnly) {
      range = $(html).find('u a').not('s u a').not('u s a');
    } else {
      range = $(html).find('a').not('s a');
    }
    range.each(function() {
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
  var checkSaved = function(changed) {
    if (!changed) return false;
    if (confirm('Your changed have not been saved. Are you sure you want to continue?')) return false;
    return true;
  };
  var ajaxError = function() {
    $('.lost-connection.nag').nag('show');
  };
  var uploadError = function() {
    alert('Upload failed. Please check your connection and ensure that you only upload valid video or audio files.');
  };
  var millisecFormat = function(ms) {
    ms = ms/1000;
    var hours = parseInt(ms/60/60)%24;
    var mins = parseInt(ms/60)%60;
    var secs = parseInt(ms%60);
    return ((hours<10?'0'+hours:hours)+':'+(mins<10?'0'+mins:mins)+':'+(secs<10?'0'+secs:secs));
  };
  return {
    transcriptToHTML: transcriptToHTML,
    HTMLtoWords: HTMLtoWords,
    wordsToEDL: wordsToEDL,
    edlToPlaylist: edlToPlaylist,
    ajaxError: ajaxError,
    uploadError: uploadError,
    checkSaved: checkSaved,
    millisecFormat: millisecFormat
  };
});
