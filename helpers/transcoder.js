var consts = require('../config/consts');
var request = require('request');

exports.transcode = function(options, cb)
{
  request.post({url: consts.melt.upload,
                json: options},
      function (err, res, body)
  {
    if (err && body.jobid) {
      cb('Transcoding failed at upload stage.', undefined);
    } else {
      cb(null, body.jobid);
    }
  });
};

exports.download = function(job, cb) {
  request({url: consts.melt.status+job, json: true}, function(err, res, status)
  {
    if (err) {
      cb('Could not find status of transcoding job', undefined);
    } else if (status.error) {
      cb('Transcoding failed', undefined);
    } else {
      cb(null, status.ready);
    }
  });
};
