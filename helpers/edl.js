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
  return edl;
};
