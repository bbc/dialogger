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
          ready: true,
          transcript: transcript,
          segments: segments
        }
      }, function(err, result) {
        if (err) log.error(err);
      });
    }
  });
};

exports.save = function(req, res)
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
        ready: false,
        error: false,
        dateCreated: new Date(),
        dateModified: new Date(),
        status: consts.stt.preStatus
      }, function(err, doc) {
        if (err) {
          log.error(err);
          res.status(500);
        } else {

          // transcribe recording
          transcribe(doc);
          log.info({asset: doc, username: req.user.username}, 'Asset uploaded');
          res.json(doc);
        }
      });
    }
  });
};

exports.assets = function(req, res)
{
  // list user's assets
  db.assets.find(
      {owner: req.user._id},
      {sort: {dateCreated: 1},
       fields: {transcript: 0, segments: 0}}, function(err, docs) {
    if (err) log.error(err);
    else res.json(docs);
  });
};

exports.asset = function(req, res)
{
  // list a certain asset
  db.assets.find({_id: req.params.id, owner: req.user._id},
      function(err, docs) {
    if (err) log.error(err);
    else res.json(docs);
  });
};

exports.update = function(req, res)
{
  db.assets.find({_id: req.params.id, owner: req.user._id}, function(err, doc)
  {
    if (err) {
      log.error(err);
      res.status(500);

    // save update
    } else {
      db.assets.updateById(req.params.id,
        { $set: {
          name: req.body.name,
          dateModified: new Date()} }, function(err, result) {
        if (err) {
          log.error(err);
          res.status(500);
        } else {
          log.info({asset: req.body, username: req.user.username}, 'Asset renamed');
          res.json(result);
        }
      });
    }
  });
};

exports.destroy = function(req, res)
{
  db.assets.find({_id: req.params.id, owner: req.user._id}, function(err, doc)
  {
    if (err) {
      log.error(err);
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
          log.info({asset: req.params.id, username: req.user.username}, 'Deleted asset');
          res.json({success: true});
        }
      });
    }
  });
};
