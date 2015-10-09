var consts = require('../config/consts');
var edl = require('../helpers/edl');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

exports.download = function(req, res)
{
  db.edits.find({_id: req.params.id, owner: req.user._id}, function (err, docs) {
    if (err) log.error(err);
    else {
      res.json(edl.generate(docs[0].words));
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
       fields: {transcript: 0}}, function(err, docs) {
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
