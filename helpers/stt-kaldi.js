var consts = require('./config/consts');
var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');

exports.transcribe = function(audioFile, resultFile, callback)
{
  request.post({url: consts.stt.upload, json: true, body: {path: audioFile}},
      function (err, res, body)
  {
    if (err) {
      callback('Speech-to-text failed at upload stage.');
      return;
    } else {
      try {
        var job = JSON.parse(body).jobid;
        check(job, resultFile, callback);
      } catch(e) {
        callback('Invalid response from speech-to-text service');
      }
    }
  });
};

function check(job, resultFile, callback)
{
  request(consts.stt.status+job, function(err, res, body)
  {
    if (err) {
      callback('Could not find status of speech-to-text job');
      return;
    }

    try {
      var status = JSON.parse(body);
    } catch(e) {
      callback('Invalid response from speech-to-text service');
      return;
    }

    if (status.ready)
    {
      download(job, resultFile, callback);
    }
    else if (status.error)
    {
      callback('Error occured in speech-to-text processing');
      return;
    }
    else
    {
      var nextCheck = new Date();
      nextCheck.setSeconds(nextCheck.getSeconds() + consts.stt.checkInterval);
      var checker = schedule.scheduleJob(nextCheck,
          function() { check(job, resultFile, callback); });
    }
  });
};

function download(job, resultFile, callback)
{
  request(consts.stt.transcript+job, function(err, res, body)
  {
    if (err) {
      callback('Could not download speech-to-text results');
      return;
    }
    fs.writeFile(resultFile, body);
    callback(null);
  });
};
