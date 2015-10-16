var consts = require('../config/consts');
var edl = require('../helpers/edl');
var melt = require('../helpers/melt');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

exports.download = function(req, res)
{
  melt.download(req.params.jobid, function(err, ready) {
    if (err) {
      log.error(err);
      res.status(500).send(err);
    } else if (ready) {
      res.sendFile(consts.melt.output+req.params.jobid,
          {'Content-Disposition': 'attachment; filename="example.wav"'});
    } else {
      res.sendStatus(202);
    }
  });
};

exports.transcode = function(req, res)
{
  db.edits.find({_id: req.params.id, owner: req.user._id}, function (err, docs) {
    if (err) log.error(err);
    else if (!docs.length) res.status(500);
    else {
      db.assets.find({_id: docs[0].asset, owner: req.user._id}, function (err, assets) {
        if (err) {
          log.error(err);
          res.status(500);
        } else if (!assets.length) {
          res.status(500);
        } else {
          var options = req.body;
          options.path = assets[0].path;
          options.edl = edl.generate(docs[0].transcript.words);

          melt.transcode(options, function(err, jobid) {
            if (err) {
              log.error(err);
              res.status(500);
            } else {
              log.info({options: options, username: req.user.username}, 'Transcoding started');
              res.json({success: true, jobid: jobid});
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
    asset: req.body.assetid,
    name: req.body.name,
    description: req.body.description,
    transcript: req.body.transcript,
    html: req.body.html,
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
  db.edits.update({_id: req.params.id, owner: req.user._id},
      {$set: {
        transcript: req.body.transcript,
        html: req.body.html,
        dateModified: new Date()
      }}, function(err, result) {
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
       fields: {transcript: 0, html: 0}}, function(err, docs) {
    if (err) log.error(err);
    else res.json(docs);
  });
};

exports.edit = function(req, res)
{
  // list a certain edit 
  db.edits.find({_id: req.params.id, owner: req.user._id},
      function(err, docs) {
    if (err) log.error(err);
    else res.json(docs);
  });
};
