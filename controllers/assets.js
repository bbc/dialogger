var consts = require('../config/consts');
var mimovie = require('mimovie');
var mkdirp = require('mkdirp');
var fs = require('fs');
var stt = require('../helpers/stt');
var previewFile = require('../helpers/previewfile');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

function transcodeResponse(err, options) 
{
  if (err) {
    log.error(err);
    db.assets.updateById(options.asset, {
      $set: {
        errorMessage: consts.msg.previewErr,
        error: true
      }
    }, function(err, result) {
      if (err) log.error(err);
    });
  } else {
    log.info({asset: options.asset}, 'Preview file generated');
    db.assets.updateById(options.asset, {
      $set: {
        previewPath: options.outputPath,
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
          errorMessage: consts.msg.sttErr,
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
          var options = {
            asset: doc._id,
            inputPath: doc.path,
            outputPath: consts.files.assets+req.user.username+'/previews/'+doc._id
          };
          if (doc.info.video_tracks) {
            options.format = 'video';
            options.video = consts.preview.video;
          } else {
            options.format = 'audio';
            options.audio = consts.preview.audio;
          }
          transcribe(doc);
          previewFile.generate(options, transcodeResponse);
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

      var path = doc[0].previewPath;
      var stat = fs.statSync(path);
      var total = stat.size;

      if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;

        var file = fs.createReadStream(path, {start: start, end: end});
        res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize/*,
          'Content-Type': 'video/mp4'*/
        });
        file.pipe(res);

      } else {

        console.log('ALL: ' + total);
        res.sendFile(path);
      }

    }
  });
};
