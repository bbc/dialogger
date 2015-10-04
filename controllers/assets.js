var consts = require('../config/consts');
var mimovie = require('mimovie');
var fs = require('fs');
var stt = require('../helpers/stt-kaldi');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

function transcribe(doc)
{
  // transcribe asset using STT service
  stt.transcribe(doc.path,
      function(err, transcript, segments) {
    if (err) {
      log.error(err);
      db.assets.updateById(doc._id, {
        $set: {
          status: consts.stt.errStatus,
          error: true
        }
      }, function(err, result) {
        if (err) log.error(err);
      });
    } else {
      log.info({asset: doc}, 'Transcription generated');
      db.assets.updateById(doc._id, {
        $set: {
          status: consts.stt.postStatus,
          transcript: transcript,
          segments: segments
        }
      }, function(err, result) {
        if (err) log.error(err);
      });
    }
  });
};

exports.upload = function(req, res)
{
  // extract information about file
  mimovie(req.file.path, function(err, info) {
    if (err) {
      log.error(err, 'Mediainfo failed');
      res.status(500);
    } else {

      // save to database
      db.assets.insert({
        owner: req.user._id,
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        info: info,
        error: false,
        created: new Date(),
        status: consts.stt.preStatus
      }, function(err, doc) {
        if (err) {
          log.error(err);
          res.status(500);
        } else {

          // transcribe recording
          transcribe(doc);
          log.info({asset: doc}, 'Asset uploaded');
          res.json(doc);
        }
      });
    }
  });
};

exports.assets = function(req, res)
{
  // list user's assets
  db.assets.find({owner: req.user._id}, {sort: {created: 1}}, function(err, docs) {
    if (err) log.error(err);
    else res.json(docs);
  });
};

exports.save = function(req, res)
{
  db.assets.findById(req.params.id, function(err, doc)
  {
    if (err) {
      log.error(err);
      res.status(500);

    // check owner
    } else if (!doc.owner.equals(req.user._id)) {
      log.error({asset: doc}, 'Asset requested without permission');
      res.status(500);

    // save update
    } else {
      db.assets.updateById(req.params.id,
        { $set: {name: req.body.name} }, function(err, result) {
        if (err) {
          log.error(err);
          res.status(500);
        } else {
          log.info({asset: req.body}, 'Asset renamed');
          res.json(result);
        }
      });
    }
  });
};

exports.destroy = function(req, res)
{
  db.assets.findById(req.params.id, function(err, doc)
  {
    if (err) {
      log.error(err);
      res.status(500);

    // check owner
    } else if (!doc.owner.equals(req.user._id)) {
      log.error({asset: doc}, 'Asset requested without permission');
      res.status(500);

    // delete file and document
    } else {
      fs.unlink(doc.path, function(err) {
        if (err) log.error(err);
      });
      db.assets.remove({_id: req.params.id}, function(err) {
        if (err) {
          log.error(err);
          res.status(500);
        } else {
          log.info({asset: req.params.id}, 'Deleted asset');
          res.json({success: true});
        }
      });
    }
  });
};
