var consts = require('../config/consts');
var fileexport = require('../helpers/fileexport');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

exports.download = function(req, res)
{
  var returnStatus = req.path.indexOf('status') > -1 ? true : false;
  db.exports.find({_id: req.params.jobid}, function (err, doc) {
    if (err) {
      log.error(err);
      res.status(500).send(err);
    } else if (!doc.success) {
      res.status(500);
    } else if (!doc.ready) {
      res.status(202).json({ready: false});
    } else if (returnStatus) {
      res.json({ready: true});
    } else {
      res.download(doc.path, doc.name);
    }
  });
};

exports.transcode = function(req, res)
{
  db.edits.find({_id: req.params.id, owner: req.user._id}, function (err, docs) {
    if (err) log.error(err);
    else if (!docs.length) res.sendStatus(500);
    else {
      db.assets.find({_id: docs[0].asset, owner: req.user._id}, function (err, assets) {
        if (err) {
          log.error(err);
          res.sendStatus(500);
        } else if (!assets.length) {
          res.sendStatus(500);
        } else {

          // prepare options
          var options = {};
          options.edl = req.body.edl;
          delete req.body.edl;
          options.form = req.body;
          options.asset = {};
          options.asset.path = assets[0].path;
          options.asset.description = docs[0].description;
          options.asset.filename = docs[0].name;

          // extra audio metadata
          if (assets[0].info.audio_tracks.length) {
            var audioTrack = assets[0].info.audio_tracks[0];
            options.asset.audio = {};
            options.asset.audio.sampleRate = audioTrack.sample_rate;
            options.asset.audio.channels = audioTrack.ch;
          }

          // add export job to database
          db.exports.insert({
            ready: false,
            success: true,
            owner: req.user._id,
            asset: docs[0].asset,
            name: options.form.name,
            edl: options.edl,
            dateStarted: new Date()
          }, function(err, doc) {
            if (err) {
              log.error(err);
              res.sendStatus(500);
            } else {
              fileexport.fileexport(options, doc._id, function(err, id, path) {
                if (err) {
                  log.error(err);
                  db.export.update({_id: id}, {ready: true, success: false});
                } else {
                  log.info({id: id}, 'Export successful');
                  db.export.update({_id: id}, {path: path, ready: true}); 
                }
              });
              log.info({options: options, username: req.user.username}, 'Transcoding started');
              res.json({success: true, jobid: doc._id});
            }
          });
        }
      });
    }
  });
};

exports.save = function(req, res)
{
  db.edits.insert({
    owner: req.user._id,
    asset: req.body.asset,
    name: req.body.name,
    description: req.body.description,
    transcript: req.body.transcript,
    html: req.body.html,
    edl: req.body.edl,
    dateCreated: new Date(),
    dateModified: new Date()
  }, function(err, doc) {
    if (err) {
      log.error(err);
    } else {
      log.info({edit: doc, username: req.user.username}, 'Created edit');
      res.json(doc);
    }
  });
};

exports.update = function(req, res)
{
  var fields = {dateModified: new Date()};
  if (req.body.transcript) fields.transcript = req.body.transcript;
  if (req.body.html) fields.html = req.body.html;
  if (req.body.edl) fields.edl = req.body.edl;
  if (req.body.name) fields.name = req.body.name;
  if (req.body.description) fields.description = req.body.description;
  db.edits.update({_id: req.params.id, owner: req.user._id},
      {$set: fields}, function(err, result) {
    if (err) {
      log.error(err);
    } else {
      log.info({edit: req.body, username: req.user.username}, 'Updated edit');
      res.json(result);
    }
  });
};

exports.destroy = function(req, res)
{
  db.edits.remove({_id: req.params.id, owner: req.user._id}, function(err) {
    if (err) {
      log.error(err);
    } else {
      log.info({edit: req.params.id, username: req.user.username}, 'Deleted edit');
      res.json({success: true});
    }
  });
};

exports.edits = function(req, res)
{
  // list user's edits 
  db.edits.find(
      {owner: req.user._id},
      {sort: {dateCreated: 1},
       fields: {transcript: 0, html: 0, edl: 0}}, function(err, docs) {
    if (err) log.error(err);
    else res.json(docs);
  });
};

exports.edit = function(req, res)
{
  // list a certain edit 
  db.edits.find({_id: req.params.id, owner: req.user._id},
      function(err, docs) {
    if (err) {
      log.error(err);
    } else {
      res.json(docs);
    }
  });
};
