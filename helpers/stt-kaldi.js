var consts = require('../config/consts');
var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');

exports.transcribe = function(audioFile, cb)
{
  request.post({url: consts.stt.upload, json: {path: audioFile}},
      function (err, res, body)
  {
    if (err) {
      cb('Speech-to-text failed at upload stage.', undefined, undefined);
      return;
    } else {
      check(body.jobid, cb);
    }
  });
};

function check(job, cb)
{
  request({url: consts.stt.status+job, json: true}, function(err, res, status)
  {
    if (err) {
      cb('Could not find status of speech-to-text job', undefined, undefined);
      return;
    }

    if (status.ready && !status.error)
    {
      download(job, cb);
    }
    else if (status.error)
    {
      cb('Error occured in speech-to-text processing', undefined, undefined);
      return;
    }
    else
    {
      var nextCheck = new Date();
      nextCheck.setSeconds(nextCheck.getSeconds() + consts.stt.checkInterval);
      var checker = schedule.scheduleJob(nextCheck,
          function() { check(job, cb); });
    }
  });
};

function download(job, cb)
{
  request({url: consts.stt.transcript+job, json: true},
      function(err, res, transcript)
  {
    if (err) {
      cb('Could not download transcript results', undefined, undefined);
      return;
    }
    request({url: consts.stt.segments+job, json: true},
        function(err, res, segments)
    {
      if (err) {
        cb('Could not download segment results', undefined, undefined);
        return;
      }
      cb(null, transcript, segments);
    });
  });
};
