var exec = require('child_process').exec;
var FRAME_RATE=25;

exports.generate = function(words)
{
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

exports.process = function(inFilename, outFilename, edl)
{
  var cmd = 'melt';
  for (var i=0; i<edl.length; i++) {
    var inFrame = Math.round(edl[i][0]*FRAME_RATE);
    var outFrame = Math.round(edl[i][1]*FRAME_RATE);
    cmd += ' '+filename+' in='+inFrame+' out='+outFrame;
  }
  cmd += ' -consumer avformat:'+outFilename;
  console.log(cmd);
};
