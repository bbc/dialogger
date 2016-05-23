var consts = require('../config/consts');
var mimovie = require('mimovie');
var mkdirp = require('mkdirp');
var fs = require('fs');
var stt = require('../helpers/stt-kaldi');
var transcoder = require('../helpers/transcoder');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

// Generate preview version
function transcode(doc, destFolder, cb)
{
  // Configure transcoding settings
  var options = {
    name: 'preview.mp4',
    path: doc.path
  };
  if (doc.info.video_tracks) {
    options.format = 'video';
    options.video = consts.transcoder.videoPreview;
  } else {
    options.format = 'audio';
    options.audio = consts.transcoder.audioPreview;
  }
  log.info(options);

  // Start transcoding job
  transcoder.transcode(options, true, function(err, jobid) {
    if (err) cb(err, doc, undefined);
    else {

      // Make sure preview folder exists
      mkdirp(destFolder, function(err) {
        if (err) cb(err, doc, undefined);
        else

          // Move preview file
          fs.rename(consts.transcoder.output+jobid,
                    destFolder+'/'+doc._id, function(err) {
            if (err) cb(err, doc, undefined);
            else cb(null, doc, destFolder+'/'+doc._id);
          });
      });
    }
  });
};

function transcodeResponse(err, doc, path)
{
  if (err) {
    log.error(err);
    db.assets.updateById(doc._id, {
      $set: {
        errorMessage: consts.transcoder.errStatus,
        error: true
      }
    }, function(err, result) {
      if (err) log.error(err);
    });
  } else {
    log.info({asset: doc}, 'Preview file generated');
    db.assets.updateById(doc._id, {
      $set: {
        previewPath: path,
        transcoded: true
      }
    }, function(err, result) {
      if (err) log.error(err);
    });
  }
};

function transcribe(doc)
{
  // Start transcription job
  stt.transcribe(doc.path,
      function(err, transcript, segments) {
    if (err) {
      log.error(err);
      db.assets.updateById(doc._id, {
        $set: {
          errorMessage: consts.stt.errStatus,
          error: true
        }
      }, function(err, result) {
        if (err) log.error(err);
      });
    } else {
      log.info({asset: doc}, 'Transcription generated');
      db.assets.updateById(doc._id, {
        $set: {
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
      res.sendStatus(500);
    } else {

      // save to database
      db.assets.insert({
        owner: req.user._id,
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        info: info,
        ready: false,
        transcoded: false,
        error: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      }, function(err, doc) {
        if (err) {
          log.error(err);
          res.sendStatus(500);
        } else {

          // Process asset
          var previewPath = consts.files.assets+req.user.username+
                            '/previews';
          transcribe(doc);
          transcode(doc, previewPath, transcodeResponse);
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
  var fields = {dateModified: new Date()};
  if (req.body.name) fields.name = req.body.name;

  db.assets.find({_id: req.params.id, owner: req.user._id}, function(err, doc)
  {
    if (err) {
      log.error(err);
      res.sendStatus(500);

    // save update
    } else {
      db.assets.updateById(req.params.id, {$set: fields}, function(err, result) {
        if (err) {
          log.error(err);
          res.sendStatus(500);
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
      res.sendStatus(500);

    } else {

      // delete original file
      fs.unlink(doc[0].path, function(err) {
        if (err) log.error(err);
      });

      // delete preview file
      if (doc[0].transcoded) {
        fs.unlink(doc[0].previewPath, function(err) {
          if (err) log.error(err);
        });
      }

      // remove edits from database
      db.edits.remove({asset: req.params.id}, function(err) {
        if (err) {
          log.error(err);
          res.sendStatus(500);
        } else {

          // remove asset from database
          db.assets.remove({_id: req.params.id}, function(err) {
            if (err) {
              log.error(err);
              res.sendStatus(500);
            } else {
              log.info({asset: req.params.id, username: req.user.username}, 'Deleted asset');
              res.json({success: true});
            }
          });
        }
      });
    }
  });
};

exports.preview = function(req, res)
{
  db.assets.find({_id: req.params.id}, function(err, doc)
  {
    if (err) {
      log.error(err);
      res.status(500).send(err);
    } else {
      res.sendFile(doc[0].previewPath);
    }
  });
};
